'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Crown, ChevronRight, Smartphone, CreditCard, ShieldCheck, Tag, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const DURATIONS = [
  {
    id: '15j',
    label: 'Pro 15 Jours',
    badge: null,
    discount: -20,
    priceTotal: 2000,
    pricePerMonth: 4000,
  },
  {
    id: '1m',
    label: 'Pro 1 Mois',
    badge: 'POPULAIRE',
    discount: -40,
    priceTotal: 2600,
    pricePerMonth: 2600,
  },
  {
    id: '3m',
    label: 'Pro 3 Mois',
    badge: null,
    discount: -33,
    priceTotal: 6500,
    pricePerMonth: 2167,
  },
  {
    id: '6m',
    label: 'Pro 6 Mois',
    badge: null,
    discount: -49,
    priceTotal: 11000,
    pricePerMonth: 1833,
  },
]

const FEATURES = [
  'CV illimités sans watermark',
  '45+ templates premium',
  'Export PDF haute qualité',
  'Score ATS + conseils IA',
  'Simulateur entretien illimité',
  "Matching CV ↔ offre d'emploi",
  'Lettres de motivation IA',
  'Toutes les offres de stages',
]

const PAYMENT_METHODS = [
  {
    id: 'fedapay_mobile',
    label: 'Mobile Money (FedaPay)',
    icon: Smartphone,
    badges: [
      { name: 'Orange', color: 'bg-orange-500 text-white' },
      { name: 'Wave', color: 'bg-sky-500 text-white' },
      { name: 'Free', color: 'bg-red-600 text-white' },
      { name: 'MTN', color: 'bg-yellow-400 text-black' },
      { name: 'Moov', color: 'bg-blue-600 text-white' },
    ],
  },
  {
    id: 'fedapay_card',
    label: 'Carte Bancaire (FedaPay)',
    icon: CreditCard,
    badges: [
      { name: 'Visa', color: 'bg-blue-700 text-white' },
      { name: 'Mastercard', color: 'bg-red-600 text-white' },
    ],
  },
]

export function PremiumPricingFlow({ currentPlan }: { currentPlan?: string | null }) {
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1])
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0])
  const [promoCode, setPromoCode] = useState('')
  const [showPromo, setShowPromo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/fedapay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedDuration.priceTotal,
          planId: 'pro',
          durationId: selectedDuration.id,
          durationLabel: selectedDuration.label,
          billing: selectedDuration.id === '15j' || selectedDuration.id === '1m' ? 'monthly' : 'annual',
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        toast.info('Veuillez vous connecter pour proceder au paiement.')
        window.location.href = '/auth/connexion?redirect=/paiement/abonnement'
        return
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Impossible d'initialiser le paiement FedaPay.")
      }

      toast.success('Redirection vers FedaPay...')
      window.location.href = data.url
    } catch (err: any) {
      console.error('FedaPay subscription error:', err)
      toast.error(err.message || "Erreur lors de l'initialisation du paiement.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Crown className="h-3.5 w-3.5" />
            CVAfrik Pro
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Choisis ta durée</h1>
          <p className="text-slate-400 text-sm">Plus c'est long, plus tu économises</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-5 mb-4 space-y-3">
          {DURATIONS.map((dur) => {
            const isSelected = selectedDuration.id === dur.id
            return (
              <button
                key={dur.id}
                onClick={() => setSelectedDuration(dur)}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                    : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected ? 'border-primary bg-primary' : 'border-slate-600',
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('font-bold text-sm', isSelected ? 'text-white' : 'text-slate-200')}>
                        {dur.label}
                      </span>
                      {dur.badge && (
                        <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                          {dur.badge}
                        </span>
                      )}
                      <span className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                        isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-400',
                      )}>
                        {dur.discount}%
                      </span>
                    </div>
                    <p className={cn('text-xs mt-0.5', isSelected ? 'text-primary/70' : 'text-slate-500')}>
                      {dur.pricePerMonth.toLocaleString()} FCFA/mois
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-slate-500 line-through text-xs">
                    {Math.round(dur.priceTotal * 1.6).toLocaleString()} FCFA
                  </p>
                  <p className={cn('text-lg font-black', isSelected ? 'text-primary' : 'text-slate-200')}>
                    {dur.priceTotal.toLocaleString()} <span className="text-sm font-bold">FCFA</span>
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Inclus dans ton abonnement</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-tight">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-5 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Comment veux-tu payer ? (FedaPay)</p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPayment.id === method.id
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method)}
                  className={cn(
                    'p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600',
                  )}
                >
                  <Icon className={cn('h-6 w-6 mb-2', isSelected ? 'text-primary' : 'text-slate-400')} />
                  <p className={cn('text-xs font-bold mb-2', isSelected ? 'text-white' : 'text-slate-300')}>
                    {method.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {method.badges.map((b) => (
                      <span key={b.name} className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-md', b.color)}>
                        {b.name}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          {showPromo ? (
            <div className="flex gap-2 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3">
              <Tag className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Entrer le code promo"
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button onClick={() => { setShowPromo(false); setPromoCode('') }}>
                <X className="h-4 w-4 text-slate-500 hover:text-slate-300" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPromo(true)}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-sm py-2 transition-colors"
            >
              <Tag className="h-3.5 w-3.5" />
              J'ai un code promo
            </button>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Total à payer</span>
            <span className="text-2xl font-black text-white">
              {selectedDuration.priceTotal.toLocaleString()}{' '}
              <span className="text-base font-bold text-primary">FCFA</span>
            </span>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 disabled:opacity-50 text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all duration-200 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Redirection vers FedaPay...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Payer avec FedaPay - {selectedDuration.priceTotal.toLocaleString()} FCFA
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-5 pt-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <Zap className="h-3 w-3 text-emerald-400" />
              Activation instantanee
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              FedaPay certifie & securise
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/tarifs" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            ← Voir tous les plans
          </Link>
        </div>
      </div>
    </div>
  )
}
