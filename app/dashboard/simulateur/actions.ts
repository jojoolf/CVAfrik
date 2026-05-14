'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PLANS } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function startSimulation(data: { cvId: string; poste: string }) {
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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
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
        messages: [{ role: 'assistant', content: firstQuestion }]
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, id: sim.id, firstQuestion }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erreur technique.' }
  }
}

export async function sendMessage(id: string, message: string, history: any[]) {
  try {
    const supabase = await createClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const totalMessages = history.length
    
    // Si on a atteint 6 messages (3 questions/reponses), on finit et on donne le feedback
    if (totalMessages >= 6) {
      const prompt = `
        L'entretien est termine. Analyse la conversation suivante et donne un feedback constructif au candidat.
        CONVERSATION : ${JSON.stringify(history)}
        
        FORMAT DE REPONSE : 
        1. Donne un score sur 100 (uniquement le nombre).
        2. Un texte de feedback structure (Points forts, Axes d'amelioration, Conseils).
        
        Retourne sous format JSON: {"score": 85, "feedback": "Ton texte ici..."}
      `
      const result = await model.generateContent(prompt)
      const response = await result.response
      const data = JSON.parse(response.text().replace(/```json|```/g, ''))

      await supabase
        .from('simulations_entretien')
        .update({ 
          messages: history, 
          feedback: data.feedback, 
          score: data.score 
        })
        .eq('id', id)

      return { success: true, isFinished: true, feedback: data.feedback, score: data.score }
    }

    // Sinon on continue l'entretien
    const prompt = `
      Continue l'entretien d'embauche. Pose la prochaine question basee sur la conversation precedente.
      CONVERSATION : ${JSON.stringify(history)}
      
      Reste dans ton role de recruteur. Sois bref et professionnel.
    `
    const result = await model.generateContent(prompt)
    const nextQuestion = (await result.response).text()

    await supabase
      .from('simulations_entretien')
      .update({ messages: [...history, { role: 'assistant', content: nextQuestion }] })
      .eq('id', id)

    return { success: true, isFinished: false, nextQuestion }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erreur lors de la generation.' }
  }
}
