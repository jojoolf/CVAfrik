'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CalendarDays, CheckCircle2, ImageIcon, Loader2, Megaphone, MousePointerClick, Play, Plus, Power, Send, Users } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/admin/image-upload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CAMPAIGN_AUDIENCE_LABELS, CAMPAIGN_FREQUENCY_LABELS, type CampaignAudience, type CampaignFrequency } from '@/lib/campaigns/types'

type AdminCampaign = {
  id: string; title: string; body: string; image_url: string; action_label: string; action_href: string
  audience: CampaignAudience; frequency: CampaignFrequency; starts_at: string; ends_at: string | null; is_active: boolean
  metrics: { views: number; dismissals: number; clicks: number }
}

const testCampaign = {
  title: 'Opportunités du mois',
  body: 'Emplois, stages et bourses sélectionnés pour vous. Découvrez les opportunités actuellement disponibles sur CVAfrik.',
  image_url: '/campaigns/campaign-test-opportunities.jpg',
  action_label: 'Découvrir maintenant',
  action_href: '/opportunites',
  audience: 'all' as CampaignAudience,
  frequency: 'once' as CampaignFrequency,
}

function localDateTime(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function AdminCampaignsClient() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(testCampaign.title)
  const [body, setBody] = useState(testCampaign.body)
  const [imageUrl, setImageUrl] = useState(testCampaign.image_url)
  const [actionLabel, setActionLabel] = useState(testCampaign.action_label)
  const [actionHref, setActionHref] = useState(testCampaign.action_href)
  const [audience, setAudience] = useState<CampaignAudience>(testCampaign.audience)
  const [frequency, setFrequency] = useState<CampaignFrequency>(testCampaign.frequency)
  const [startsAt, setStartsAt] = useState(() => localDateTime(new Date()))
  const [endsAt, setEndsAt] = useState(() => localDateTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)))
  const totalMetrics = useMemo(() => campaigns.reduce((total, campaign) => ({ views: total.views + campaign.metrics.views, clicks: total.clicks + campaign.metrics.clicks }), { views: 0, clicks: 0 }), [campaigns])

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/campaigns', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Chargement impossible.')
      setCampaigns(data.campaigns || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de charger les campagnes.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  const resetTest = () => {
    setTitle(testCampaign.title); setBody(testCampaign.body); setImageUrl(testCampaign.image_url); setActionLabel(testCampaign.action_label); setActionHref(testCampaign.action_href); setAudience('all'); setFrequency('once')
    setStartsAt(localDateTime(new Date())); setEndsAt(localDateTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)))
    toast.success('Exemple de campagne chargé.')
  }

  const create = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim() || !imageUrl || !actionHref.startsWith('/')) { toast.error('Complète le titre, le message, le visuel et le lien interne.'); return }
    if (!window.confirm('Créer et activer cette campagne dans l’application ? Les utilisateurs concernés la verront à leur prochaine ouverture.')) return
    setSaving(true)
    try {
      const response = await fetch('/api/admin/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, body, image_url: imageUrl, action_label: actionLabel, action_href: actionHref, audience, frequency, starts_at: new Date(startsAt).toISOString(), ends_at: endsAt ? new Date(endsAt).toISOString() : null, is_active: true }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Création impossible.')
      toast.success('Campagne créée et activée. Ouvre CVAfrik pour la tester.')
      await load()
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Création impossible.') } finally { setSaving(false) }
  }

  const toggle = async (campaign: AdminCampaign) => {
    try {
      const response = await fetch('/api/admin/campaigns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: campaign.id, is_active: !campaign.is_active }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Mise à jour impossible.')
      setCampaigns((current) => current.map((item) => item.id === campaign.id ? { ...item, ...data.campaign } : item))
      toast.success(campaign.is_active ? 'Campagne mise en pause.' : 'Campagne activée.')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Mise à jour impossible.') }
  }

  return <div className="min-h-full bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/15 p-6 shadow-elevated sm:p-8"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-primary"><Megaphone className="h-3.5 w-3.5" /> Communication</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Campagnes in-app</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Affiche une communication plein écran utile dans CVAfrik, avec une fermeture visible et un bouton vers une page interne.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-border bg-card/80 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vues</p><p className="mt-1 flex items-center gap-2 text-xl font-black"><Users className="h-4 w-4 text-primary" />{totalMetrics.views}</p></div><div className="rounded-2xl border border-border bg-card/80 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Clics</p><p className="mt-1 flex items-center gap-2 text-xl font-black"><MousePointerClick className="h-4 w-4 text-primary" />{totalMetrics.clicks}</p></div></div></div></header>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><Card className="border-border bg-card shadow-elegant"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />Créer une campagne</CardTitle><CardDescription className="mt-1">La campagne de test est préremplie et mène vers les opportunités.</CardDescription></div><Button type="button" variant="outline" size="sm" onClick={resetTest}>Charger l’exemple</Button></div></CardHeader><CardContent><form className="space-y-5" onSubmit={create}><div className="space-y-2"><Label>Visuel de campagne</Label><ImageUpload value={imageUrl} onChange={setImageUrl} /><p className="text-xs text-muted-foreground">Formats 9:16 et 16:9 pris en charge : l’application conserve automatiquement le format réel de l’image.</p></div><div className="space-y-2"><Label htmlFor="campaign-title">Titre</Label><Input id="campaign-title" maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="campaign-body">Message</Label><Textarea id="campaign-body" maxLength={600} value={body} onChange={(event) => setBody(event.target.value)} className="min-h-28" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="campaign-action-label">Texte du bouton</Label><Input id="campaign-action-label" maxLength={40} value={actionLabel} onChange={(event) => setActionLabel(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="campaign-link">Page ouverte</Label><Input id="campaign-link" value={actionHref} onChange={(event) => setActionHref(event.target.value)} placeholder="/opportunites" /></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="campaign-audience">Public</Label><select id="campaign-audience" value={audience} onChange={(event) => setAudience(event.target.value as CampaignAudience)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="all">Tous les utilisateurs</option><option value="starter">Seulement Starter</option><option value="pro">Seulement Pro</option></select></div><div className="space-y-2"><Label htmlFor="campaign-frequency">Fréquence</Label><select id="campaign-frequency" value={frequency} onChange={(event) => setFrequency(event.target.value as CampaignFrequency)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="once">Une seule fois par utilisateur</option><option value="daily">Au maximum une fois par jour</option><option value="every_launch">À chaque ouverture</option></select></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="campaign-start">Début</Label><Input id="campaign-start" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="campaign-end">Fin</Label><Input id="campaign-end" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} /></div></div><Button type="submit" disabled={saving} className="h-12 w-full rounded-xl font-black">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}{saving ? 'Création…' : 'Créer et activer la campagne'}</Button></form></CardContent></Card>
    <aside className="space-y-6"><Card className="overflow-hidden border-border bg-card"><div className="relative grid min-h-40 place-items-center bg-muted">{imageUrl ? <img src={imageUrl} alt="Aperçu de la campagne" className="max-h-[32rem] w-full object-contain" /> : <span className="grid h-full place-items-center text-muted-foreground"><ImageIcon className="h-8 w-8" /></span>}</div><CardContent className="p-4"><p className="font-black text-foreground">{title || 'Titre de campagne'}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{body || 'Message de campagne'}</p><Button className="mt-4 h-10 w-full rounded-xl" disabled>{actionLabel || 'Découvrir'}</Button></CardContent></Card><Card className="border-primary/25 bg-primary/10"><CardHeader><CardTitle className="text-lg">Bon usage</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground"><p className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />La croix Fermer reste toujours visible dans l’application.</p><p className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />Pour le test, la fréquence est une fois par utilisateur.</p></CardContent></Card></aside></div>
    <section className="mt-8"><div className="mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="text-xl font-black">Campagnes créées</h2></div>{loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : campaigns.length ? <div className="grid gap-4 lg:grid-cols-2">{campaigns.map((campaign) => <Card key={campaign.id} className="border-border bg-card"><CardContent className="flex gap-4 p-4"><img src={campaign.image_url} alt="" className="h-24 w-18 rounded-xl bg-muted object-contain" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="truncate font-black">{campaign.title}</p><p className="mt-1 text-xs text-muted-foreground">{CAMPAIGN_AUDIENCE_LABELS[campaign.audience]} · {CAMPAIGN_FREQUENCY_LABELS[campaign.frequency]}</p></div><Badge variant={campaign.is_active ? 'default' : 'secondary'}>{campaign.is_active ? 'Active' : 'En pause'}</Badge></div><div className="mt-3 flex gap-3 text-xs font-bold text-muted-foreground"><span>👁 {campaign.metrics.views}</span><span>↗ {campaign.metrics.clicks}</span><span>× {campaign.metrics.dismissals}</span></div><Button type="button" size="sm" variant="outline" className="mt-3 h-8" onClick={() => void toggle(campaign)}><Power className="mr-1.5 h-3.5 w-3.5" />{campaign.is_active ? 'Mettre en pause' : 'Activer'}</Button></div></CardContent></Card>)}</div> : <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-muted-foreground">Aucune campagne créée pour le moment.</CardContent></Card>}</section>
  </div></div>
}
