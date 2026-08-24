import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const now = new Date().toISOString()
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('native_promo_banners')
      .select('id,slug,title,body,image_url,action_label,action_href,position')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gt.${now}`)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ banners: data || [] })
  } catch (error) {
    console.error('[promo-banners/get]', error)
    return NextResponse.json({ error: 'Impossible de charger les bannières.' }, { status: 500 })
  }
}
