'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { AfricaGlobe } from './africa-globe'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-bold text-gradient-gold md:text-3xl">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero noise pt-28">
      <div className="absolute inset-0 opacity-90">
        <AfricaGlobe />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.13_0.015_60)_75%)]" />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center px-4 pb-20 text-center">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            Le CV builder pensé pour l&apos;Afrique
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          Ton CV qui ouvre{' '}
          <span className="text-gradient-gold">les portes</span>
          <br />
          du continent.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
        >
          Crée un CV professionnel optimisé ATS en moins de 10 minutes.
          Templates pensés pour le marché africain, paiement Mobile Money,
          coaching IA inclus.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="/auth/inscription"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Créer mon CV gratuit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#templates"
            className="glass rounded-full px-7 py-3.5 text-base font-medium transition-colors hover:bg-white/10"
          >
            Voir les templates
          </a>
        </motion.div>

        <motion.ul
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {[
            'Sans carte bancaire',
            'Compatible ATS',
            'Mobile Money accepté',
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {f}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 flex items-center gap-8"
        >
          <Stat value="50+" label="CV créés" />
          <div className="h-8 w-px bg-border" />
          <Stat value="4" label="Pays couverts" />
          <div className="h-8 w-px bg-border" />
          <Stat value="Nouveau" label="Note moyenne" />
        </motion.div>
      </div>
    </section>
  )
}
