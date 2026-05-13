/**
 * Supabase Auth / PostgREST URL. Must be the Project URL from the API settings,
 * never the dashboard URL (a common copy-paste mistake that causes 404 + "Failed to fetch").
 */
export function getSupabaseApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!raw) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL est manquant. Ajoutez-le dans Vercel : Settings → Environment Variables.',
    )
  }
  if (/supabase\.com\/dashboard/i.test(raw)) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL pointe vers le tableau de bord (erreur courante). Dans Supabase : Project Settings → API → copiez "Project URL" au format https://xxxx.supabase.co — pas l’URL du navigateur sur supabase.com/dashboard.',
    )
  }
  return raw.replace(/\/+$/, '')
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY est manquant. Copiez la clé "anon public" depuis Supabase → Project Settings → API.',
    )
  }
  return key
}
