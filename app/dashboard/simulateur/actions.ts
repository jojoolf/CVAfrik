'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PLANS } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function startSimulation(data: { cvId: string; poste: string; nombreQuestions: number }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie' }

    // Check plan limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, simulations_faites_ce_mois')
      .eq('id', user.id)
      .single()

    const plan = PLANS.find(p => p.id === profile?.plan) || PLANS[0]
    if (plan.id === 'gratuit' && (profile?.simulations_faites_ce_mois || 0) >= 3) {
      return { success: false, error: 'Limite de 3 simulations atteinte ce mois-ci.' }
    }

    // Get CV data
    const { data: cv } = await supabase
      .from('cvs')
      .select('donnees')
      .eq('id', data.cvId)
      .single()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `
      Tu es un recruteur expert. Tu vas mener un entretien d'embauche pour le poste de "${data.poste}".
      Voici les infos du candidat (CV) : ${JSON.stringify(cv?.donnees)}.
      
      Pose la toute premiere question de l'entretien (courte et professionnelle). 
      Ne dis rien d'autre que la question.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const firstQuestion = response.text()

    // Save simulation session
    const { data: sim, error } = await supabase
      .from('simulations_entretien')
      .insert({
        user_id: user.id,
        cv_id: data.cvId,
        messages: [{ role: 'assistant', content: firstQuestion }],
        nombre_questions: data.nombreQuestions,
        poste: data.poste
      })
      .select()
      .single()

    if (error) {
      console.error("Erreur insertion simulations_entretien:", error)
      throw new Error(`Erreur lors de la creation de la simulation: ${error.message}`)
    }

    // Increment user simulation count in profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        simulations_faites_ce_mois: (profile?.simulations_faites_ce_mois || 0) + 1
      })
      .eq('id', user.id)

    if (profileError) {
      console.error("Erreur update profile simulations_faites_ce_mois:", profileError)
    }

    return { success: true, id: sim.id, firstQuestion }
  } catch (error) {
    console.error("Erreur startSimulation:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur technique.' }
  }
}

export async function sendMessage(id: string, message: string, history: any[]) {
  try {
    const supabase = await createClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Read the simulation to get nombre_questions
    const { data: sim } = await supabase
      .from('simulations_entretien')
      .select('nombre_questions')
      .eq('id', id)
      .single()

    const nombreQuestions = sim?.nombre_questions ?? 8
    const maxMessages = nombreQuestions * 2

    if (history.length >= maxMessages) {
      const prompt = `
        L'entretien est termine. Analyse la conversation suivante et donne un feedback constructif au candidat.
        CONVERSATION : ${JSON.stringify(history)}
        
        FORMAT DE REPONSE : 
        1. Donne un score sur 100 (uniquement le nombre).
        2. Un feedback structure avec les sections suivantes (en Markdown) :
           - **Points forts**
           - **Axes d'amelioration**
           - **Conseils pratiques**
        
        Retourne sous format JSON: {"score": 85, "feedback": "Ton texte ici avec le markdown..."}
        
        Important : Le feedback doit etre professionnel, bien structure et directement affichable.
      `
      const result = await model.generateContent(prompt)
      const response = await result.response
      
      let data;
      try {
        const text = response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const jsonStr = jsonMatch ? jsonMatch[0] : text
        data = JSON.parse(jsonStr)
      } catch (parseError) {
        console.error("Erreur parse feedback JSON:", parseError)
        data = { score: 70, feedback: response.text() }
      }

      const { error: updateError } = await supabase
        .from('simulations_entretien')
        .update({ 
          messages: history, 
          feedback: data.feedback, 
          score: data.score 
        })
        .eq('id', id)

      if (updateError) {
        console.error("Erreur update simulations_entretien:", updateError)
        throw new Error(`Erreur lors de la mise à jour finale de la simulation: ${updateError.message}`)
      }

      return { success: true, isFinished: true, feedback: data.feedback, score: data.score }
    }

    // Sinon on continue l'entretien
    const prompt = `
      Continue l'entretien d'embauche. Question ${Math.floor(history.length / 2) + 1}/${nombreQuestions}.
      Pose la prochaine question basee sur la conversation precedente.
      CONVERSATION : ${JSON.stringify(history)}
      
      Reste dans ton role de recruteur. Sois bref et professionnel.
    `
    const result = await model.generateContent(prompt)
    const nextQuestion = (await result.response).text()

    const { error: updateError } = await supabase
      .from('simulations_entretien')
      .update({ messages: [...history, { role: 'assistant', content: nextQuestion }] })
      .eq('id', id)

    if (updateError) {
      console.error("Erreur update simulations_entretien:", updateError)
      throw new Error(`Erreur lors de la mise à jour de la simulation: ${updateError.message}`)
    }

    return { success: true, isFinished: false, nextQuestion }
  } catch (error) {
    console.error("Erreur sendMessage:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la génération.' }
  }
}

export async function getUserSimulations() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie', data: [] }

    const { data, error } = await supabase
      .from('simulations_entretien')
      .select('id, poste, score, nombre_questions, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Erreur getUserSimulations:", error)
    return { success: false, error: 'Erreur lors du chargement.', data: [] }
  }
}

export async function getSimulationById(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie' }

    const { data, error } = await supabase
      .from('simulations_entretien')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erreur getSimulationById:", error)
    return { success: false, error: 'Simulation introuvable.' }
  }
}
