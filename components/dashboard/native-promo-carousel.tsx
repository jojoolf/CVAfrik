'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { Capacitor } from '@capacitor/core'
import { ArrowRight } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

type PromoBanner = {
  id: string
  title: string
  body: string
  image_url: string
  action_label: string
  action_href: string
}

type CarouselApi = UseEmblaCarouselType[1]

const fallbackBanners: PromoBanner[] = [
  { id: 'opportunities', title: 'Opportunités à la une', body: 'Découvrez des emplois, stages et bourses adaptés à votre parcours.', image_url: '/banners/native-opportunities.png', action_label: 'Explorer les opportunités', action_href: '/opportunites' },
  { id: 'career-pro', title: 'Passez au niveau Pro', body: 'Créez sans limite, exportez en PDF et améliorez votre score ATS.', image_url: '/banners/native-career-pro.png', action_label: 'Découvrir Career Pro', action_href: '/paiement/abonnement' },
  { id: 'interview', title: 'Préparez votre entretien', body: 'Entraînez-vous avec le simulateur IA avant votre prochain rendez-vous.', image_url: '/banners/native-interview-ai.png', action_label: 'Commencer un entretien', action_href: '/dashboard/simulateur' },
]

export function NativePromoCarousel() {
  const [isNative, setIsNative] = useState(false)
  const [banners, setBanners] = useState<PromoBanner[]>(fallbackBanners)
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  useEffect(() => {
    if (!isNative) return
    let active = true
    void fetch('/api/promo-banners', { cache: 'no-store' })
      .then(async (response) => ({ response, data: await response.json() as { banners?: PromoBanner[] } }))
      .then(({ response, data }) => {
        if (active && response.ok && data.banners?.length) setBanners(data.banners)
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [isNative])

  useEffect(() => {
    if (!api) return
    const sync = () => setActiveIndex(api.selectedScrollSnap())
    sync()
    api.on('select', sync)
    api.on('reInit', sync)
    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
    }
  }, [api, banners.length])

  useEffect(() => {
    if (!api || banners.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => api.scrollNext(), 5500)
    return () => window.clearInterval(interval)
  }, [api, banners.length])

  if (!isNative) return null

  return (
    <section aria-label="À la une sur CVAfrik">
      <Carousel opts={{ align: 'start', loop: banners.length > 1 }} setApi={setApi} className="w-full">
        <CarouselContent className="-ml-0">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0">
              <Link href={banner.action_href} className="group block overflow-hidden rounded-3xl shadow-lg transition active:scale-[0.985]" aria-label={`${banner.title} : ${banner.action_label}`}>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <img src={banner.image_url} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-active:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/5" />
                  <div className="relative flex h-full max-w-[74%] flex-col justify-between p-4 text-white sm:p-5">
                    <div><p className="text-[9px] font-black uppercase tracking-[0.17em] text-white/75">À la une</p><h2 className="mt-1 text-lg font-black leading-tight tracking-tight sm:text-xl">{banner.title}</h2><p className="mt-1.5 text-[11px] leading-4 text-white/85 sm:text-xs sm:leading-5">{banner.body}</p></div>
                    <span className="inline-flex w-fit items-center rounded-xl bg-white px-3 py-2 text-[11px] font-black text-slate-950 shadow-sm">{banner.action_label}<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {banners.length > 1 && <div className="mt-2.5 flex justify-center gap-1.5" aria-label="Indicateur des promotions">{banners.map((banner, index) => <button key={banner.id} type="button" aria-label={`Voir la promotion ${index + 1}`} aria-current={activeIndex === index ? 'true' : undefined} onClick={() => api?.scrollTo(index)} className={cn('h-1.5 rounded-full transition-all', activeIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/35')} />)}</div>}
    </section>
  )
}
