'use client'

<<<<<<< HEAD
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
=======
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-provider'
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218

export function CTASection() {
  const { t } = useLocale()

  const benefits = [
    t('cta.benefit1'),
    t('cta.benefit2'),
    t('cta.benefit3'),
    t('cta.benefit4'),
  ]

  return (
<<<<<<< HEAD
    <section className="relative py-32">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-gold p-12 text-center shadow-glow md:p-20"
        >
          <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_30%_30%,white,transparent_50%)]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />

          <h2 className="relative font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
            Ton avenir commence
            <br />
            par un CV qui claque.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base text-primary-foreground/80 md:text-lg">
            Rejoins 12 000+ talents africains qui décrochent leur job
            de rêve avec CVAfrik.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/auth/inscription"
              className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-base font-semibold text-foreground transition-transform hover:scale-105"
            >
              Créer mon CV maintenant
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#pricing"
              className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-7 py-3.5 text-base font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20"
            >
              Voir les tarifs
            </a>
          </div>
        </motion.div>
=======
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 md:p-16">
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              {t('cta.subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-primary-foreground"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {benefit}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg"
                asChild
              >
                <Link href="/auth/inscription">
                  {t('cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218
      </div>
    </section>
  )
}
