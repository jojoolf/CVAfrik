import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { getSupabaseAnonKey, getSupabaseApiUrl } from '@/lib/supabase/project-url'

/** Client SSR/cookies utilisé par le site et pour persister la session dans la WebView. */
export function createClient() {
  return createBrowserClient(getSupabaseApiUrl(), getSupabaseAnonKey())
}

/**
 * Le client SSR force PKCE. Dans l’APK, Chrome et la WebView ne partagent pas
 * le vérificateur PKCE : l’OAuth natif utilise donc l’implicit flow, puis
 * NativeOAuthRedirect écrit la session reçue dans les cookies CVAfrik.
 */
export function createOAuthClient() {
  if (!Capacitor.isNativePlatform()) return createClient()

  return createSupabaseClient(getSupabaseApiUrl(), getSupabaseAnonKey(), {
    auth: {
      flowType: 'implicit',
      detectSessionInUrl: false,
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
