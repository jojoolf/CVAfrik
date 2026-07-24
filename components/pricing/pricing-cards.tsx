'use client'

import { PremiumPricingFlow } from './premium-pricing'
import type { Plan } from '@/lib/types'

interface PricingCardsProps {
  currentPlan: Plan | null
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  return <PremiumPricingFlow currentPlan={currentPlan} />
}
