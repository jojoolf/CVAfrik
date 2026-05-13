import { OAUTH_RETURN_COOKIE, safeInternalPath } from '@/lib/auth/oauth-return'

/** Call from the browser before signInWithOAuth so redirectTo can stay `/auth/callback` only. */
export function setOAuthReturnCookieClient(path: string | undefined) {
  if (typeof window === 'undefined') return
  const safe = safeInternalPath(path)
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${OAUTH_RETURN_COOKIE}=${encodeURIComponent(safe)}; Path=/; Max-Age=600; SameSite=Lax${secure}`
}

export function clearOAuthReturnCookieClient() {
  if (typeof window === 'undefined') return
  document.cookie = `${OAUTH_RETURN_COOKIE}=; Path=/; Max-Age=0`
}
