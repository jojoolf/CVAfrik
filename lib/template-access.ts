import { PLANS, type Plan } from '@/lib/types'

export interface TemplateConfig {
  id: string
  name: string
  description: string
  requiredPlan: Plan
  color: string
  accent: string
}

const PLAN_ORDER: Record<Plan, number> = {
  gratuit: 0,
  pro: 1,
  premium: 2,
}

export const TEMPLATE_CATALOG: TemplateConfig[] = [
  {
    id: 'classique',
    name: 'Classique',
    description: 'Un design intemporel et professionnel',
    requiredPlan: 'gratuit',
    color: 'bg-slate-800',
    accent: 'bg-slate-200',
  },
  {
    id: 'moderne',
    name: 'Moderne',
    description: 'Design contemporain avec touches de couleur',
    requiredPlan: 'gratuit',
    color: 'bg-primary',
    accent: 'bg-primary/20',
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste',
    description: 'L\'essentiel, rien de plus',
    requiredPlan: 'gratuit',
    color: 'bg-gray-700',
    accent: 'bg-gray-50',
  },
  {
    id: 'creatif',
    name: 'Creatif',
    description: 'Pour les profils artistiques et marketing',
    requiredPlan: 'pro',
    color: 'bg-rose-500',
    accent: 'bg-rose-100',
  },
  {
    id: 'executif',
    name: 'Executif',
    description: 'Sobre et elegant pour les cadres',
    requiredPlan: 'pro',
    color: 'bg-slate-700',
    accent: 'bg-slate-200',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Ideal pour les developpeurs et ingenieurs',
    requiredPlan: 'pro',
    color: 'bg-cyan-600',
    accent: 'bg-cyan-100',
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Premium avec photo et impact visuel',
    requiredPlan: 'pro',
    color: 'bg-[#0B1E36]',
    accent: 'bg-slate-200',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Chaleureux et creatif',
    requiredPlan: 'pro',
    color: 'bg-[#8B7355]',
    accent: 'bg-amber-100',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Dynamique et moderne',
    requiredPlan: 'premium',
    color: 'bg-orange-500',
    accent: 'bg-orange-100',
  },
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Raffinement et elegance',
    requiredPlan: 'premium',
    color: 'bg-amber-700',
    accent: 'bg-amber-50',
  },
]

export function getTemplateConfig(templateId: string) {
  return TEMPLATE_CATALOG.find((template) => template.id === templateId) ?? null
}

export function getPlanLabel(plan: Plan) {
  return PLANS.find((item) => item.id === plan)?.nom ?? plan
}

export function hasPlanAccess(currentPlan: Plan, requiredPlan: Plan) {
  return PLAN_ORDER[currentPlan] >= PLAN_ORDER[requiredPlan]
}

export function hasTemplateAccess(currentPlan: Plan, templateId: string) {
  const template = getTemplateConfig(templateId)

  if (!template) {
    return false
  }

  return hasPlanAccess(currentPlan, template.requiredPlan)
}

export function getFirstAvailableTemplate(plan: Plan) {
  return (
    TEMPLATE_CATALOG.find((template) => hasPlanAccess(plan, template.requiredPlan))?.id ??
    'classique'
  )
}

export function getTemplateUpgradeHref(templateId: string) {
  const template = getTemplateConfig(templateId)

  if (!template) {
    return '/tarifs'
  }

  return `/tarifs?locked=template&template=${encodeURIComponent(template.id)}&requiredPlan=${encodeURIComponent(template.requiredPlan)}`
}
