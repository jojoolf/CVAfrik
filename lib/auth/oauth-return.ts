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

/** Parse `document.cookie` or `Cookie` header for a single name (first match). */
export function readNamedCookie(cookieString: string, name: string): string | undefined {
  const parts = cookieString.split('; ')
  for (const part of parts) {
    if (!part || !part.startsWith(`${name}=`)) continue
    return part.slice(name.length + 1)
  }
  return undefined
}

export function readOAuthNextFromCookieString(cookieString: string): string {
  const raw = readNamedCookie(cookieString, OAUTH_RETURN_COOKIE)
  return safeInternalPath(decodeOAuthCookie(raw))
}
