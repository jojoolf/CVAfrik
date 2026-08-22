'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Plus, Send, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { OPPORTUNITY_TYPES, type Opportunity, type OpportunityType } from '@/lib/opportunities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const initialForm = {
  type: 'emploi' as OpportunityType,
  titre: '',
  organisation: '',
  description: '',
  pays: '',
  ville: '',
  remote: false,
  niveau: '',
  secteur: '',
  dateLimite: '',
  lienCandidature: '',
  imageUrl: '',
  sourceNom: '',
  sourceUrl: '',
  publie: false,
}

export function OpportunitiesAdminClient() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(initialForm)

  const load = async () => {
    try {
      const response = await fetch('/api/admin/opportunities')
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setItems(payload.opportunities || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de charger les opportunités.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const create = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/admin/opportunities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setForm(initialForm)
      toast.success(payload.opportunity.publie ? 'Opportunité publiée.' : 'Brouillon créé : publiez-le lorsque la vérification est terminée.')
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'La création a échoué.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublication = async (item: Opportunity) => {
    try {
      const response = await fetch(`/api/admin/opportunities/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publie: !item.publie }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      toast.success(item.publie ? 'Opportunité remise en brouillon.' : 'Opportunité publiée.')
      await load()
    } catch (error) { toast.error(error instanceof Error ? error.message : 'La mise à jour a échoué.') }
  }

  const remove = async (item: Opportunity) => {
    if (!window.confirm(`Supprimer définitivement « ${item.titre} » ?`)) return
    try {
      const response = await fetch(`/api/admin/opportunities/${item.id}`, { method: 'DELETE' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      toast.success('Opportunité supprimée.')
      await load()
    } catch (error) { toast.error(error instanceof Error ? error.message : 'La suppression a échoué.') }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 text-slate-900 dark:text-white">
      <div><p className="text-sm font-semibold text-primary">Opportunités</p><h1 className="mt-1 text-3xl font-black tracking-tight">Publication et modération</h1><p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">Créez une offre, conservez-la en brouillon pendant la vérification, puis publiez-la sur le catalogue public.</p></div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="border-slate-200 bg-white shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900"><CardHeader><CardTitle>Nouvelle opportunité</CardTitle><CardDescription>Les champs avec un astérisque sont requis. Utilisez le lien officiel de candidature.</CardDescription></CardHeader><CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={create}>
            <div className="space-y-2"><Label>Type *</Label><select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as OpportunityType }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{OPPORTUNITY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.singular}</option>)}</select></div>
            <div className="space-y-2"><Label>Organisation *</Label><Input value={form.organisation} onChange={(event) => setForm((current) => ({ ...current, organisation: event.target.value }))} required /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Titre *</Label><Input value={form.titre} onChange={(event) => setForm((current) => ({ ...current, titre: event.target.value }))} required placeholder="Ex : Analyste de données junior" /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Description *</Label><Textarea className="min-h-40" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required placeholder="Missions, profil recherché, critères d’éligibilité et modalités..." /></div>
            <div className="space-y-2"><Label>Pays</Label><Input value={form.pays} onChange={(event) => setForm((current) => ({ ...current, pays: event.target.value }))} /></div><div className="space-y-2"><Label>Ville</Label><Input value={form.ville} onChange={(event) => setForm((current) => ({ ...current, ville: event.target.value }))} /></div>
            <div className="space-y-2"><Label>Niveau</Label><Input value={form.niveau} onChange={(event) => setForm((current) => ({ ...current, niveau: event.target.value }))} placeholder="Bac+3, Junior..." /></div><div className="space-y-2"><Label>Secteur</Label><Input value={form.secteur} onChange={(event) => setForm((current) => ({ ...current, secteur: event.target.value }))} /></div>
            <div className="space-y-2"><Label>Date limite</Label><Input type="date" value={form.dateLimite} onChange={(event) => setForm((current) => ({ ...current, dateLimite: event.target.value }))} /></div><div className="space-y-2"><Label>Lien de candidature</Label><Input type="url" value={form.lienCandidature} onChange={(event) => setForm((current) => ({ ...current, lienCandidature: event.target.value }))} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Source</Label><Input value={form.sourceNom} onChange={(event) => setForm((current) => ({ ...current, sourceNom: event.target.value }))} placeholder="Organisation ou site source" /></div><div className="space-y-2"><Label>Lien source</Label><Input type="url" value={form.sourceUrl} onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))} placeholder="https://..." /></div>
            <div className="flex items-center gap-3"><Switch checked={form.remote} onCheckedChange={(remote) => setForm((current) => ({ ...current, remote }))} /><Label>À distance</Label></div><div className="flex items-center gap-3"><Switch checked={form.publie} onCheckedChange={(publie) => setForm((current) => ({ ...current, publie }))} /><Label>Publier maintenant</Label></div>
            <div className="sm:col-span-2"><Button type="submit" disabled={saving} className="w-full">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}{form.publie ? 'Créer et publier' : 'Enregistrer le brouillon'}</Button></div>
          </form>
        </CardContent></Card>
        <Card className="h-fit border-primary/20 bg-primary/5"><CardHeader><CardTitle className="text-lg">Règle de publication</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />Vérifiez la source et la date limite avant publication.</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />N’ajoutez jamais une opportunité provenant d’un lien suspect ou non officiel.</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />Une publication peut être remise en brouillon à tout moment.</p></CardContent></Card>
      </div>
      <Card className="border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"><CardHeader><CardTitle>Publications récentes</CardTitle><CardDescription>{items.filter((item) => item.publie).length} publiées · {items.filter((item) => !item.publie).length} brouillons</CardDescription></CardHeader><CardContent className="space-y-3">{loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : items.length ? items.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.titre}</p><Badge variant={item.publie ? 'default' : 'outline'}>{item.publie ? 'Publié' : 'Brouillon'}</Badge></div><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.organisation} · {OPPORTUNITY_TYPES.find((type) => type.id === item.type)?.singular}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void togglePublication(item)}><Send className="mr-1.5 h-3.5 w-3.5" />{item.publie ? 'Brouillon' : 'Publier'}</Button><Button size="sm" variant="outline" className="text-destructive" onClick={() => void remove(item)}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>) : <p className="py-8 text-center text-sm text-slate-500">Aucune opportunité créée pour le moment.</p>}</CardContent></Card>
    </div>
  )
}
