'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'

/** Active les ajustements réservés à l’APK et évite de montrer la landing page web à l’ouverture. */
export function NativeAppExperience() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    document.documentElement.classList.add('native-app')
    return () => document.documentElement.classList.remove('native-app')
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || pathname !== '/') return
    router.replace('/dashboard')
  }, [pathname, router])

  return null
}
