import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { CampaignEventType } from '@/lib/campaigns/types'

const eventTypes: CampaignEventType[] = ['viewed', 'dismissed', 'clicked']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })
    const raw = await request.json()
    const campaignId = typeof raw.campaign_id === 'string' ? raw.campaign_id : ''
    const eventType = eventTypes.includes(raw.event_type) ? raw.event_type : null
    if (!campaignId || !eventType) return NextResponse.json({ error: 'Événement invalide.' }, { status: 400 })
    const admin = createAdminClient()
    const { error } = await admin.from('in_app_campaign_events').insert({ campaign_id: campaignId, user_id: user.id, event_type: eventType })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[campaigns/events]', error)
    return NextResponse.json({ error: 'Événement non enregistré.' }, { status: 500 })
  }
}
