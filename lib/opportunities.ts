export const OPPORTUNITY_TYPES = [
  { id: 'emploi', label: 'Emplois', singular: 'Emploi' },
  { id: 'stage', label: 'Stages', singular: 'Stage' },
  { id: 'bourse', label: 'Bourses', singular: 'Bourse' },
  { id: 'programme', label: 'Programmes', singular: 'Programme' },
  { id: 'opportunite', label: 'Autres opportunités', singular: 'Opportunité' },
] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]['id']

export interface Opportunity {
  id: string
  type: OpportunityType
  titre: string
  slug: string
  organisation: string
  description: string
  pays: string | null
  ville: string | null
  remote: boolean
  niveau: string | null
  secteur: string | null
  date_limite: string | null
  lien_candidature: string | null
  image_url: string | null
  source_nom: string | null
  source_url: string | null
  publie: boolean
  created_at: string
  updated_at: string
}

export function getOpportunityType(type: string) {
  return OPPORTUNITY_TYPES.find((item) => item.id === type) || OPPORTUNITY_TYPES[4]
}

export function isOpportunityOpen(deadline: string | null) {
  if (!deadline) return true
  const endOfDay = new Date(`${deadline}T23:59:59`)
  return endOfDay >= new Date()
}
