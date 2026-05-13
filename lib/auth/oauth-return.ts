/** Cookie set before OAuth redirect so callback URL stays a single allowlisted path (no ?next=). */
export const OAUTH_RETURN_COOKIE = 'cvafrik_oauth_next'

export function safeInternalPath(path: string | undefined | null): string {
  if (!path || typeof path !== 'string') return '/dashboard'
  const t = path.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return '/dashboard'
  return t
}

export function decodeOAuthCookie(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return null
  }
}
