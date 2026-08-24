'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { ArrowRight, BriefcaseBusiness, Crown, MessageSquareCode } from 'lucide-react'
import { cn } from '@/lib/utils'

const promotions = [
  {
    title: 'Opportunités à la une',
    description: 'Découvrez des emplois, stages et bourses adaptés à votre parcours.',
    action: 'Explorer les opportunités',
    href: '/opportunites',
    icon: BriefcaseBusiness,
    className: 'from-emerald-600 via-teal-600 to-cyan-600',
    accentClassName: 'bg-white/15',
  },
  {
    title: 'Passez au niveau Pro',
    description: 'Créez sans limite, exportez en PDF et améliorez votre score ATS.',
    action: 'Découvrir Career Pro',
    href: '/paiement/abonnement',
    icon: Crown,
    className: 'from-primary via-orange-500 to-amber-500',
    accentClassName: 'bg-white/15',
  },
  {
    title: 'Préparez votre entretien',
    description: 'Entraînez-vous avec le simulateur IA avant votre prochain rendez-vous.',
    action: 'Commencer un entretien',
    href: '/dashboard/simulateur',
    icon: MessageSquareCode,
    className: 'from-violet-700 via-violet-600 to-fuchsia-600',
    accentClassName: 'bg-white/15',
  },
] as const

export function NativePromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  useEffect(() => {
    if (!isNative || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % promotions.length)
    }, 5500)
    return () => window.clearInterval(interval)
  }, [isNative])

  if (!isNative) return null

  return (
    <section aria-label="À la une sur CVAfrik">
      <div className="overflow-hidden rounded-3xl">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {promotions.map((promotion) => {
            const Icon = promotion.icon
            return (
              <Link key={promotion.title} href={promotion.href} className={cn('relative min-w-full overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg transition active:scale-[0.98]', promotion.className)}>
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-black/10 blur-xl" aria-hidden="true" />
                <div className="relative flex min-h-36 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/75">À la une</p><h2 className="mt-1 text-xl font-black tracking-tight">{promotion.title}</h2><p className="mt-2 max-w-[16rem] text-xs leading-5 text-white/85">{promotion.description}</p></div>
                    <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', promotion.accentClassName)}><Icon className="h-5 w-5" /></span>
                  </div>
                  <span className="mt-4 inline-flex items-center text-xs font-black">{promotion.action}<ArrowRight className="ml-1.5 h-4 w-4" /></span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5" aria-label="Indicateur des promotions">
        {promotions.map((promotion, index) => <button key={promotion.title} type="button" aria-label={`Voir la promotion ${index + 1}`} aria-current={activeIndex === index ? 'true' : undefined} onClick={() => setActiveIndex(index)} className={cn('h-1.5 rounded-full transition-all', activeIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/35')} />)}
      </div>
    </section>
  )
}
