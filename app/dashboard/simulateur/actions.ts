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

export async function startEnhancedSimulation(data: {
  cvId: string
  poste: string
  sector: 'finance' | 'tech' | 'marketing' | 'hr' | 'sales' | 'other'
  interviewType: 'behavioral' | 'technical' | 'mixed' | 'case_study'
  nombreQuestions: number
}) {
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
    let cvDonnees = {}
    if (data.cvId) {
      const { data: cv } = await supabase
        .from('cvs')
        .select('donnees')
        .eq('id', data.cvId)
        .single()
      if (cv) cvDonnees = cv.donnees
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `
      Tu es un recruteur expert dans le secteur "${data.sector}". Tu vas mener un entretien d'embauche de type "${data.interviewType}" pour le poste de "${data.poste}".
      Voici les infos du candidat (CV) : ${JSON.stringify(cvDonnees)}.
      
      Pose la toute premiere question de l'entretien. Elle doit etre courte, chaleureuse, professionnelle, adaptee au poste et au secteur.
      Ne dis rien d'autre que la question. Pas d'introduction hors-role, pas de commentaires. Pose directement la question.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const firstQuestion = response.text().trim()

    // Save simulation session in simulations_entretien_v2
    const { data: sim, error } = await supabase
      .from('simulations_entretien_v2')
      .insert({
        user_id: user.id,
        cv_id: data.cvId || null,
        position: data.poste,
        sector: data.sector,
        interview_type: data.interviewType,
        nombre_questions: data.nombreQuestions,
        messages: [{ role: 'assistant', content: firstQuestion }]
      })
      .select()
      .single()

    if (error) {
      console.error("Erreur insertion simulations_entretien_v2:", error)
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
    console.error("Erreur startEnhancedSimulation:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur technique.' }
  }
}

export async function sendEnhancedMessage(id: string, message: string, history: any[]) {
  try {
    const supabase = await createClient()
    
    // Read the simulation to get details
    const { data: sim } = await supabase
      .from('simulations_entretien_v2')
      .select('*')
      .eq('id', id)
      .single()

    if (!sim) {
      return { success: false, error: 'Simulation introuvable.' }
    }

    const nombreQuestions = sim.nombre_questions ?? 5
    const maxMessages = nombreQuestions * 2

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    if (history.length >= maxMessages) {
      // Entretien termine, generation du feedback structure
      const prompt = `
        L'entretien d'embauche est termine. Tu as joue le rôle de recruteur pour le poste de "${sim.position}" dans le secteur "${sim.sector}".
        Le type d'entretien était "${sim.interview_type}".
        
        Analyse l'ensemble de la conversation suivante :
        ${JSON.stringify(history)}
        
        Genere un feedback detaille au format JSON respectant strictement le schema suivant:
        {
          "score": number (score global sur 100),
          "scoreDetails": {
            "communication": number (score sur 100 pour l'expression, le ton et la clarte),
            "technicalKnowledge": number (score sur 100 pour la maitrise des concepts du poste),
            "softSkills": number (score sur 100 pour l'attitude, la posture et les competences relationnelles),
            "relevance": number (score sur 100 pour la pertinence et la reponse directe aux questions)
          },
          "strengths": string[] (3 a 5 points forts constates chez le candidat),
          "improvements": string[] (3 a 5 axes d'amelioration avec explications),
          "practicalAdvice": string[] (3 a 5 conseils concrets pour s'ameliorer),
          "sectorSpecificFeedback": string (analyse specifique liee aux standards du secteur "${sim.sector}"),
          "nextSteps": string[] (3 prochaines etapes recommandees pour sa recherche ou sa preparation)
        }
        
        Assure-toi de repondre STRICTEMENT en format JSON valide.
      `
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
      
      const responseText = result.response.text()
      let feedbackData;
      try {
        feedbackData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erreur parse feedback JSON v2:", parseError, responseText)
        // Fallback in case of JSON parse error
        feedbackData = {
          score: 70,
          scoreDetails: { communication: 70, technicalKnowledge: 70, softSkills: 70, relevance: 70 },
          strengths: ["Bonne participation active."],
          improvements: ["Développer les réponses techniques."],
          practicalAdvice: ["S'entraîner régulièrement."],
          sectorSpecificFeedback: `Analyse pour le secteur ${sim.sector}`,
          nextSteps: ["Continuer l'entraînement."]
        }
      }

      const { error: updateError } = await supabase
        .from('simulations_entretien_v2')
        .update({ 
          messages: history, 
          feedback: feedbackData, 
          score: feedbackData.score,
          completed_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error("Erreur update simulations_entretien_v2:", updateError)
        throw new Error(`Erreur lors de la mise à jour finale de la simulation: ${updateError.message}`)
      }

      return { success: true, isFinished: true, feedback: feedbackData, score: feedbackData.score }
    }

    // Sinon on continue l'entretien
    const prompt = `
      Tu es un recruteur professionnel dans le secteur "${sim.sector}". Tu menes un entretien de type "${sim.interview_type}" pour le poste de "${sim.position}".
      Continue l'entretien d'embauche. Question ${Math.floor(history.length / 2) + 1}/${nombreQuestions}.
      Pose la prochaine question basee sur la conversation precedente.
      
      CONVERSATION : ${JSON.stringify(history)}
      
      Reste strictement dans ton role de recruteur. Sois bref, percutant et professionnel. Ne fais aucune remarque meta, pose juste la question.
    `
    const result = await model.generateContent(prompt)
    const nextQuestion = (await result.response).text().trim()

    const { error: updateError } = await supabase
      .from('simulations_entretien_v2')
      .update({ messages: [...history, { role: 'assistant', content: nextQuestion }] })
      .eq('id', id)

    if (updateError) {
      console.error("Erreur update simulations_entretien_v2:", updateError)
      throw new Error(`Erreur lors de la mise à jour de la simulation: ${updateError.message}`)
    }

    return { success: true, isFinished: false, nextQuestion }
  } catch (error) {
    console.error("Erreur sendEnhancedMessage:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la génération.' }
  }
}

export async function getUserSimulationsV2() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie', data: [] }

    const { data, error } = await supabase
      .from('simulations_entretien_v2')
      .select('id, position, sector, interview_type, score, nombre_questions, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Erreur getUserSimulationsV2:", error)
    return { success: false, error: 'Erreur lors du chargement.', data: [] }
  }
}

export async function getSimulationV2ById(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie' }

    const { data, error } = await supabase
      .from('simulations_entretien_v2')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Erreur getSimulationV2ById:", error)
    return { success: false, error: 'Simulation introuvable.' }
  }
}
