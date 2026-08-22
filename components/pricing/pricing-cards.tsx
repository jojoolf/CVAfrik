'use client'

import { Check, Crown, Zap, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/use-translation'

interface PricingCardsProps {
  currentPlan: unknown
}

export function PricingCards({ currentPlan: _currentPlan }: PricingCardsProps) {
  const { t } = useTranslation()
  const freeFeatureList = [1, 2, 3, 4, 5].map((index) => t(`pricing.freeFeature${index}`))
  const proFeatureList = [1, 2, 3, 4, 5, 6, 7, 8].map((index) => t(`pricing.proFeature${index}`))

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
      <div className="relative rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Starter</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('pricing.starterDescription')}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-foreground">0</span>
          <span className="text-sm text-muted-foreground">FCFA</span>
        </div>

        <Link
          href="/auth/inscription"
          className="mt-6 block w-full rounded-full border border-border px-5 py-3 text-center text-sm font-semibold transition-all hover:bg-secondary"
        >
          {t('pricing.freeCta')}
        </Link>

        <ul className="mt-8 space-y-3">
          {freeFeatureList.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative rounded-3xl border-2 border-primary/40 bg-card p-8 shadow-lg shadow-primary/5">
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          <Sparkles className="h-3 w-3" />
          {t('pricing.popular')}
        </div>

        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Career Pro</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t('pricing.proDescription')}</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-lg text-muted-foreground line-through">4 300</span>
          <span className="text-5xl font-bold tracking-tight text-foreground">2 600</span>
          <span className="text-sm text-muted-foreground">{t('pricing.perMonth')}</span>
        </div>
        <p className="mt-1 text-xs font-bold text-primary">{t('pricing.discount')}</p>

        <Link
          href="/paiement/abonnement"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          <Zap className="h-4 w-4" />
          {t('pricing.proCta')}
          <ChevronRight className="h-4 w-4" />
        </Link>

        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span>🔒 {t('pricing.secured')}</span>
          <span>⚡ {t('pricing.instant')}</span>
        </div>

        <ul className="mt-8 space-y-3">
          {proFeatureList.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
