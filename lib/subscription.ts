import { PLANS, type Plan } from '@/lib/types'

export function getSubscriptionDurationMonths(planId: Plan, amountFcfa: number): number {
  const plan = PLANS.find((item) => item.id === planId)

  if (!plan) {
    return 1
  }

  const annualPrice = plan.prix_annuel_fcfa

  if (typeof annualPrice === 'number' && annualPrice > 0 && amountFcfa >= annualPrice) {
    return 12
  }

  return 1
}

export function getSubscriptionExpiryDate(
  planId: Plan,
  amountFcfa: number,
  baseDate = new Date(),
) {
  const months = getSubscriptionDurationMonths(planId, amountFcfa)
  const expiryDate = new Date(baseDate)
  expiryDate.setMonth(expiryDate.getMonth() + months)
  return expiryDate
}
