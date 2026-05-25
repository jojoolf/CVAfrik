'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Sparkles,
  Download,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Target,
} from 'lucide-react'

const features = [
  { icon: FileText, title: 'Templates professionnels', desc: '100+ designs modernes adaptés au marché africain.' },
  { icon: Sparkles, title: 'Conseils IA personnalisés', desc: 'Notre IA analyse ton CV et maximise son impact.' },
  { icon: Download, title: 'Export PDF haute qualité', desc: 'Télécharge un PDF prêt pour les recruteurs.' },
  { icon: Smartphone, title: 'Paiement Mobile Money', desc: 'Orange Money, MTN, Moov, Wave — sans carte.' },
  { icon: Globe, title: 'Pensé pour l\'Afrique', desc: 'Contenus adaptés aux réalités du marché local.' },
  { icon: Shield, title: 'Données sécurisées', desc: 'Tes informations restent privées et chiffrées.' },
  { icon: Zap, title: 'Création éclair', desc: 'Un CV pro en moins de 10 minutes, vraiment.' },
  { icon: Target, title: 'Adaptation aux offres', desc: 'Optimise ton CV pour chaque offre d\'emploi.' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            Fonctionnalités
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Tout ce qu&apos;il te faut pour
            <br />
            <span className="text-gradient-gold">décrocher l&apos;emploi.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Des outils premium pensés pour la nouvelle génération de talents africains.
          </p>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
