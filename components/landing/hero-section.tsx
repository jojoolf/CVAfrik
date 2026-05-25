'use client'

<<<<<<< HEAD
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
=======
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Sparkles, FileText } from 'lucide-react'
import { LiveCounter } from './live-counter'
import { useLocale } from '@/lib/i18n/locale-provider'
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218

export function HeroSection() {
  const { t } = useLocale()

  const features = [
    t('hero.feature1'),
    t('hero.feature2'),
    t('hero.feature3'),
  ]

  return (
<<<<<<< HEAD
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
          <Stat value="12 000+" label="CV créés" />
          <div className="h-8 w-px bg-border" />
          <Stat value="54" label="Pays couverts" />
          <div className="h-8 w-px bg-border" />
          <Stat value="4.9★" label="Note moyenne" />
        </motion.div>
=======
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-28">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              {t('hero.badge')}
            </Badge>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t('hero.title')}
              <span className="text-primary"> {t('hero.titleAccent')}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground lg:mx-0">
              {t('hero.subtitle')}
            </p>

            <ul className="mx-auto mt-8 flex flex-col gap-3 lg:mx-0">
              {features.map((feature) => (
                <li key={feature} className="flex items-center justify-center gap-2 lg:justify-start">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/auth/inscription">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/#templates">
                  {t('hero.ctaTemplates')}
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start">
              <LiveCounter />
            </div>
          </div>

          <div className="relative mx-auto max-w-lg lg:mx-0">
            <div className="relative rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-border">
              <div className="aspect-[8.5/11] overflow-hidden rounded-lg bg-white p-6 shadow-inner">
                <div className="flex items-start gap-4 border-b border-gray-200 pb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-gray-800" />
                    <div className="mt-2 h-3 w-24 rounded bg-primary" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-2 w-20 rounded bg-gray-300" />
                      <div className="h-2 w-16 rounded bg-gray-300" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="h-3 w-20 rounded bg-primary/60" />
                    <div className="mt-2 space-y-1">
                      <div className="h-2 w-full rounded bg-gray-200" />
                      <div className="h-2 w-5/6 rounded bg-gray-200" />
                      <div className="h-2 w-4/6 rounded bg-gray-200" />
                    </div>
                  </div>

                  <div>
                    <div className="h-3 w-24 rounded bg-primary/60" />
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="h-2 w-full rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="h-2 w-5/6 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="h-3 w-20 rounded bg-primary/60" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-5 w-16 rounded-full bg-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -top-4 rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Score CV</p>
                    <p className="text-lg font-bold text-green-600">92%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Template</p>
                    <p className="text-sm font-semibold text-primary">Moderne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218
      </div>
    </section>
  )
}
