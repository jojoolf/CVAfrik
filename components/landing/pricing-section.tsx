'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Crown, Sparkles, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/use-translation'

export function PricingSection() {
  const { t } = useTranslation()
  const freeFeatures = [1, 2, 3, 4, 5].map((index) => t(`pricing.freeFeature${index}`))
  const proFeatures = [1, 2, 3, 4, 5, 6, 7, 8].map((index) => t(`pricing.proFeature${index}`))

  return (
    <section id="pricing" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">{t('pricing.landingLabel')}</div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t('pricing.landingTitle')} <span className="text-gradient-gold">{t('pricing.landingAccent')}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('pricing.landingSubtitle')}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-3xl p-8 glass">
            <h3 className="font-display text-xl font-bold">Starter</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('pricing.starterDescription')}</p>
            <div className="mt-6 flex items-baseline gap-1"><span className="text-5xl font-bold tracking-tight">0</span><span className="text-sm text-muted-foreground">FCFA</span></div>
            <Link href="/auth/inscription" className="mt-6 block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] glass hover:bg-white/10">{t('pricing.freeCta')}</Link>
            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature) => <li key={feature} className="flex gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{feature}</span></li>)}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative rounded-3xl border-primary/40 p-8 glass shadow-glow ring-1 ring-primary/30">
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-primary-foreground"><Sparkles className="h-3 w-3" />{t('pricing.popular')}</div>
            <div className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /><h3 className="font-display text-xl font-bold">Career Pro</h3></div>
            <p className="mt-1 text-sm text-muted-foreground">{t('pricing.proDescription')}</p>
            <div className="mt-6 flex items-baseline gap-2"><span className="text-lg text-muted-foreground line-through">4 300</span><span className="text-5xl font-bold tracking-tight">2 600</span><span className="text-sm text-muted-foreground">{t('pricing.perMonth')}</span></div>
            <p className="mt-1 text-xs font-bold text-primary">{t('pricing.discount')}</p>
            <Link href="/paiement/abonnement" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3.5 text-center text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]"><Zap className="h-4 w-4" />{t('pricing.landingProCta')}<ChevronRight className="h-4 w-4" /></Link>
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground"><span>🔒 {t('pricing.secured')}</span><span>⚡ {t('pricing.instant')}</span></div>
            <ul className="mt-8 space-y-3">
              {proFeatures.map((feature) => <li key={feature} className="flex gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{feature}</span></li>)}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
