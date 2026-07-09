import { PLANS, type Plan } from '@/lib/types'

export function getEffectivePlan(planId: string | null | undefined, planExpiry: string | null | undefined): Plan {
  const today = new Date()
  const isStillActive = !planExpiry || Number.isNaN(Date.parse(planExpiry)) ? true : new Date(planExpiry) > today

  if (planId && isStillActive) {
    const activePlan = PLANS.find((plan) => plan.id === planId)
    if (activePlan) {
      return activePlan.id
    }
  }

  return 'gratuit'
}
