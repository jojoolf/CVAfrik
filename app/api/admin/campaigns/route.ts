import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin/access'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { CampaignAudience, CampaignFrequency } from '@/lib/campaigns/types'

const audiences: CampaignAudience[] = ['all', 'starter', 'pro']
const frequencies: CampaignFrequency[] = ['once', 'daily', 'every_launch']

function isSafeInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function isSafeImageSource(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false
  try {
    const url = new URL(value, 'https://cv-afrik.vercel.app')
    return url.protocol === 'https:' || (url.origin === 'https://cv-afrik.vercel.app' && url.pathname.startsWith('/'))
  } catch {
    return false
  }
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

function summarizeEvents(events: Array<{ campaign_id: string; event_type: string }>) {
  const summary = new Map<string, { views: number; dismissals: number; clicks: number }>()
  for (const event of events) {
    const current = summary.get(event.campaign_id) || { views: 0, dismissals: 0, clicks: 0 }
    if (event.event_type === 'viewed') current.views += 1
    if (event.event_type === 'dismissed') current.dismissals += 1
    if (event.event_type === 'clicked') current.clicks += 1
    summary.set(event.campaign_id, current)
  }
  return summary
}

export async function GET() {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const admin = createAdminClient()
    const [{ data: campaigns, error: campaignError }, { data: events, error: eventError }] = await Promise.all([
      admin.from('in_app_campaigns').select('*').order('created_at', { ascending: false }),
      admin.from('in_app_campaign_events').select('campaign_id,event_type'),
    ])
    if (campaignError) throw campaignError
    if (eventError) throw eventError
    const summary = summarizeEvents(events || [])
    return NextResponse.json({ campaigns: (campaigns || []).map((campaign) => ({ ...campaign, metrics: summary.get(campaign.id) || { views: 0, dismissals: 0, clicks: 0 } })) })
  } catch (error) {
    console.error('[admin/campaigns/get]', error)
    return NextResponse.json({ error: 'Impossible de charger les campagnes. Vérifie que la migration Supabase a été exécutée.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const raw = await request.json()
    const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 160) : ''
    const body = typeof raw.body === 'string' ? raw.body.trim().slice(0, 600) : ''
    const imageUrl = typeof raw.image_url === 'string' ? raw.image_url.trim().slice(0, 1_500) : ''
    const actionLabel = typeof raw.action_label === 'string' ? raw.action_label.trim().slice(0, 40) : 'Découvrir'
    const actionHref = isSafeInternalPath(raw.action_href) ? raw.action_href.slice(0, 500) : ''
    const audience = audiences.includes(raw.audience) ? raw.audience : 'all'
    const frequency = frequencies.includes(raw.frequency) ? raw.frequency : 'once'
    const startsAt = typeof raw.starts_at === 'string' && !Number.isNaN(Date.parse(raw.starts_at)) ? new Date(raw.starts_at).toISOString() : new Date().toISOString()
    const endsAt = typeof raw.ends_at === 'string' && raw.ends_at && !Number.isNaN(Date.parse(raw.ends_at)) ? new Date(raw.ends_at).toISOString() : null
    const isActive = raw.is_active === true

    if (!title || !body || !imageUrl || !actionHref || !isSafeImageSource(imageUrl)) {
      return NextResponse.json({ error: 'Titre, message, visuel et lien interne valide sont obligatoires.' }, { status: 400 })
    }
    if (endsAt && new Date(endsAt) <= new Date(startsAt)) return NextResponse.json({ error: 'La date de fin doit être postérieure à la date de début.' }, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin.from('in_app_campaigns').insert({
      title, body, image_url: imageUrl, action_label: actionLabel || 'Découvrir', action_href: actionHref,
      audience, frequency, starts_at: startsAt, ends_at: endsAt, is_active: isActive, created_by: user.id,
    }).select('*').single()
    if (error) throw error
    await admin.from('admin_logs').insert({ admin_email: user.email!, action: 'campagne_in_app_creee', details: { campaign_id: data.id, title, audience, frequency, is_active: isActive } })
    return NextResponse.json({ campaign: data }, { status: 201 })
  } catch (error) {
    console.error('[admin/campaigns/post]', error)
    return NextResponse.json({ error: 'Création impossible. Vérifie que la migration Supabase a été exécutée.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const raw = await request.json()
    const id = typeof raw.id === 'string' ? raw.id : ''
    if (!id || typeof raw.is_active !== 'boolean') return NextResponse.json({ error: 'Campagne invalide.' }, { status: 400 })
    const admin = createAdminClient()
    const { data, error } = await admin.from('in_app_campaigns').update({ is_active: raw.is_active, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
    if (error) throw error
    await admin.from('admin_logs').insert({ admin_email: user.email!, action: raw.is_active ? 'campagne_in_app_activee' : 'campagne_in_app_pausee', details: { campaign_id: id } })
    return NextResponse.json({ campaign: data })
  } catch (error) {
    console.error('[admin/campaigns/patch]', error)
    return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 })
  }
}
