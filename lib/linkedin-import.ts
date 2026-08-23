import JSZip from 'jszip'
import Papa from 'papaparse'
import type { CVDonnees, Certification, Competence, Experience, Formation, Langue } from '@/lib/types'

export interface LinkedInImportResult {
  data: Partial<CVDonnees>
  summary: {
    experiences: number
    formations: number
    competences: number
    langues: number
    certifications: number
  }
}

type CsvRow = Record<string, string | undefined>

const emptySummary = () => ({ experiences: 0, formations: 0, competences: 0, langues: 0, certifications: 0 })

function value(row: CsvRow, ...keys: string[]) {
  for (const key of keys) {
    const matchingKey = Object.keys(row).find((candidate) => candidate.trim().toLowerCase() === key.toLowerCase())
    const content = matchingKey ? row[matchingKey]?.trim() : ''
    if (content) return content
  }
  return ''
}

function toDate(valueToConvert: string) {
  const value = valueToConvert.trim()
  if (!value) return ''
  if (/^\d{4}-\d{2}/.test(value)) return value.slice(0, 7)
  if (/^\d{4}$/.test(value)) return `${value}-01`

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
  }
  return ''
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) return { prenom: parts[0] || '', nom: '' }
  return { prenom: parts.slice(0, -1).join(' '), nom: parts.at(-1) || '' }
}

function parseCsv(content: string) {
  return Papa.parse<CsvRow>(content, { header: true, skipEmptyLines: 'greedy' }).data
}

function findFile(zip: JSZip, filename: string) {
  const normalized = filename.toLowerCase()
  return Object.values(zip.files).find((file) => !file.dir && file.name.toLowerCase().endsWith(`/${normalized}`))
    || Object.values(zip.files).find((file) => !file.dir && file.name.toLowerCase() === normalized)
}

function toExperiences(rows: CsvRow[]): Experience[] {
  const experiences: Experience[] = []
  rows.forEach((row, index) => {
    const poste = value(row, 'Title', 'Position', 'Job Title')
    const entreprise = value(row, 'Company Name', 'Company', 'Organisation')
    if (!poste && !entreprise) return
    const end = value(row, 'Finished On', 'End Date')
    const enCours = /present|current|aujourd|today/i.test(end) || !end
    experiences.push({
      id: `linkedin-exp-${index}`,
      poste: poste || 'Expérience professionnelle',
      entreprise: entreprise || 'Organisation non précisée',
      ville: value(row, 'Location', 'City'),
      pays: '',
      date_debut: toDate(value(row, 'Started On', 'Start Date')),
      date_fin: enCours ? '' : toDate(end),
      en_cours: enCours,
      description: value(row, 'Description'),
      realisations: [],
    })
  })
  return experiences
}

function toFormations(rows: CsvRow[]): Formation[] {
  const formations: Formation[] = []
  rows.forEach((row, index) => {
    const etablissement = value(row, 'School Name', 'School', 'Institution')
    const diplome = [value(row, 'Degree Name', 'Degree'), value(row, 'Field Of Study', 'Field of Study')].filter(Boolean).join(' — ')
    if (!etablissement && !diplome) return
    const end = value(row, 'End Date', 'Finished On')
    formations.push({
      id: `linkedin-edu-${index}`,
      diplome: diplome || 'Formation',
      etablissement: etablissement || 'Établissement non précisé',
      ville: '',
      pays: '',
      date_debut: toDate(value(row, 'Start Date', 'Started On')),
      date_fin: toDate(end),
      en_cours: /present|current|aujourd|today/i.test(end),
      description: value(row, 'Activities') || undefined,
    })
  })
  return formations
}

function toSkills(rows: CsvRow[]): Competence[] {
  return rows
    .map((row, index) => value(row, 'Name', 'Skill'))
    .filter(Boolean)
    .slice(0, 24)
    .map((nom, index) => ({ id: `linkedin-skill-${index}`, nom, niveau: 'intermediaire', categorie: 'technique' as const }))
}

