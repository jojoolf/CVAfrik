'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { m: 0, a: 0 },
    desc: 'Pour découvrir CVAfrik et créer ton premier CV.',
    features: [
      '3 CV par mois',
      '3 lettres de motivation / mois',
      '3 templates basiques',
      'Export PDF (avec watermark)',
      'Accès aux offres de stages',
    ],
    cta: 'Commencer gratuitement',
  },
  {
    id: 'pro',
    name: 'Career Pro',
    price: { m: 2600, a: 26000 },
    desc: 'Pour décrocher ton stage ou premier emploi rapidement.',
    features: [
      'CV & lettres illimités',
      '45+ templates premium',
      'Export PDF sans watermark',
      'Score ATS détaillé + conseils IA',
      'Simulateur entretien illimité',
      'Matching CV ↔ offre d\'emploi',
      'Traduction anglais/français',
    ],
    cta: 'Passer Pro',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { m: 6500, a: 65000 },
    desc: 'Pour les universités, écoles et coachs carrière.',
    features: [
      'Tout le plan Pro inclus',
      'Gestion multi-profils étudiants',
      'Dashboard de suivi',
      'Templates avec logo école',
      'Rapport mensuel des progrès',
      'Support prioritaire WhatsApp',
    ],
    cta: 'Contacter l\'équipe',
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

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

          <div className="mt-8 inline-flex items-center gap-3 rounded-full glass p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!annual ? 'bg-gradient-gold text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${annual ? 'bg-gradient-gold text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Annuel <span className="ml-1 text-xs opacity-80">-2 mois</span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                p.popular
                  ? 'glass border-primary/40 shadow-glow ring-1 ring-primary/30'
                  : 'glass'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Le plus populaire
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">
                  {(annual ? p.price.a : p.price.m).toLocaleString('fr-FR')}
                </span>
                <span className="text-sm text-muted-foreground">
                  FCFA{p.price.m > 0 && (annual ? ' / an' : ' / mois')}
                </span>
              </div>

              <a
                href={p.id === 'business' ? '/contact' : '/auth/inscription'}
                className={`mt-6 block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  p.popular
                    ? 'bg-gradient-gold text-primary-foreground shadow-glow'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {p.cta}
              </a>

              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
