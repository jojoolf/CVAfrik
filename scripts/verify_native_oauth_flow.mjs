import { createClient } from '@supabase/supabase-js'

const client = createClient('https://example.supabase.co', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.test', {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: false,
    autoRefreshToken: false,
    persistSession: false,
  },
})

const { data, error } = await client.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'cvafrik://auth/callback',
    skipBrowserRedirect: true,
  },
})

if (error || !data.url) throw error ?? new Error('URL OAuth absente')
const url = new URL(data.url)
const hasPkce = url.searchParams.has('code_challenge') || url.searchParams.get('flow_type') === 'pkce'
console.log(JSON.stringify({
  flowType: url.searchParams.get('flow_type'),
  hasCodeChallenge: url.searchParams.has('code_challenge'),
  redirectTo: url.searchParams.get('redirect_to'),
  passes: !hasPkce && url.searchParams.get('redirect_to') === 'cvafrik://auth/callback',
}, null, 2))
if (hasPkce || url.searchParams.get('redirect_to') !== 'cvafrik://auth/callback') process.exit(1)
