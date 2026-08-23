import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const TOKEN_MAX_LENGTH = 4096

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json()
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const platform = body.platform === 'ios' ? 'ios' : body.platform === 'android' ? 'android' : ''
    if (!token || token.length > TOKEN_MAX_LENGTH || !platform) {
      return NextResponse.json({ error: 'Appareil de notification invalide.' }, { status: 400 })
    }

    const { error } = await supabase.from('push_devices').upsert(
      {
        user_id: user.id,
        token,
        platform,
        is_active: true,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'token' },
    )
    if (error) throw error

    await supabase.from('notification_preferences').upsert(
      { user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: 'user_id', ignoreDuplicates: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notifications/device]', error)
    return NextResponse.json({ error: 'Enregistrement des notifications impossible.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json()
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    if (!token || token.length > TOKEN_MAX_LENGTH) {
      return NextResponse.json({ error: 'Appareil de notification invalide.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('push_devices')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('token', token)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notifications/device/delete]', error)
    return NextResponse.json({ error: 'Mise à jour de l’appareil impossible.' }, { status: 500 })
  }
}
