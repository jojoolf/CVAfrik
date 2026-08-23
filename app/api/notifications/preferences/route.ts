import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const defaults = {
  push_enabled: true,
  email_enabled: true,
  applications_enabled: true,
  opportunities_enabled: true,
  payments_enabled: true,
  announcements_enabled: true,
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('push_enabled,email_enabled,applications_enabled,opportunities_enabled,payments_enabled,announcements_enabled')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) throw error

    return NextResponse.json({ preferences: data ?? defaults })
  } catch (error) {
    console.error('[notifications/preferences/get]', error)
    return NextResponse.json({ error: 'Préférences indisponibles.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json()
    const preferences = Object.fromEntries(
      Object.keys(defaults).flatMap((key) => typeof body[key] === 'boolean' ? [[key, body[key]]] : []),
    )
    if (Object.keys(preferences).length === 0) {
      return NextResponse.json({ error: 'Aucune préférence valide.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({ user_id: user.id, ...preferences, updated_at: new Date().toISOString() })
      .select('push_enabled,email_enabled,applications_enabled,opportunities_enabled,payments_enabled,announcements_enabled')
      .single()
    if (error) throw error

    return NextResponse.json({ preferences: data })
  } catch (error) {
    console.error('[notifications/preferences/put]', error)
    return NextResponse.json({ error: 'Mise à jour des préférences impossible.' }, { status: 500 })
  }
}
