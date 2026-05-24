'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-provider'

export function CTASection() {
  const { t } = useLocale()

  const benefits = [
    t('cta.benefit1'),
    t('cta.benefit2'),
    t('cta.benefit3'),
    t('cta.benefit4'),
  ]

  return (
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
      </div>
    </section>
  )
}
