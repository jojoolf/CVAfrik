'use client'

import { motion } from 'framer-motion'
import { Download, FileText, Globe, Shield, Smartphone, Sparkles, Target, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/use-translation'

export function FeaturesSection() {
  const { t } = useTranslation()
  const features = [
    { icon: FileText, title: t('features.item1Title'), desc: t('features.item1Desc') },
    { icon: Sparkles, title: t('features.item2Title'), desc: t('features.item2Desc') },
    { icon: Download, title: t('features.item3Title'), desc: t('features.item3Desc') },
    { icon: Smartphone, title: t('features.item4Title'), desc: t('features.item4Desc') },
    { icon: Globe, title: t('features.item5Title'), desc: t('features.item5Desc') },
    { icon: Shield, title: t('features.item6Title'), desc: t('features.item6Desc') },
    { icon: Zap, title: t('features.item7Title'), desc: t('features.item7Desc') },
    { icon: Target, title: t('features.item8Title'), desc: t('features.item8Desc') },
  ]

  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">{t('features.label')}</div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t('features.title')}<br /><span className="text-gradient-gold">{t('features.accent')}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{t('features.subtitle')}</p>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group glass relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/30">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-glow"><feature.icon className="h-5 w-5" /></div>
                <h3 className="font-display text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
