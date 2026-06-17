import type { CSSProperties, ReactElement } from 'react'
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

export type TemplatePlan = 'gratuit' | 'pro' | 'premium'

interface CVTemplateProps {
  data: CVDonnees
  showWatermark?: boolean
}

type BaseTemplateId =
  | 'classique'
  | 'moderne'
  | 'creatif'
  | 'executif'
  | 'tech'
  | 'minimaliste'
  | 'startup'
  | 'luxe'
  | 'elite'
  | 'design'
  | 'premium_finance'
  | 'premium_tech'
  | 'premium_marketing'
  | 'premium_student'
  | 'premium_executive'

interface BaseTemplateDefinition {
  id: BaseTemplateId
  name: string
  description: string
  plans: TemplatePlan[]
  color: string
}

interface StylePresetDefinition {
  id: string
  name: string
  description: string
  color: string
  filter: string
  backgroundClassName: string
}

export interface TemplateCatalogItem {
  id: string
  name: string
  description: string
  plans: TemplatePlan[]
  color: string
  base: BaseTemplateId
  filter?: string
  backgroundClassName?: string
}

const BASE_TEMPLATE_DEFINITIONS: BaseTemplateDefinition[] = [
  { id: 'classique', name: 'Classique', description: 'Design intemporel', plans: ['gratuit', 'pro', 'premium'], color: 'bg-gray-800' },
  { id: 'moderne', name: 'Moderne', description: 'Design contemporain', plans: ['gratuit', 'pro', 'premium'], color: 'bg-blue-600' },
  { id: 'creatif', name: 'Creatif', description: 'Design original', plans: ['pro', 'premium'], color: 'bg-rose-500' },
  { id: 'executif', name: 'Executif', description: 'Design corporate', plans: ['pro', 'premium'], color: 'bg-slate-700' },
  { id: 'tech', name: 'Tech', description: 'Pour developpeurs', plans: ['pro', 'premium'], color: 'bg-cyan-600' },
  { id: 'minimaliste', name: 'Minimaliste', description: "L'essentiel", plans: ['gratuit', 'pro', 'premium'], color: 'bg-stone-500' },
  { id: 'startup', name: 'Startup', description: 'Energie business', plans: ['premium'], color: 'bg-orange-500' },
  { id: 'luxe', name: 'Luxe', description: 'Raffine et premium', plans: ['premium'], color: 'bg-amber-600' },
  { id: 'elite', name: 'Elite', description: 'Premium avec photo', plans: ['premium'], color: 'bg-[#0B1E36]' },
  { id: 'design', name: 'Design', description: 'Esthetique chaleureux', plans: ['pro', 'premium'], color: 'bg-[#8B7355]' },
  { id: 'premium_finance', name: 'Premium Finance', description: 'Cible banque & finance', plans: ['premium'], color: 'bg-[#1e3a8a]' },
  { id: 'premium_tech', name: 'Premium Tech', description: 'Cible developpeurs & IT', plans: ['premium'], color: 'bg-cyan-500' },
  { id: 'premium_marketing', name: 'Premium Marketing', description: 'Cible marketing & com', plans: ['premium'], color: 'bg-purple-600' },
  { id: 'premium_student', name: 'Premium Student', description: 'Cible etudiants & juniors', plans: ['premium'], color: 'bg-indigo-600' },
  { id: 'premium_executive', name: 'Premium Executive', description: 'Cible directeurs & cadres', plans: ['premium'], color: 'bg-[#111827]' },
]

