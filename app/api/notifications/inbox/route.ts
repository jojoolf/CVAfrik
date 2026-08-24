import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const retentionCutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id,category,title,body,href,read_at,created_at')
      .eq('user_id', user.id)
      .gte('created_at', retentionCutoff)
      .order('created_at', { ascending: false })
      .limit(25)
    if (error) throw error

    return NextResponse.json({ notifications: data ?? [] })
  } catch (error) {
    console.error('[notifications/inbox/get]', error)
    return NextResponse.json({ error: 'Notifications indisponibles.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json()
    const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id)).slice(0, 25) : []
    if (!ids.length) return NextResponse.json({ error: 'Aucune notification valide.' }, { status: 400 })

    const { error } = await supabase
      .from('user_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .in('id', ids)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notifications/inbox/patch]', error)
    return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 })
  }
}
