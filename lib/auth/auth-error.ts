const CONFIG_HINT =
  'La configuration Supabase semble invalide. Verifie NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel, puis redeploie.'

export function getAuthErrorMessage(error: unknown): string {
  const rawMessage = error instanceof Error ? error.message : String(error ?? '')
  const message = rawMessage.trim()
  const normalized = message.toLowerCase()

  if (
    normalized.includes('next_public_supabase_url') ||
    normalized.includes('next_public_supabase_anon_key') ||
    normalized.includes('dns_probe_finished_nxdomain') ||
    normalized.includes('failed to fetch') ||
    normalized.includes('networkerror') ||
    normalized.includes('fetch failed')
  ) {
    return CONFIG_HINT
  }

  if (!message) {
    return 'Une erreur est survenue pendant la connexion.'
  }

  return message
}

