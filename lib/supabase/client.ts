import { createBrowserClient } from '@supabase/ssr'
import { Capacitor } from '@capacitor/core'
import { getSupabaseAnonKey, getSupabaseApiUrl } from '@/lib/supabase/project-url'

export function createClient() {
  return createBrowserClient(getSupabaseApiUrl(), getSupabaseAnonKey(), {
    auth: {
      flowType: Capacitor.isNativePlatform() ? 'implicit' : 'pkce',
    },
  })
}
