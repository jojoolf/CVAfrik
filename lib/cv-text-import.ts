import type { Certification, Competence, CVDonnees, Experience, Formation, Langue } from '@/lib/types'

export interface StructuredCvImportResult {
  data: Partial<CVDonnees>
  summary: {
    experiences: number
    formations: number
    competences: number
    langues: number
    certifications: number
  }
}

type Section = 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'other'

const months: Record<string, string> = {
  jan: '01', janvier: '01', feb: '02', fev: '02', fevr: '02', fevrier: '02', février: '02', mar: '03', mars: '03', apr: '04', avr: '04', avril: '04', may: '05', mai: '05', jun: '06', juin: '06', jul: '07', juillet: '07', aug: '08', aou: '08', aout: '08', août: '08', sep: '09', sept: '09', septembre: '09', oct: '10', octobre: '10', nov: '11', novembre: '11', dec: '12', decembre: '12', décembre: '12', january: '01', february: '02', march: '03', april: '04', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
}

const languageNames = new Set(['francais', 'français', 'anglais', 'english', 'french', 'espagnol', 'spanish', 'allemand', 'german', 'portugais', 'portuguese', 'arabe', 'arabic', 'fon', 'yoruba', 'ewé', 'ewe'])

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9+&/ ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function tidy(value: string) {
  return value.replace(/^[•·▪◦\-–—\s]+/, '').replace(/\s+/g, ' ').trim()
}

function unique<T>(values: T[], key: (item: T) => string) {
  const seen = new Set<string>()
  return values.filter((item) => {
    const identifier = key(item)
    if (!identifier || seen.has(identifier)) return false
    seen.add(identifier)
    return true
  })
}

function makeId(prefix: string, index: number) {
  return `text-${prefix}-${index + 1}`
}

function splitName(fullName: string) {
  const pieces = tidy(fullName).split(/\s+/).filter(Boolean)
  if (pieces.length < 2) return { prenom: pieces[0] || '', nom: '' }
  const upperCaseLastNames = pieces.filter((piece) => /^[A-ZÀ-Ý]{2,}$/.test(piece))
  if (upperCaseLastNames.length) {
    const nom = upperCaseLastNames.join(' ')
    return { prenom: pieces.filter((piece) => !upperCaseLastNames.includes(piece)).join(' '), nom }
  }
  return { prenom: pieces.slice(0, -1).join(' '), nom: pieces.at(-1) || '' }
}

function textLines(text: string) {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .flatMap((line) => line.split(/\s{3,}/))
    .map(tidy)
    .filter((line) => line.length > 1)
    .filter((line, index, values) => index === 0 || line !== values[index - 1])
}

function getSection(line: string): Section | null {
  const heading = normalize(line)
  if (heading.length > 42) return null
  if (/^(profil|profile|a propos|about|resume|summary|objectif|objective|presentation)$/.test(heading)) return 'summary'
  if (/^(experience|experiences|experience professionnelle|professional experience|work experience|emploi|emplois|parcours professionnel)$/.test(heading)) return 'experience'
  if (/^(formation|formations|education|parcours academique|academic background)$/.test(heading)) return 'education'
  if (/^(competence|competences|skills|technical skills|savoir faire|expertise)$/.test(heading)) return 'skills'
  if (/^(langue|langues|languages)$/.test(heading)) return 'languages'
  if (/^(certification|certifications|certificats|certificates|formations certifiantes)$/.test(heading)) return 'certifications'
  if (/^(interets|centres d interet|hobbies|references|reference)$/.test(heading)) return 'other'
  return null
}

function sectionsFrom(lines: string[]) {
  const sections: Record<Section, string[]> = { header: [], summary: [], experience: [], education: [], skills: [], languages: [], certifications: [], other: [] }
  let active: Section = 'header'
  for (const line of lines) {
    const section = getSection(line)
    if (section) {
      active = section
      continue
    }
    sections[active].push(line)
  }
  return sections
}

function normalizeDate(value: string) {
  const raw = normalize(value).replace(/\./g, ' ')
  const year = raw.match(/(?:19|20)\d{2}/)?.[0]
  if (!year) return ''
  const numeric = raw.match(/(?:^|\s)(0?[1-9]|1[0-2])\s*[/-]\s*(?:19|20)\d{2}/)
  if (numeric) return `${year}-${numeric[1].padStart(2, '0')}`
  const month = Object.entries(months).find(([name]) => new RegExp(`(?:^|\\s)${name}(?:\\s|$)`).test(raw))?.[1]
  return `${year}-${month || '01'}`
}

