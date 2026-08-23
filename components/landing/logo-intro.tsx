'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const INTRO_KEY = 'cvafrik-logo-intro-seen-v1'
const INTRO_DURATION_MS = 5_600

export function LogoIntro() {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const closeIntro = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadySeen = window.sessionStorage.getItem(INTRO_KEY)

    if (prefersReducedMotion || alreadySeen) return

    window.sessionStorage.setItem(INTRO_KEY, 'true')
    setIsVisible(true)

    const timer = window.setTimeout(closeIntro, INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => closeIntro())
  }, [isVisible])

  if (!isVisible) return null

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Animation de lancement CVAfrik"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#090c12]"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/video/cvafrik-logo-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={closeIntro}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={closeIntro}
        className="absolute right-4 top-4 inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <X className="h-4 w-4" aria-hidden="true" /> Passer
      </button>
    </section>
  )
}
