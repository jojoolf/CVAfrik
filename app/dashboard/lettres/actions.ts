'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PLANS } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

type LetterStyleId = 'classique' | 'dynamique' | 'moderne'

export interface GeneratedLetter {
  styleId: LetterStyleId
  styleLabel: string
  styleDescription: string
  content: string
}

const LETTER_STYLES: Array<{
  styleId: LetterStyleId
  styleLabel: string
  styleDescription: string
  promptTone: string
  promptInstructions: string
}> = [
  {
    styleId: 'classique',
    styleLabel: 'Classique & Formel',
    styleDescription: 'Structure traditionnelle, ton serieux, ideal pour grands groupes et postes seniors.',
    promptTone: 'classique et formel',
    promptInstructions:
      'Utilise un style institutionnel, des transitions soignees et une conclusion polie orientee engagement.',
  },
  {
    styleId: 'dynamique',
    styleLabel: 'Dynamique & Percutant',
    styleDescription: "Accroche forte, verbes d'action, ideal pour startups et postes commerciaux.",
    promptTone: 'dynamique et percutant',
    promptInstructions:
      "Commence par une accroche energique, mets en avant les resultats et utilise des verbes d'action.",
  },
  {
    styleId: 'moderne',
    styleLabel: 'Moderne & Concis',
    styleDescription: 'Direct, lisible et adapte aux pratiques RH actuelles.',
    promptTone: 'moderne et concis',
    promptInstructions:
      'Va droit au but avec des paragraphes courts, un langage clair et une proposition de valeur immediate.',
  },
]

function cleanModelText(text: string) {
  return text
    .replace(/^```(?:text|markdown)?/i, '')
    .replace(/```$/i, '')
    .trim()
}

function buildCandidateSummary(cvData: any) {
  const prenom = cvData?.informations_personnelles?.prenom || ''
  const nom = cvData?.informations_personnelles?.nom || ''
  const titre = cvData?.titre_professionnel || 'Profil polyvalent'

  const experiences = Array.isArray(cvData?.experiences)
    ? cvData.experiences
        .map((e: any) => `${e?.poste || 'Poste'} chez ${e?.entreprise || 'Entreprise'}`)
        .slice(0, 6)
        .join(', ')
    : ''

  const competences = Array.isArray(cvData?.competences)
    ? cvData.competences
        .map((c: any) => c?.nom)
        .filter(Boolean)
        .slice(0, 12)
        .join(', ')
    : ''

  return {
    fullName: `${prenom} ${nom}`.trim() || 'Candidat',
    titre,
    experiences: experiences || 'A preciser',
    competences: competences || 'A preciser',
  }
}

function getMonthlyLimitError(limit: number) {
  return `Vous avez atteint votre limite de ${limit} lettres ce mois-ci. Passez au plan Pro pour un acces illimite !`
}

async function getProfileAndLetterLimit(userId: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, lettres_generees_ce_mois')
    .eq('id', userId)
    .single()

  if (!profile) {
    return { profile: null, limit: null as number | null }
  }

  const plan = PLANS.find((p) => p.id === profile.plan) || PLANS[0]
  return {
    profile,
    limit: plan.limites.lettres_par_mois,
  }
}

export async function generateThreeLetters(formData: {
  cvId: string
  destinataire: string
  entreprise: string
  poste: string
  offreEmploi: string
  secteurActivite: string
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non authentifie' as const }
    }

    const limitCheck = await getProfileAndLetterLimit(user.id)
    if (!limitCheck.profile) {
      return { success: false, error: 'Profil non trouve' as const }
    }

    if (
      limitCheck.limit !== null &&
      (limitCheck.profile.lettres_generees_ce_mois || 0) >= limitCheck.limit
    ) {
      return { success: false, error: getMonthlyLimitError(limitCheck.limit) }
    }

    const { data: cv } = await supabase
      .from('cvs')
      .select('donnees')
      .eq('id', formData.cvId)
      .eq('user_id', user.id)
      .single()

    if (!cv) return { success: false, error: 'CV non trouve' as const }

    const candidate = buildCandidateSummary(cv.donnees)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const commonPrompt = `
Tu es un expert en recrutement en Afrique francophone.
Redige une lettre de motivation en francais, professionnelle, realiste et convaincante.

INFOS CANDIDAT :
- Nom: ${candidate.fullName}
- Titre actuel: ${candidate.titre}
- Experiences cles: ${candidate.experiences}
- Competences cles: ${candidate.competences}

INFOS POSTE :
- Entreprise: ${formData.entreprise}
- Poste vise: ${formData.poste}
- Secteur d'activite: ${formData.secteurActivite || 'Non precise'}
- Destinataire: ${formData.destinataire || 'Responsable du recrutement'}
${formData.offreEmploi ? `- Extrait offre d'emploi: ${formData.offreEmploi}` : ''}

CONSIGNES COMMUNES :
- Structure attendue: En-tete, Objet, Salutation, Corps, Conclusion, Signature.
- Pas de fausses informations (contacts, chiffres, dates).
- Longueur cible: 250 a 420 mots.
- Retourne uniquement la lettre finale, sans commentaire externe.
`.trim()

    const letters = await Promise.all(
      LETTER_STYLES.map(async (style) => {
        const styledPrompt = `
${commonPrompt}

STYLE A APPLIQUER :
- Ton attendu: ${style.promptTone}
- Contraintes stylistiques: ${style.promptInstructions}
        `.trim()

        const result = await model.generateContent(styledPrompt)
        const response = await result.response
        const text = cleanModelText(response.text())

        return {
          styleId: style.styleId,
          styleLabel: style.styleLabel,
          styleDescription: style.styleDescription,
          content: text,
        } satisfies GeneratedLetter
      }),
    )

    return { success: true as const, letters }
  } catch (error) {
    console.error('Generation Three Letters Error:', error)
    return { success: false, error: 'Erreur technique lors de la generation.' as const }
  }
}

export async function saveLetter(data: {
  content: string
  titre: string
  cvId: string
  offreEmploi?: string
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non authentifie' as const }

    const content = data.content?.trim()
    if (!content) {
      return { success: false, error: 'Le contenu de la lettre est vide.' as const }
    }

    const limitCheck = await getProfileAndLetterLimit(user.id)
    if (!limitCheck.profile) {
      return { success: false, error: 'Profil non trouve' as const }
    }

    if (
      limitCheck.limit !== null &&
      (limitCheck.profile.lettres_generees_ce_mois || 0) >= limitCheck.limit
    ) {
      return { success: false, error: getMonthlyLimitError(limitCheck.limit) }
    }

    const { data: newLettre, error: saveError } = await supabase
      .from('lettres_motivation')
      .insert({
        user_id: user.id,
        cv_id: data.cvId,
        titre: data.titre || 'Lettre de motivation',
        contenu: content,
        offre_emploi: data.offreEmploi || null,
      })
      .select('id')
      .single()

    if (saveError) {
      console.error('Save letter error:', saveError)
      return { success: false, error: 'Erreur lors de la sauvegarde.' as const }
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        lettres_generees_ce_mois: (limitCheck.profile.lettres_generees_ce_mois || 0) + 1,
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile counter update error:', profileError)
    }

    return { success: true as const, id: newLettre.id }
  } catch (error) {
    console.error('Save Letter Error:', error)
    return { success: false, error: 'Erreur technique lors de la sauvegarde.' as const }
  }
}

export async function updateLettreContent(id: string, contenu: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

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