function dateRange(value: string) {
  const normalized = value.replace(/[–—]/g, '-').replace(/\bto\b/gi, '-').replace(/\bau\b/gi, '-').replace(/\bà\b/gi, '-')
  const matches = normalized.match(/(?:(?:jan(?:vier)?|f[eé]v(?:rier)?|mar(?:s)?|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sep(?:tembre)?|oct(?:obre)?|nov(?:embre)?|d[eé]c(?:embre)?|january|february|march|april|may|june|july|august|september|october|november|december)?\.?\s*(?:19|20)\d{2}|(?:0?[1-9]|1[0-2])[/-](?:19|20)\d{2}|(?:19|20)\d{2})/gi)
  if (!matches?.length) return null
  const endRaw = matches[1] || ''
  const current = /present|current|aujourd|en cours|maintenant/i.test(value)
  return { start: normalizeDate(matches[0]), end: current ? '' : normalizeDate(endRaw), current }
}

function isLikelyName(value: string) {
  const line = tidy(value)
  const words = line.split(/\s+/)
  return words.length >= 2 && words.length <= 5 && line.length <= 48 && !/\d|@|http|linkedin|tel|phone|\+/.test(line) && !getSection(line)
}

function contactData(lines: string[]) {
  const joined = lines.join(' ')
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
  const linkedin = joined.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Z0-9_%.-]+/i)?.[0] || ''
  const phone = joined.match(/(?:\+?\d[\d .()/-]{7,}\d)/)?.[0]?.replace(/\s{2,}/g, ' ').trim() || ''
  return { email, linkedin, phone }
}

function splitEntries(lines: string[]) {
  const entries: string[][] = []
  let current: string[] = []
  for (const line of lines) {
    const hasRange = Boolean(dateRange(line))
    const looksLikeHeader = /\s(?:\||—|@)\s|\bchez\b|\bat\b/i.test(line)
    if (current.length && (hasRange || (looksLikeHeader && current.length >= 2))) {
      entries.push(current)
      current = []
    }
    current.push(line)
  }
  if (current.length) entries.push(current)
  return entries.filter((entry) => entry.some((line) => tidy(line).length > 2))
}

function parseExperience(lines: string[]): Experience[] {
  const experiences = splitEntries(lines).map((entry, index) => {
    const rangeLineIndex = entry.findIndex((line) => Boolean(dateRange(line)))
    const range = rangeLineIndex >= 0 ? dateRange(entry[rangeLineIndex]) : null
    const headerIndex = entry.findIndex((line, itemIndex) => itemIndex !== rangeLineIndex && tidy(line).length > 2)
    const header = headerIndex >= 0 ? tidy(entry[headerIndex]) : 'Expérience professionnelle'
    const [posteRaw, companyRaw] = header.split(/\s+(?:chez|at)\s+|\s[|@]\s|\s—\s/i, 2)
    const details = entry.filter((_, itemIndex) => itemIndex !== rangeLineIndex && itemIndex !== headerIndex).map(tidy).filter(Boolean)
    return {
      id: makeId('experience', index),
      poste: posteRaw || 'Expérience professionnelle',
      entreprise: companyRaw || '',
      ville: '',
      pays: '',
      date_debut: range?.start || '',
      date_fin: range?.end || '',
      en_cours: range?.current || false,
      description: details.join(' '),
      realisations: details.filter((detail) => detail.length > 8),
    }
  }).filter((item) => item.poste !== 'Expérience professionnelle' || item.description || item.entreprise)
  return unique(experiences, (item) => `${normalize(item.poste)}-${normalize(item.entreprise)}-${item.date_debut}`).slice(0, 12)
}

