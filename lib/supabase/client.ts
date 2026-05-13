import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseApiUrl } from '@/lib/supabase/project-url'

export function createClient() {
  return createBrowserClient(getSupabaseApiUrl(), getSupabaseAnonKey())
}
