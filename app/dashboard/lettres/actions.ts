'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PLANS } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateCoverLetter(formData: {
  cvId: string
  destinataire: string
  entreprise: string
  poste: string
  offreEmploi: string
  style: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non authentifie' }
    }

    // 1. Verifier le profil et les limites
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return { success: false, error: 'Profil non trouve' }

    const plan = PLANS.find(p => p.id === profile.plan) || PLANS[0]
    const limit = plan.limites.lettres_par_mois

    if (limit !== null && profile.lettres_generees_ce_mois >= limit) {
      return { 
        success: false, 
        error: `Vous avez atteint votre limite de ${limit} lettres ce mois-ci. Passez au plan Pro pour un acces illimite !` 
      }
    }

    // 2. Recuperer les donnees du CV
    const { data: cv } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', formData.cvId)
      .single()

    if (!cv) return { success: false, error: 'CV non trouve' }

    const cvData = cv.donnees

    // 3. Preparer le prompt pour Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
      Tu es un expert en recrutement en Afrique de l'Ouest. 
      Redige une lettre de motivation percutante et professionnelle en francais.
      
      INFOS CANDIDAT (Basees sur son CV) :
      - Nom: ${cvData.informations_personnelles.prenom} ${cvData.informations_personnelles.nom}
      - Titre actuel: ${cvData.titre_professionnel}
      - Experiences cles: ${cvData.experiences.map((e: any) => `${e.poste} chez ${e.entreprise}`).join(', ')}
      - Competences: ${cvData.competences.map((c: any) => c.nom).join(', ')}
      
      INFOS POSTE :
      - Entreprise: ${formData.entreprise}
      - Poste vise: ${formData.poste}
      - Destinataire: ${formData.destinataire || 'Responsable du recrutement'}
      - Style souhaite: ${formData.style}
      ${formData.offreEmploi ? `- Contexte de l'offre: ${formData.offreEmploi}` : ''}
      
      CONSIGNES :
      - La lettre doit etre structuree : En-tete, Objet, Salutations, Corps (Moi, Vous, Nous), Conclusion.
      - Adapte le ton au style "${formData.style}".
      - Ne depasse pas une page.
      - Ne mets pas de faux numeros de telephone ou adresses si elles ne sont pas fournies.
      - Retourne uniquement le texte de la lettre, sans commentaires additionnels.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // 4. Enregistrer la lettre dans la base de donnees
    const { data: newLettre, error: saveError } = await supabase
      .from('lettres_motivation')
      .insert({
        user_id: user.id,
        cv_id: formData.cvId,
        titre: `Lettre - ${formData.poste} (${formData.entreprise})`,
        contenu: text,
        offre_emploi: formData.offreEmploi,
      })
      .select()
      .single()

    if (saveError) {
      console.error(saveError)
      return { success: false, error: 'Erreur lors de la sauvegarde.' }
    }

    // 5. Incrementer le compteur de l'utilisateur
    await supabase
      .from('profiles')
      .update({ lettres_generees_ce_mois: (profile.lettres_generees_ce_mois || 0) + 1 })
      .eq('id', user.id)

    return { success: true, id: newLettre.id }
  } catch (error) {
    console.error('Generation Error:', error)
    return { success: false, error: 'Erreur technique lors de la generation.' }
  }
}

export async function updateLettreContent(id: string, contenu: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie' }

    const { error } = await supabase
      .from('lettres_motivation')
      .update({ contenu })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erreur lors de la mise a jour' }
  }
}
