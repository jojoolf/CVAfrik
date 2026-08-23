import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function resolvePlatform(value: unknown) {
  return value === 'android' || value === 'ios' ? value : 'web'
}

function resolveCountry(request: Request) {
  const value = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  return value && /^[A-Z]{2}$/.test(value) ? value : null
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const now = new Date().toISOString()
    const country = resolveCountry(request)
    const platform = resolvePlatform(body.platform)

    const profileUpdate: { last_seen_at: string; last_seen_country?: string } = { last_seen_at: now }
    const presenceUpdate: { user_id: string; country_code?: string; platform: string; last_seen_at: string; updated_at: string } = {
      user_id: user.id,
      platform,
      last_seen_at: now,
      updated_at: now,
    }
    if (country) {
      profileUpdate.last_seen_country = country
      presenceUpdate.country_code = country
    }

    const [{ error: profileError }, { error: presenceError }] = await Promise.all([
      supabase.from('profiles').update(profileUpdate).eq('id', user.id),
      supabase.from('user_presence').upsert(presenceUpdate, { onConflict: 'user_id' }),
    ])

    if (profileError) throw profileError
    if (presenceError) throw presenceError
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[analytics/heartbeat]', error)
    return NextResponse.json({ error: 'Présence indisponible.' }, { status: 500 })
  }
}
