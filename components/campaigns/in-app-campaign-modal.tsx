'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InAppCampaign } from '@/lib/campaigns/types'

async function record(campaignId: string, eventType: 'viewed' | 'dismissed' | 'clicked') {
  try {
    await fetch('/api/campaigns/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign_id: campaignId, event_type: eventType }) })
  } catch {
    // Les statistiques ne doivent jamais empêcher l’affichage ou la fermeture de la campagne.
  }
}

export function InAppCampaignModal() {
  const router = useRouter()
  const [campaign, setCampaign] = useState<InAppCampaign | null>(null)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let active = true
    const timer = window.setTimeout(() => {
      void fetch('/api/campaigns/active', { cache: 'no-store', credentials: 'include' })
        .then(async (response) => response.status === 204 ? null : response.ok ? response.json() : null)
        .then((data) => {
          if (!active || !data?.campaign) return
          setCampaign(data.campaign as InAppCampaign)
          void record(data.campaign.id, 'viewed')
        })
        .catch(() => undefined)
    }, 850)
    return () => { active = false; window.clearTimeout(timer) }
  }, [])

  if (!campaign) return null

  const close = () => { void record(campaign.id, 'dismissed'); setCampaign(null) }
  const openAction = () => { void record(campaign.id, 'clicked'); setCampaign(null); router.push(campaign.action_href) }

  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="campaign-title">
    <div className="w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/25 bg-card shadow-2xl">
      <div className="relative aspect-[9/12] bg-muted"><img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" /><Button type="button" variant="secondary" size="icon" onClick={close} className="absolute right-3 top-3 h-10 w-10 rounded-full bg-background/90 shadow-lg" aria-label="Fermer la campagne"><X className="h-5 w-5" /></Button></div>
      <div className="p-5"><h2 id="campaign-title" className="text-xl font-black tracking-tight text-foreground">{campaign.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{campaign.body}</p><Button type="button" onClick={openAction} className="mt-5 h-12 w-full rounded-xl font-black">{campaign.action_label}<ExternalLink className="ml-2 h-4 w-4" /></Button><Button type="button" variant="ghost" onClick={close} className="mt-2 h-10 w-full rounded-xl text-muted-foreground">Fermer</Button></div>
    </div>
  </div>
}
