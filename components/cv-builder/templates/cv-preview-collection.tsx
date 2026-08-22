import type { ReactElement } from 'react'
import type { CVDonnees } from '@/lib/types'
import { CVPreviewClassique } from './cv-preview-classique'
import { CVPreviewModerne } from './cv-preview-moderne'
import { CVPreviewCreatif } from './cv-preview-creatif'
import { CVPreviewExecutif } from './cv-preview-executif'
import { CVPreviewTech } from './cv-preview-tech'
import { CVPreviewMinimaliste } from './cv-preview-minimaliste'
import { CVPreviewStartup } from './cv-preview-startup'
import { CVPreviewLuxe } from './cv-preview-luxe'
import { CVPreviewElite } from './cv-preview-elite'
import { CVPreviewDesign } from './cv-preview-design'
import { CVPreviewPremiumFinance } from './cv-preview-premium-finance'
import { CVPreviewPremiumTech } from './cv-preview-premium-tech'
import { CVPreviewPremiumMarketing } from './cv-preview-premium-marketing'
import { CVPreviewPremiumStudent } from './cv-preview-premium-student'
import { CVPreviewPremiumExecutive } from './cv-preview-premium-executive'

export type TemplatePlan = 'gratuit' | 'pro'

interface CVTemplateProps {
  data: CVDonnees
  showWatermark?: boolean
}

type BaseTemplateId =
  | 'classique'
  | 'moderne'
  | 'minimaliste'
  | 'creatif'
  | 'design'
  | 'tech'
  | 'executif'
  | 'startup'
  | 'luxe'
  | 'elite'
  | 'premium_finance'
  | 'premium_tech'
  | 'premium_marketing'
  | 'premium_student'
  | 'premium_executive'

export interface TemplateCatalogItem {
  id: BaseTemplateId
  name: string
  description: string
  plans: TemplatePlan[]
  color: string
  previewImage: string
  category: 'Gratuit' | 'Pro'
}

export const templateCatalog: TemplateCatalogItem[] = [
  { id: 'classique', name: 'Classique', description: 'Intemporel et parfaitement structuré', plans: ['gratuit', 'pro'], color: 'bg-slate-800', previewImage: '/template-previews/classique.jpg', category: 'Gratuit' },
  { id: 'moderne', name: 'Moderne', description: 'Contemporain, net et polyvalent', plans: ['gratuit', 'pro'], color: 'bg-blue-600', previewImage: '/template-previews/moderne.jpg', category: 'Gratuit' },
  { id: 'minimaliste', name: 'Minimaliste', description: 'Épuré, élégant et très lisible', plans: ['gratuit', 'pro'], color: 'bg-stone-500', previewImage: '/template-previews/minimaliste.jpg', category: 'Gratuit' },
  { id: 'creatif', name: 'Créatif', description: 'Asymétrique et expressif', plans: ['pro'], color: 'bg-rose-500', previewImage: '/template-previews/creatif.jpg', category: 'Pro' },
  { id: 'design', name: 'Design', description: 'Chaleureux, éditorial et raffiné', plans: ['pro'], color: 'bg-[#9c4f2b]', previewImage: '/template-previews/design.jpg', category: 'Pro' },
  { id: 'tech', name: 'Tech', description: 'Structuré pour les profils numériques', plans: ['pro'], color: 'bg-cyan-600', previewImage: '/template-previews/tech.jpg', category: 'Pro' },
  { id: 'executif', name: 'Exécutif', description: 'Corporate, précis et affirmé', plans: ['pro'], color: 'bg-slate-700', previewImage: '/template-previews/executif.jpg', category: 'Pro' },
  { id: 'startup', name: 'Startup', description: 'Impact, chiffres et énergie business', plans: ['pro'], color: 'bg-orange-500', previewImage: '/template-previews/startup.jpg', category: 'Pro' },
  { id: 'luxe', name: 'Luxe', description: 'Élégance éditoriale haut de gamme', plans: ['pro'], color: 'bg-amber-600', previewImage: '/template-previews/luxe.jpg', category: 'Pro' },
  { id: 'elite', name: 'Elite', description: 'Personal branding et portrait premium', plans: ['pro'], color: 'bg-[#0B1E36]', previewImage: '/template-previews/elite.jpg', category: 'Pro' },
  { id: 'premium_finance', name: 'Finance', description: 'Banque, stratégie et résultats', plans: ['pro'], color: 'bg-[#1e3a8a]', previewImage: '/template-previews/premium-finance.jpg', category: 'Pro' },
  { id: 'premium_tech', name: 'Premium Tech', description: 'Produit, engineering et data', plans: ['pro'], color: 'bg-cyan-500', previewImage: '/template-previews/premium-tech.jpg', category: 'Pro' },
  { id: 'premium_marketing', name: 'Marketing', description: 'Campagnes, créativité et croissance', plans: ['pro'], color: 'bg-purple-600', previewImage: '/template-previews/premium-marketing.jpg', category: 'Pro' },
  { id: 'premium_student', name: 'Student', description: 'Étudiants, projets et premières expériences', plans: ['pro'], color: 'bg-indigo-600', previewImage: '/template-previews/premium-student.jpg', category: 'Pro' },
  { id: 'premium_executive', name: 'Executive', description: 'Direction, leadership et vision', plans: ['pro'], color: 'bg-neutral-900', previewImage: '/template-previews/premium-executive.jpg', category: 'Pro' },
]

const baseRendererById: Record<BaseTemplateId, (props: CVTemplateProps) => ReactElement> = {
  classique: CVPreviewClassique,
  moderne: CVPreviewModerne,
  minimaliste: CVPreviewMinimaliste,
  creatif: CVPreviewCreatif,
  design: CVPreviewDesign,
  tech: CVPreviewTech,
  executif: CVPreviewExecutif,
  startup: CVPreviewStartup,
  luxe: CVPreviewLuxe,
  elite: CVPreviewElite,
  premium_finance: CVPreviewPremiumFinance,
  premium_tech: CVPreviewPremiumTech,
  premium_marketing: CVPreviewPremiumMarketing,
  premium_student: CVPreviewPremiumStudent,
  premium_executive: CVPreviewPremiumExecutive,
}

export function renderCvTemplate(templateId: string, props: CVTemplateProps) {
  const config = templateCatalog.find((item) => item.id === templateId) || templateCatalog[1]
  const BaseComponent = baseRendererById[config.id]
  return <BaseComponent data={props.data} showWatermark={props.showWatermark} />
}
