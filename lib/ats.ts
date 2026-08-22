import type { CVDonnees } from '@/lib/types'

const STOP_WORDS = new Set([
  'avec', 'dans', 'pour', 'des', 'les', 'une', 'un', 'par', 'sur', 'que', 'qui', 'vous', 'nous', 'notre', 'votre', 'plus', 'moins', 'sont', 'sera', 'être', 'avoir', 'afin', 'ainsi', 'dont', 'cette', 'ceci', 'leur', 'leurs', 'poste', 'emploi', 'offre', 'entreprise', 'organisation', 'profil', 'recherche', 'recherchons', 'missions', 'mission', 'expérience', 'experience', 'candidat', 'candidate', 'candidature', 'français', 'francais', 'anglais', 'niveau', 'tous', 'toutes', 'from', 'with', 'that', 'this', 'will', 'your', 'have', 'the', 'and', 'for', 'job', 'role', 'team', 'work', 'years', 'year', 'skills', 'skill',
])

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function keywords(value: string) {
  return [...new Set(
    normalize(value)
      .match(/[a-z0-9+#.-]{3,}/g)
      ?.filter((word) => !STOP_WORDS.has(word)) || [],
  )]
}

function flattenCv(data: CVDonnees) {
  return [
    data.titre_professionnel,
    data.resume,
    ...data.competences.map((item) => item.nom),
    ...data.langues.map((item) => item.nom),
    ...data.certifications?.flatMap((item) => [item.nom, item.organisme]) || [],
    ...data.experiences.flatMap((item) => [item.poste, item.entreprise, item.description, ...item.realisations]),
    ...data.formations.flatMap((item) => [item.diplome, item.etablissement, item.description || '']),
  ].filter(Boolean).join(' ')
}

export interface AtsResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  breakdown: { keywords: number; experience: number; structure: number; impact: number }
}

export function analyzeCvAgainstJob(cvData: CVDonnees, jobDescription: string): AtsResult {
  const cvText = normalize(flattenCv(cvData))
  const jobKeywords = keywords(jobDescription).slice(0, 30)
  const matchedKeywords = jobKeywords.filter((word) => cvText.includes(word))
  const missingKeywords = jobKeywords.filter((word) => !cvText.includes(word)).slice(0, 10)
  const keywordScore = jobKeywords.length ? Math.round((matchedKeywords.length / jobKeywords.length) * 45) : 0
  const experiences = cvData.experiences.length
  const experienceScore = Math.min(25, experiences * 7 + (cvData.experiences.some((item) => item.realisations.length > 0) ? 4 : 0))
  const sections = [cvData.titre_professionnel, cvData.resume, cvData.formations.length, cvData.competences.length, cvData.langues.length].filter(Boolean).length
  const structureScore = Math.round((sections / 5) * 15)
  const impactScore = Math.min(15, cvData.experiences.reduce((sum, item) => sum + item.realisations.length, 0) * 3)
  const score = Math.max(0, Math.min(100, keywordScore + experienceScore + structureScore + impactScore))

  const suggestions: string[] = []
  if (missingKeywords.length) suggestions.push(`Ajoutez uniquement si elles sont réelles les compétences pertinentes manquantes : ${missingKeywords.slice(0, 5).join(', ')}.`)
  if (!cvData.resume?.trim()) suggestions.push('Ajoutez un résumé professionnel ciblé qui reprend le poste et les priorités de l’offre.')
  if (!cvData.experiences.some((item) => item.realisations.length > 0)) suggestions.push('Ajoutez des réalisations mesurables dans vos expériences : résultats, volume, délai ou amélioration obtenue.')
  if (cvData.competences.length < 5) suggestions.push('Complétez la section Compétences avec vos savoir-faire réellement maîtrisés et pertinents pour l’offre.')
  if (!suggestions.length) suggestions.push('Votre CV couvre déjà bien les termes et les sections essentielles. Vérifiez que les réalisations les plus pertinentes sont placées en premier.')

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 12),
    missingKeywords,
    suggestions,
    breakdown: { keywords: keywordScore, experience: experienceScore, structure: structureScore, impact: impactScore },
  }
}
