import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import {
  OAUTH_RETURN_COOKIE,
  decodeOAuthCookie,
  safeInternalPath,
} from '@/lib/auth/oauth-return'

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const origin = url.origin
  const code = url.searchParams.get('code')
  const oauthError = url.searchParams.get('error')
  const oauthDesc = url.searchParams.get('error_description')

  if (oauthError) {
    const errUrl = new URL('/auth/erreur', origin)
    errUrl.searchParams.set('reason', oauthError)
    if (oauthDesc) errUrl.searchParams.set('detail', oauthDesc.slice(0, 200))
    return NextResponse.redirect(errUrl)
  }

  const nextFromQuery = url.searchParams.get('next')
  const nextFromCookie = decodeOAuthCookie(request.cookies.get(OAUTH_RETURN_COOKIE)?.value)
  const nextPath = safeInternalPath(nextFromQuery ?? nextFromCookie ?? '/dashboard')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/erreur', origin))
  }

  let response = NextResponse.redirect(new URL(nextPath, origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.redirect(new URL(nextPath, origin))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback] exchangeCodeForSession', error.message)
    return NextResponse.redirect(new URL('/auth/erreur', origin))
  }

  response.cookies.set(OAUTH_RETURN_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}