function toLanguages(rows: CsvRow[]): Langue[] {
  const langues: Langue[] = []
  rows.forEach((row, index) => {
    const nom = value(row, 'Name', 'Language')
    if (!nom) return
    const rawLevel = value(row, 'Proficiency', 'Level').toLowerCase()
    const niveau: Langue['niveau'] = rawLevel.includes('native') ? 'natif' : rawLevel.includes('full') || rawLevel.includes('professional') ? 'courant' : rawLevel.includes('limited') || rawLevel.includes('elementary') ? 'debutant' : 'intermediaire'
    langues.push({ id: `linkedin-lang-${index}`, nom, niveau })
  })
  return langues
}

function toCertifications(rows: CsvRow[]): Certification[] {
  const certifications: Certification[] = []
  rows.forEach((row, index) => {
    const nom = value(row, 'Name', 'Certification Name')
    if (!nom) return
    certifications.push({
      id: `linkedin-cert-${index}`,
      nom,
      organisme: value(row, 'Authority', 'Issuing Organization', 'Organisation'),
      date_obtention: toDate(value(row, 'Started On', 'Issue Date')),
      date_expiration: toDate(value(row, 'Finished On', 'Expiration Date')) || undefined,
    })
  })
  return certifications
}

export async function parseLinkedInExport(file: File): Promise<LinkedInImportResult> {
  if (!file.name.toLowerCase().endsWith('.zip')) throw new Error('Choisis un export LinkedIn au format ZIP.')
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const profileFile = findFile(zip, 'Profile.csv')
  if (!profileFile) throw new Error('Le fichier Profile.csv est introuvable dans cet export LinkedIn.')

  const profileRows = parseCsv(await profileFile.async('text'))
  const profile = profileRows[0] || {}
  const positionsFile = findFile(zip, 'Positions.csv')
  const educationFile = findFile(zip, 'Education.csv')
  const skillsFile = findFile(zip, 'Skills.csv')
  const languagesFile = findFile(zip, 'Languages.csv')
  const certificationsFile = findFile(zip, 'Certifications.csv')

  const experiences = positionsFile ? toExperiences(parseCsv(await positionsFile.async('text'))) : []
  const formations = educationFile ? toFormations(parseCsv(await educationFile.async('text'))) : []
  const competences = skillsFile ? toSkills(parseCsv(await skillsFile.async('text'))) : []
  const langues = languagesFile ? toLanguages(parseCsv(await languagesFile.async('text'))) : []
  const certifications = certificationsFile ? toCertifications(parseCsv(await certificationsFile.async('text'))) : []

  return {
    data: {
      informations_personnelles: {
        prenom: value(profile, 'First Name'),
        nom: value(profile, 'Last Name'),
        email: value(profile, 'Email Address'),
        telephone: '',
        adresse: value(profile, 'Geo Location', 'Location'),
        linkedin: value(profile, 'Public Profile URL', 'Public Profile Url'),
      },
      titre_professionnel: value(profile, 'Headline'),
      resume: value(profile, 'Summary', 'About'),
      experiences,
      formations,
      competences,
      langues,
      certifications,
    },
    summary: { experiences: experiences.length, formations: formations.length, competences: competences.length, langues: langues.length, certifications: certifications.length },
  }
}

const MAX_PDF_BYTES = 8 * 1024 * 1024

export async function parsePdfProfile(file: File): Promise<LinkedInImportResult> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Choisis un CV au format PDF.')
  }
  if (file.size === 0) throw new Error('Ce fichier PDF est vide.')
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('Ce PDF est trop lourd. Utilise un fichier de 8 Mo maximum, idéalement un PDF texte sans scan ni images.')
  }

  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/profile-import/pdf', { method: 'POST', body: formData })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error || 'Impossible de lire ce PDF.')
  return payload as LinkedInImportResult
}

export function parseProfileText(text: string): LinkedInImportResult {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const fullName = lines[0] || ''
  const title = lines[1] || ''
  const { prenom, nom } = splitName(fullName)
  const summaryStart = lines.findIndex((line) => /^about|résumé|profil|summary$/i.test(line))
  const resume = summaryStart >= 0 ? lines.slice(summaryStart + 1, summaryStart + 5).join(' ') : lines.slice(2, 6).join(' ')

  return {
    data: {
      informations_personnelles: { prenom, nom, email: '', telephone: '', adresse: '', linkedin: '' },
      titre_professionnel: title,
      resume,
      experiences: [],
      formations: [],
      competences: [],
      langues: [],
      certifications: [],
    },
    summary: emptySummary(),
  }
}
