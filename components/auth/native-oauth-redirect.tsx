'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

const WEB_ORIGIN = 'https://cv-afrik.vercel.app'

export function NativeOAuthRedirect() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const listener = App.addListener('appUrlOpen', ({ url }) => {
      try {
        const link = new URL(url)
        if (link.protocol === 'cvafrik:' && link.hostname === 'auth' && link.pathname === '/callback') {
          window.location.assign(`${WEB_ORIGIN}/auth/callback${link.search}`)
        }
      } catch { /* Ignore unrelated deep links. */ }
    })
    return () => { void listener.then((handle) => handle.remove()) }
  }, [])
  return null
}

export function getOAuthRedirectUrl() {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform()
    ? 'cvafrik://auth/callback'
    : `${window.location.origin}/auth/callback`
}
