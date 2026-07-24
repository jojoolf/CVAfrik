'use client'

import { Check, Crown, Zap, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const FEATURES_FREE = [
  '3 CV par mois',
  '3 lettres de motivation / mois',
  '3 templates basiques',
  'Export PDF (avec watermark)',
  'Accès aux offres de stages',
]

const FEATURES_PRO = [
  'CV & lettres illimités',
  '45+ templates premium',
  'Export PDF sans watermark',
  'Score ATS détaillé + conseils IA',
  'Simulateur entretien illimité',
  'Matching CV ↔ offre d\'emploi',
  'Lettres de motivation IA',
  'Traduction anglais/français',
]

interface PricingCardsProps {
  currentPlan: any
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 grid gap-8 md:grid-cols-2">
      {/* Plan Gratuit */}
      <div className="relative rounded-3xl p-8 bg-card border border-border/50 shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Starter</h3>
        <p className="mt-1 text-sm text-muted-foreground">Pour découvrir CVAfrik et créer ton premier CV.</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-foreground">0</span>
          <span className="text-sm text-muted-foreground">FCFA</span>
        </div>

        <Link
          href="/auth/inscription"
          className="mt-6 block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-all border border-border hover:bg-secondary"
        >
          Commencer gratuitement
        </Link>

        <ul className="mt-8 space-y-3">
          {FEATURES_FREE.map((f) => (
            <li key={f} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Plan Pro */}
      <div className="relative rounded-3xl p-8 bg-card border-2 border-primary/40 shadow-lg shadow-primary/5">
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          <Sparkles className="h-3 w-3" />
          Le plus populaire
        </div>

        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Career Pro</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Pour décrocher ton stage ou premier emploi rapidement.</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-lg text-muted-foreground line-through">4 300</span>
          <span className="text-5xl font-bold tracking-tight text-foreground">2 600</span>
          <span className="text-sm text-muted-foreground">FCFA / mois</span>
        </div>
        <p className="text-xs text-primary font-bold mt-1">-40% • Économise jusqu'à 49% sur les durées longues</p>

        <Link
          href="/paiement/abonnement"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-center text-sm font-bold transition-all hover:scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Zap className="h-4 w-4" />
          Choisir ma durée Pro
          <ChevronRight className="h-4 w-4" />
        </Link>

        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span>🔒 Paiement sécurisé PayTech</span>
          <span>⚡ Activation instantanée</span>
        </div>

        <ul className="mt-8 space-y-3">
          {FEATURES_PRO.map((f) => (
            <li key={f} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
