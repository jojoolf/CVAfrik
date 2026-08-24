import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { CampaignFrequency, InAppCampaign } from '@/lib/campaigns/types'

function hasAlreadySeen(frequency: CampaignFrequency, dates: string[]) {
  if (frequency === 'every_launch') return false
  if (!dates.length) return false
  if (frequency === 'once') return true
  const lastView = Math.max(...dates.map((date) => new Date(date).getTime()))
  return Date.now() - lastView < 24 * 60 * 60 * 1000
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse(null, { status: 204 })

    const admin = createAdminClient()
    const [{ data: profile }, { data: rawCampaigns, error: campaignError }] = await Promise.all([
      admin.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
      admin.from('in_app_campaigns').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(30),
    ])
    if (campaignError) throw campaignError
    const planAudience = profile?.plan === 'pro' || profile?.plan === 'premium' ? 'pro' : 'starter'
    const now = Date.now()
    const eligible = ((rawCampaigns || []) as InAppCampaign[]).filter((campaign) => {
      const isInAudience = campaign.audience === 'all' || campaign.audience === planAudience
      const started = new Date(campaign.starts_at).getTime() <= now
      const notExpired = !campaign.ends_at || new Date(campaign.ends_at).getTime() > now
      return isInAudience && started && notExpired
    })
    if (!eligible.length) return new NextResponse(null, { status: 204 })

    const ids = eligible.map((campaign) => campaign.id)
    const { data: views, error: viewError } = await admin.from('in_app_campaign_events').select('campaign_id,created_at').eq('user_id', user.id).eq('event_type', 'viewed').in('campaign_id', ids)
    if (viewError) throw viewError
    const datesByCampaign = new Map<string, string[]>()
    for (const view of views || []) datesByCampaign.set(view.campaign_id, [...(datesByCampaign.get(view.campaign_id) || []), view.created_at])
    const campaign = eligible.find((candidate) => !hasAlreadySeen(candidate.frequency, datesByCampaign.get(candidate.id) || []))
    return campaign ? NextResponse.json({ campaign }) : new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[campaigns/active]', error)
    return new NextResponse(null, { status: 204 })
  }
}
