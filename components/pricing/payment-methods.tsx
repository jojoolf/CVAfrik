'use client'

import { CreditCard, Lock, Shield } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/use-translation'

const mobileMoneyOperators = [
  { name: 'Celltiis Cash', color: 'bg-emerald-600', countries: 'BJ' },
  { name: 'Coris Money', color: 'bg-red-700', countries: 'BF, CI, TG' },
  { name: 'Moov Money', color: 'bg-blue-600', countries: 'CI, BJ, TG, NE, BF' },
  { name: 'TMoney', color: 'bg-amber-400', countries: 'TG' },
  { name: 'Mixx by Yas', color: 'bg-sky-700', countries: 'TG' },
  { name: 'Wave', color: 'bg-sky-400', countries: 'CI, SN' },
]

export function PaymentMethods() {
  const { t } = useTranslation()
  const securityFeatures = [
    { icon: Shield, title: t('payment.secure'), description: t('payment.secureDescription') },
    { icon: Lock, title: t('payment.encrypted'), description: t('payment.encryptedDescription') },
    { icon: CreditCard, title: t('payment.cards'), description: t('payment.cardsDescription') },
  ]

  return (
    <section className="bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-foreground">{t('payment.title')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">{t('payment.subtitle')}</p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mobileMoneyOperators.map((operator) => (
            <div key={operator.name} className="flex flex-col items-center rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className={`h-12 w-12 rounded-full ${operator.color}`} />
              <p className="mt-3 text-center font-medium text-foreground">{operator.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{operator.countries}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><feature.icon className="h-5 w-5 text-primary" /></div>
              <div><h3 className="font-semibold text-foreground">{feature.title}</h3><p className="mt-1 text-sm text-muted-foreground">{feature.description}</p></div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center"><p className="text-sm italic text-muted-foreground">{t('payment.partner')}</p></div>
      </div>
    </section>
  )
}
