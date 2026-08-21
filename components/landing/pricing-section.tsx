'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, Crown, Zap, ChevronRight } from 'lucide-react'
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
  'Traduction anglais/français',
  'Lettres de motivation IA',
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            Tarifs
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Des tarifs <span className="text-gradient-gold">adaptés à l&apos;Afrique.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Commence gratuitement, passe Pro quand tu es prêt.
            Mobile Money accepté partout sur le continent.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Plan Gratuit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 glass"
          >
            <h3 className="font-display text-xl font-bold">Starter</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pour découvrir CVAfrik et créer ton premier CV.</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight">0</span>
              <span className="text-sm text-muted-foreground">FCFA</span>
            </div>

            <Link
              href="/auth/inscription"
              className="mt-6 block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] glass hover:bg-white/10"
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
          </motion.div>

          {/* Plan Pro — Card mise en avant */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl p-8 glass border-primary/40 shadow-glow ring-1 ring-primary/30"
          >
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Le plus populaire
            </div>

            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-display text-xl font-bold">Career Pro</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Pour décrocher ton stage ou premier emploi rapidement.</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-lg text-muted-foreground line-through">4 300</span>
              <span className="text-5xl font-bold tracking-tight">2 600</span>
              <span className="text-sm text-muted-foreground">FCFA / mois</span>
            </div>
            <p className="text-xs text-primary font-bold mt-1">-40% • Économise jusqu'à 49% sur les durées longues</p>

            <Link
              href="/paiement/abonnement"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-center text-sm font-bold transition-all hover:scale-[1.02] bg-gradient-gold text-primary-foreground shadow-glow"
            >
              <Zap className="h-4 w-4" />
              Voir les offres Pro
              <ChevronRight className="h-4 w-4" />
            </Link>

            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <span>🔒 Paiement sécurisé FedaPay</span>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