function parseEducation(lines: string[]): Formation[] {
  const formations = splitEntries(lines).map((entry, index) => {
    const rangeLineIndex = entry.findIndex((line) => Boolean(dateRange(line)))
    const range = rangeLineIndex >= 0 ? dateRange(entry[rangeLineIndex]) : null
    const content = entry.filter((_, itemIndex) => itemIndex !== rangeLineIndex).map(tidy).filter(Boolean)
    const first = content[0] || 'Formation'
    const second = content[1] || ''
    const split = first.split(/\s+(?:à|at)\s+|\s[|—]\s/i, 2)
    const schoolLike = /(universit|ecole|école|institut|lycee|lycée|college|collège|school|academy|centre)/i
    const diplome = schoolLike.test(first) && second ? second : split[0] || 'Formation'
    const etablissement = schoolLike.test(first) ? first : split[1] || (schoolLike.test(second) ? second : '')
    const description = content.filter((item) => item !== first && item !== second).join(' ')
    return { id: makeId('education', index), diplome, etablissement, ville: '', pays: '', date_debut: range?.start || '', date_fin: range?.end || '', en_cours: range?.current || false, description: description || undefined }
  }).filter((item) => item.diplome !== 'Formation' || item.etablissement)
  return unique(formations, (item) => `${normalize(item.diplome)}-${normalize(item.etablissement)}-${item.date_debut}`).slice(0, 10)
}

function parseSkills(lines: string[]): Competence[] {
  const rawSkills = lines.flatMap((line) => line.split(/[•·▪◦,;|]/)).map(tidy).filter((item) => item.length >= 2 && item.length <= 60)
  const skills = unique(rawSkills, (item) => normalize(item)).slice(0, 30)
  return skills.map((nom, index) => ({ id: makeId('skill', index), nom, niveau: 'intermediaire', categorie: 'technique' }))
}

function languageLevel(value: string): Langue['niveau'] {
  const normalized = normalize(value)
  if (/natif|native|maternelle|mother tongue/.test(normalized)) return 'natif'
  if (/bilingue|bilingual/.test(normalized)) return 'bilingue'
  if (/courant|fluent|professionnel|professional|avance|advanced/.test(normalized)) return 'courant'
  if (/debutant|basic|elementary/.test(normalized)) return 'debutant'
  return 'intermediaire'
}

function parseLanguages(lines: string[]): Langue[] {
  const possible = lines.flatMap((line) => line.split(/[•·▪◦,;|]/)).map(tidy)
  const languages = possible.map((line) => {
    const [name] = line.split(/\s*[:—–-]\s*/, 1)
    return { nom: name, niveau: languageLevel(line) }
  }).filter((item) => languageNames.has(normalize(item.nom)))
  return unique(languages, (item) => normalize(item.nom)).slice(0, 12).map((item, index) => ({ ...item, id: makeId('language', index) }))
}

function parseCertifications(lines: string[]): Certification[] {
  const certifications = splitEntries(lines).map((entry, index) => {
    const range = entry.map(dateRange).find(Boolean)
    const name = tidy(entry[0] || '')
    const organisation = tidy(entry.find((line, itemIndex) => itemIndex > 0 && !dateRange(line)) || '')
    return { id: makeId('certification', index), nom: name, organisme: organisation, date_obtention: range?.start || '', date_expiration: range?.end || undefined }
  }).filter((item) => item.nom.length > 2)
  return unique(certifications, (item) => normalize(item.nom)).slice(0, 15)
}

export function parseCvText(text: string): StructuredCvImportResult {
  const lines = textLines(text)
  const sections = sectionsFrom(lines)
  const contacts = contactData(lines.slice(0, 12))
  const nameLine = sections.header.find(isLikelyName) || lines.find(isLikelyName) || ''
  const { prenom, nom } = splitName(nameLine)
  const headerCandidates = sections.header.filter((line) => line !== nameLine && !/[@+]|linkedin|https?:\/\//i.test(line))
  const title = headerCandidates.find((line) => line.length < 100) || ''
  const summary = sections.summary.length ? sections.summary.join(' ').slice(0, 1400) : headerCandidates.slice(1, 4).join(' ').slice(0, 1000)
  const experiences = parseExperience(sections.experience)
  const formations = parseEducation(sections.education)
  const competences = parseSkills(sections.skills)
  const langues = parseLanguages(sections.languages)
  const certifications = parseCertifications(sections.certifications)

  return {
    data: {
      informations_personnelles: { prenom, nom, email: contacts.email, telephone: contacts.phone, adresse: '', linkedin: contacts.linkedin },
      titre_professionnel: title,
      resume: summary,
      experiences,
      formations,
      competences,
      langues,
      certifications,
    },
    summary: { experiences: experiences.length, formations: formations.length, competences: competences.length, langues: langues.length, certifications: certifications.length },
  }
}
