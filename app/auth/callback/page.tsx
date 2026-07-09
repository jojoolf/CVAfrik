'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { readOAuthNextFromCookieString, safeInternalPath } from '@/lib/auth/oauth-return'
import { clearOAuthReturnCookieClient } from '@/lib/auth/set-oauth-return-cookie'

function buildErrorPath(reason: string, detail?: string) {
  const url = new URL('/auth/erreur', window.location.origin)
  url.searchParams.set('reason', reason)
  if (detail) {
    url.searchParams.set('detail', detail.slice(0, 240))
  }
  return url.pathname + url.search
}

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const oauthError = params.get('error')
      const oauthDesc = params.get('error_description')

      if (oauthError) {
        router.replace(buildErrorPath(oauthError, oauthDesc ?? undefined))
        return
      }

      const nextFromQuery = params.get('next')
      const nextFromCookie = readOAuthNextFromCookieString(document.cookie)
      const nextPath = safeInternalPath(nextFromQuery ?? nextFromCookie ?? '/dashboard')

      const token_hash = params.get('token_hash')
      const type = params.get('type')

      const supabase = createClient()

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as EmailOtpType,
          token_hash,
        })
        clearOAuthReturnCookieClient()
        if (error) {
          console.error('[auth/callback] verifyOtp', error.message)
          router.replace(buildErrorPath('verify_otp_failed', error.message))
          return
        }
        router.replace(nextPath)
        router.refresh()
        return
      }

      const code = params.get('code')
      if (!code) {
        clearOAuthReturnCookieClient()
        router.replace(buildErrorPath('missing_code'))
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      clearOAuthReturnCookieClient()

      if (error) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.replace(nextPath)
          router.refresh()
          return
        }
        console.error('[auth/callback] exchangeCodeForSession', error.message)
        router.replace(buildErrorPath('exchange_code_failed', error.message))
        return
      }

      router.replace(nextPath)
      router.refresh()
    }

    void run()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-4">
      <p className="text-sm font-medium text-foreground">Connexion en cours…</p>
      <p className="text-center text-xs text-muted-foreground">
        Redirection automatique vers votre espace.
      </p>
    </div>
  )
}
