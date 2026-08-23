'use client'

import { useEffect, useMemo, useState } from 'react'
import { BellRing, CheckCircle2, Info, Loader2, Megaphone, Send, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const categories = [
  { id: 'announcement', label: 'Annonce importante', description: 'Mise à jour, information utile ou communication CVAfrik.', href: '/dashboard' },
  { id: 'opportunity', label: 'Opportunité', description: 'Nouvelle offre, stage, bourse ou programme à consulter.', href: '/opportunites' },
] as const

type CategoryId = (typeof categories)[number]['id']

type BroadcastSummary = {
  total: number
  inbox: number
  push: number
  email: number
  skipped: number
}

export function AdminNotificationsClient() {
  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const [loadingAudience, setLoadingAudience] = useState(true)
  const [sending, setSending] = useState(false)
  const [summary, setSummary] = useState<BroadcastSummary | null>(null)
  const [category, setCategory] = useState<CategoryId>('announcement')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [href, setHref] = useState('/dashboard')

  const selectedCategory = useMemo(() => categories.find((item) => item.id === category) || categories[0], [category])

  useEffect(() => {
    let active = true
    void fetch('/api/admin/notifications/broadcast')
      .then(async (response) => response.ok ? response.json() : Promise.reject(new Error('Audience indisponible.')))
      .then((data) => { if (active) setAudienceCount(data.audienceCount || 0) })
      .catch(() => { if (active) toast.error('Impossible de charger le nombre de comptes.') })
      .finally(() => { if (active) setLoadingAudience(false) })
    return () => { active = false }
  }, [])

  const changeCategory = (next: CategoryId) => {
    setCategory(next)
    setHref(categories.find((item) => item.id === next)?.href || '/dashboard')
  }

  const publish = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim()) {
      toast.error('Ajoute un titre et un message avant de publier.')
      return
    }

    const audience = audienceCount ?? 0
    const confirmed = window.confirm(`Confirmer l’envoi de cette notification à ${audience.toLocaleString('fr-FR')} compte${audience > 1 ? 's' : ''} ?\n\nChaque destinataire recevra la cloche, le push Android et l’e-mail uniquement selon ses préférences.`)
    if (!confirmed) return

    setSending(true)
    try {
      const response = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, body, href }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'La diffusion a échoué.')
      setSummary(data.summary)
      setTitle('')
      setBody('')
      toast.success('Notification diffusée avec succès.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'La diffusion a échoué.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-full bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/15 p-6 shadow-elevated sm:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-primary"><Megaphone className="h-3.5 w-3.5" /> Communication</div>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Publier une notification</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Diffuse une annonce ou une opportunité depuis ton espace administrateur, sans accéder aux outils techniques.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Audience disponible</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-black"><Users className="h-5 w-5 text-primary" />{loadingAudience ? '…' : (audienceCount || 0).toLocaleString('fr-FR')}</p>
              <p className="mt-1 text-xs text-muted-foreground">comptes CVAfrik</p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <Card className="border-border bg-card shadow-elegant">
            <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><BellRing className="h-5 w-5 text-primary" /> Nouvelle diffusion</CardTitle><CardDescription>Le message est ajouté à la cloche de chaque compte autorisé avant la remise push ou e-mail.</CardDescription></CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={publish}>
                <div className="space-y-2"><Label htmlFor="notification-category">Catégorie</Label><select id="notification-category" value={category} onChange={(event) => changeCategory(event.target.value as CategoryId)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"><option value="announcement">Annonce importante</option><option value="opportunity">Opportunité</option></select><p className="text-xs text-slate-500">{selectedCategory.description}</p></div>
                <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="notification-title">Titre</Label><span className="text-xs text-slate-500">{title.length}/180</span></div><Input id="notification-title" value={title} maxLength={180} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Une nouvelle opportunité est disponible" className="h-11 border-input bg-background text-foreground placeholder:text-muted-foreground" required /></div>
                <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="notification-body">Message</Label><span className="text-xs text-slate-500">{body.length}/600</span></div><Textarea id="notification-body" value={body} maxLength={600} onChange={(event) => setBody(event.target.value)} placeholder="Écris un message court, clair et utile pour les utilisateurs." className="min-h-36 border-input bg-background text-foreground placeholder:text-muted-foreground" required /></div>
                <div className="space-y-2"><Label htmlFor="notification-link">Page ouverte au clic</Label><Input id="notification-link" value={href} onChange={(event) => setHref(event.target.value)} placeholder="/dashboard ou /opportunites" className="h-11 border-input bg-background text-foreground placeholder:text-muted-foreground" /><p className="text-xs text-slate-500">Utilise uniquement une page interne commençant par « / ».</p></div>
                <Button type="submit" disabled={sending || loadingAudience || audienceCount === 0} className="h-12 w-full rounded-xl bg-primary font-black text-primary-foreground hover:bg-primary/90">{sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}{sending ? 'Diffusion en cours…' : `Publier pour ${loadingAudience ? '…' : (audienceCount || 0).toLocaleString('fr-FR')} comptes`}</Button>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="border-primary/25 bg-primary/10"><CardHeader><CardTitle className="text-lg text-foreground">Ce que reçoit chaque compte</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-foreground"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Une entrée dans la cloche et l’historique CVAfrik.</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Une alerte Android, si la personne l’a activée.</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Un e-mail de secours, si ce choix est activé.</p></CardContent></Card>
            <Card className="border-border bg-card"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-foreground"><Info className="h-4 w-4 text-primary" /> Respect des préférences</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">Les utilisateurs qui ont désactivé les annonces ou les opportunités ne reçoivent pas cette catégorie. La diffusion est enregistrée dans le journal administrateur.</p></CardContent></Card>
            {summary && <Card className="border-emerald-400/30 bg-emerald-400/10"><CardHeader><CardTitle className="text-lg text-foreground">Dernière diffusion</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-foreground"><p><Badge className="mr-2 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20">{summary.inbox}</Badge>historiques créés</p><p><Badge className="mr-2 bg-sky-500/20 text-sky-200 hover:bg-sky-500/20">{summary.push}</Badge>alertes Android remises</p><p><Badge className="mr-2 bg-violet-500/20 text-violet-200 hover:bg-violet-500/20">{summary.email}</Badge>e-mails envoyés</p>{summary.skipped > 0 && <p className="text-xs text-muted-foreground">{summary.skipped} compte(s) ont choisi de ne pas recevoir cette catégorie.</p>}</CardContent></Card>}
          </aside>
        </div>
      </div>
    </div>
  )
}
