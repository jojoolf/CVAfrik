export type CampaignAudience = 'all' | 'starter' | 'pro'
export type CampaignFrequency = 'once' | 'daily' | 'every_launch'
export type CampaignEventType = 'viewed' | 'dismissed' | 'clicked'

export type InAppCampaign = {
  id: string
  title: string
  body: string
  image_url: string
  action_label: string
  action_href: string
  audience: CampaignAudience
  frequency: CampaignFrequency
  starts_at: string
  ends_at: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export const CAMPAIGN_AUDIENCE_LABELS: Record<CampaignAudience, string> = {
  all: 'Tous les utilisateurs',
  starter: 'Seulement Starter',
  pro: 'Seulement Pro',
}

export const CAMPAIGN_FREQUENCY_LABELS: Record<CampaignFrequency, string> = {
  once: 'Une seule fois par utilisateur',
  daily: 'Au maximum une fois par jour',
  every_launch: 'À chaque ouverture',
}