const STYLE_PRESETS: StylePresetDefinition[] = [
  {
    id: 'marine',
    name: 'Marine',
    description: 'Bleu profond et professionnel',
    color: 'bg-blue-800',
    filter: 'hue-rotate(30deg) saturate(1.16) contrast(1.04)',
    backgroundClassName: 'bg-blue-50',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Ton chaud et memorisable',
    color: 'bg-orange-700',
    filter: 'hue-rotate(-18deg) saturate(1.22) brightness(1.01)',
    backgroundClassName: 'bg-orange-50',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Vert sobre et naturel',
    color: 'bg-emerald-700',
    filter: 'hue-rotate(85deg) saturate(1.12) contrast(1.03)',
    backgroundClassName: 'bg-emerald-50',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Contraste corporate discret',
    color: 'bg-slate-600',
    filter: 'saturate(0.82) contrast(1.08) brightness(0.99)',
    backgroundClassName: 'bg-slate-100',
  },
  {
    id: 'royal',
    name: 'Royal',
    description: 'Elegance executive',
    color: 'bg-indigo-700',
    filter: 'hue-rotate(52deg) saturate(1.12) contrast(1.05)',
    backgroundClassName: 'bg-indigo-50',
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    description: 'Premium raffine',
    color: 'bg-rose-800',
    filter: 'hue-rotate(-42deg) saturate(1.22) contrast(1.05)',
    backgroundClassName: 'bg-rose-50',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Tech moderne contraste',
    color: 'bg-teal-600',
    filter: 'hue-rotate(118deg) saturate(1.3) contrast(1.05)',
    backgroundClassName: 'bg-teal-50',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Impact visuel commercial',
    color: 'bg-amber-500',
    filter: 'hue-rotate(-30deg) saturate(1.28) brightness(1.04)',
    backgroundClassName: 'bg-amber-50',
  },
  {
    id: 'noir-or',
    name: 'Noir Or',
    description: 'Contraste premium fort',
    color: 'bg-neutral-900',
    filter: 'contrast(1.15) saturate(0.95) brightness(0.93)',
    backgroundClassName: 'bg-stone-100',
  },
]

const PRO_PRESET_COUNT = 4

const baseCatalog: TemplateCatalogItem[] = BASE_TEMPLATE_DEFINITIONS.map((base) => ({
  id: base.id,
  name: base.name,
  description: base.description,
  plans: base.plans,
  color: base.color,
  base: base.id,
}))

const variantCatalog: TemplateCatalogItem[] = BASE_TEMPLATE_DEFINITIONS.flatMap((base) =>
  STYLE_PRESETS.map((preset, index) => ({
    id: `${base.id}-${preset.id}`,
    name: `${base.name} ${preset.name}`,
    description: preset.description,
    plans: index < PRO_PRESET_COUNT ? ['pro', 'premium'] : ['premium'],
    color: preset.color,
    base: base.id,
    filter: preset.filter,
    backgroundClassName: preset.backgroundClassName,
  })),
)

export const templateCatalog: TemplateCatalogItem[] = [...baseCatalog, ...variantCatalog]

const templateMap = new Map(templateCatalog.map((item) => [item.id, item]))

const baseRendererById: Record<BaseTemplateId, (props: CVTemplateProps) => ReactElement> = {
  classique: CVPreviewClassique,
  moderne: CVPreviewModerne,
  creatif: CVPreviewCreatif,
  executif: CVPreviewExecutif,
  tech: CVPreviewTech,
  minimaliste: CVPreviewMinimaliste,
  startup: CVPreviewStartup,
  luxe: CVPreviewLuxe,
  elite: CVPreviewElite,
  design: CVPreviewDesign,
  premium_finance: CVPreviewPremiumFinance,
  premium_tech: CVPreviewPremiumTech,
  premium_marketing: CVPreviewPremiumMarketing,
  premium_student: CVPreviewPremiumStudent,
  premium_executive: CVPreviewPremiumExecutive,
}

function renderFromConfig(config: TemplateCatalogItem, props: CVTemplateProps) {
  const BaseComponent = baseRendererById[config.base]
  const wrapperClass = config.backgroundClassName || 'bg-white'
  const style: CSSProperties | undefined = config.filter ? { filter: config.filter } : undefined

  if (!config.filter) {
    return <BaseComponent data={props.data} showWatermark={props.showWatermark} />
  }

  return (
    <div className={wrapperClass}>
      <div style={style}>
        <BaseComponent data={props.data} showWatermark={props.showWatermark} />
      </div>
    </div>
  )
}

export function renderCvTemplate(templateId: string, props: CVTemplateProps) {
  const config = templateMap.get(templateId) || templateMap.get('moderne')
  if (!config) {
    return <CVPreviewModerne data={props.data} showWatermark={props.showWatermark} />
  }

  return renderFromConfig(config, props)
}
