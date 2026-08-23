'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { createClient } from '@/lib/supabase/client'
import { clearOAuthReturnCookieClient } from '@/lib/auth/set-oauth-return-cookie'

const WEB_ORIGIN = 'https://cv-afrik.vercel.app'

function errorUrl(reason: string, detail?: string) {
  const url = new URL('/auth/erreur', WEB_ORIGIN)
  url.searchParams.set('reason', reason)
  if (detail) url.searchParams.set('detail', detail.slice(0, 240))
  return url.toString()
}

export function NativeOAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let handledUrl = ''
    const handleUrl = async (url?: string) => {
      if (!url || url === handledUrl) return

      try {
        const link = new URL(url)
        if (link.protocol !== 'cvafrik:' || link.hostname !== 'auth' || link.pathname !== '/callback') return
        handledUrl = url

        const query = link.searchParams
        const hash = new URLSearchParams(link.hash.startsWith('#') ? link.hash.slice(1) : link.hash)
        const providerError = query.get('error') ?? hash.get('error')
        if (providerError) {
          window.location.assign(errorUrl(providerError, query.get('error_description') ?? hash.get('error_description') ?? undefined))
          return
        }

        const accessToken = hash.get('access_token') ?? query.get('access_token')
        const refreshToken = hash.get('refresh_token') ?? query.get('refresh_token')
        if (accessToken && refreshToken) {
          const { error } = await createClient().auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          clearOAuthReturnCookieClient()
          if (error) {
            window.location.assign(errorUrl('native_session_failed', error.message))
            return
          }
          router.replace('/dashboard')
          router.refresh()
          return
        }

        // Compatibilité avec un ancien retour PKCE : le callback web conserve l’échange de code.
        window.location.assign(`${WEB_ORIGIN}/auth/callback${link.search}${link.hash}`)
      } catch {
        window.location.assign(errorUrl('invalid_native_callback'))
      }
    }

    const listener = App.addListener('appUrlOpen', ({ url }) => { void handleUrl(url) })
    void App.getLaunchUrl().then((result) => { void handleUrl(result?.url) })
    return () => { void listener.then((handle) => handle.remove()) }
  }, [router])

  return null
}

export function getOAuthRedirectUrl() {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform()
    ? 'cvafrik://auth/callback'
    : `${window.location.origin}/auth/callback`
}
