'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ImageIcon, Loader2, Megaphone, Pencil, Plus, Power, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/admin/image-upload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PromoBanner = {
  id: string
  slug: string
  title: string
  body: string
  image_url: string
  action_label: string
  action_href: string
  position: number
  is_active: boolean
  starts_at: string
  ends_at: string | null
}

type BannerForm = Omit<PromoBanner, 'id' | 'slug'>

const initialForm: BannerForm = {
  title: 'Opportunités à la une',
  body: 'Découvrez des emplois, stages et bourses adaptés à votre parcours.',
  image_url: '/banners/native-opportunities.png',
  action_label: 'Explorer les opportunités',
  action_href: '/opportunites',
  position: 100,
  is_active: true,
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: '',
}

function toLocalDateTime(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function AdminPromoBannersClient() {
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [form, setForm] = useState<BannerForm>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const activeCount = useMemo(() => banners.filter((banner) => banner.is_active).length, [banners])

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/promo-banners', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Chargement impossible.')
      setBanners(data.banners || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de charger les bannières.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const reset = () => {
    setEditingId(null)
    setForm({ ...initialForm, starts_at: new Date().toISOString().slice(0, 16) })
  }

  const edit = (banner: PromoBanner) => {
    setEditingId(banner.id)
    setForm({
      title: banner.title,
      body: banner.body,
      image_url: banner.image_url,
      action_label: banner.action_label,
      action_href: banner.action_href,
      position: banner.position,
      is_active: banner.is_active,
      starts_at: toLocalDateTime(banner.starts_at),
      ends_at: toLocalDateTime(banner.ends_at),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.body.trim() || !form.image_url || !form.action_href.startsWith('/')) {
      toast.error('Ajoute un titre, un texte, un visuel et une page interne commençant par /.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        position: Number(form.position) || 0,
        starts_at: new Date(form.starts_at || Date.now()).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      }
      const response = await fetch('/api/admin/promo-banners', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Enregistrement impossible.')
      toast.success(editingId ? 'Bannière mise à jour.' : 'Bannière créée et prête pour l’application.')
      reset()
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Enregistrement impossible.')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (banner: PromoBanner) => {
    try {
      const response = await fetch('/api/admin/promo-banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, is_active: !banner.is_active }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Mise à jour impossible.')
      setBanners((current) => current.map((item) => item.id === banner.id ? data.banner : item))
      toast.success(banner.is_active ? 'Bannière mise en pause.' : 'Bannière activée.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Mise à jour impossible.')
    }
  }

  const remove = async (banner: PromoBanner) => {
    if (!window.confirm(`Supprimer définitivement « ${banner.title} » ?`)) return
    try {
      const response = await fetch('/api/admin/promo-banners', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: banner.id }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Suppression impossible.')
      if (editingId === banner.id) reset()
      setBanners((current) => current.filter((item) => item.id !== banner.id))
      toast.success('Bannière supprimée.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Suppression impossible.')
    }
  }

  return <div className="min-h-full bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8"><div className="mx-auto max-w-7xl">
    <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/15 p-5 shadow-elevated sm:p-8"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" /><div className="relative"><div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-primary"><Megaphone className="h-3.5 w-3.5" /> Application mobile</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Bannières APK</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Ajoute les bannières visibles sous « Créer mon CV ». Tu peux les modifier, les classer, les mettre en pause ou les supprimer depuis ton téléphone.</p><div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-3 py-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{activeCount} bannière{activeCount > 1 ? 's' : ''} active{activeCount > 1 ? 's' : ''}</div></div></header>

    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]"><Card className="border-border bg-card shadow-elegant"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />{editingId ? 'Modifier la bannière' : 'Créer une bannière'}</CardTitle><CardDescription className="mt-1">Le lien doit ouvrir une page interne de CVAfrik, par exemple /opportunites.</CardDescription></div>{editingId && <Button type="button" variant="outline" size="sm" onClick={reset}>Nouvelle bannière</Button>}</div></CardHeader><CardContent><form className="space-y-5" onSubmit={save}><div className="space-y-2"><Label>Visuel horizontal</Label><ImageUpload value={form.image_url} onChange={(image_url) => setForm((current) => ({ ...current, image_url }))} /><p className="text-xs text-muted-foreground">Format recommandé : image 16:9, sans texte. Le titre et le bouton restent lisibles dans l’application.</p></div><div className="space-y-2"><Label htmlFor="promo-title">Titre</Label><Input id="promo-title" maxLength={90} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></div><div className="space-y-2"><Label htmlFor="promo-body">Texte</Label><Textarea id="promo-body" maxLength={240} className="min-h-24" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="promo-action">Bouton</Label><Input id="promo-action" maxLength={48} value={form.action_label} onChange={(event) => setForm((current) => ({ ...current, action_label: event.target.value }))} /></div><div className="space-y-2"><Label htmlFor="promo-link">Page ouverte</Label><Input id="promo-link" value={form.action_href} onChange={(event) => setForm((current) => ({ ...current, action_href: event.target.value }))} placeholder="/opportunites" /></div></div><div className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="promo-position">Ordre</Label><Input id="promo-position" type="number" min="0" value={form.position} onChange={(event) => setForm((current) => ({ ...current, position: Number(event.target.value) }))} /></div><div className="space-y-2"><Label htmlFor="promo-start">Début</Label><Input id="promo-start" type="datetime-local" value={form.starts_at} onChange={(event) => setForm((current) => ({ ...current, starts_at: event.target.value }))} /></div><div className="space-y-2"><Label htmlFor="promo-end">Fin (facultative)</Label><Input id="promo-end" type="datetime-local" value={form.ends_at || ''} onChange={(event) => setForm((current) => ({ ...current, ends_at: event.target.value }))} /></div></div><label className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 p-3 text-sm font-semibold"><input type="checkbox" className="size-4 accent-primary" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} />Activer cette bannière dès l’enregistrement</label><Button type="submit" disabled={saving} className="h-12 w-full rounded-xl font-black">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Créer la bannière'}</Button></form></CardContent></Card>

    <aside className="space-y-4"><Card className="overflow-hidden border-border bg-card"><div className="relative aspect-video bg-muted">{form.image_url ? <img src={form.image_url} alt="Aperçu de la bannière" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-muted-foreground"><ImageIcon className="h-8 w-8" /></span>}<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" /></div><CardContent className="-mt-24 relative p-4 text-white"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/75">À la une</p><p className="mt-1 text-lg font-black">{form.title || 'Titre de la bannière'}</p><p className="mt-1 max-w-xs text-xs leading-5 text-white/85">{form.body || 'Texte de présentation'}</p><span className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-900">{form.action_label || 'Découvrir'}</span></CardContent></Card><Card className="border-primary/25 bg-primary/10"><CardContent className="p-4 text-sm leading-6"><p className="font-black">Bon usage</p><p className="mt-1 text-muted-foreground">Garde 3 à 5 bannières actives maximum pour que le carrousel reste agréable. Une bannière partenaire devra être marquée « Sponsorisé ».</p></CardContent></Card></aside></div>

    <section className="mt-8"><div className="mb-4 flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /><h2 className="text-xl font-black">Bannières enregistrées</h2></div>{loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : banners.length ? <div className="grid gap-4 lg:grid-cols-2">{banners.map((banner) => <Card key={banner.id} className="overflow-hidden border-border bg-card"><div className="flex gap-3 p-3"><img src={banner.image_url} alt="" className="h-24 w-36 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="truncate font-black">{banner.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{banner.body}</p></div><Badge variant={banner.is_active ? 'default' : 'secondary'}>{banner.is_active ? 'Active' : 'Pause'}</Badge></div><p className="mt-2 text-[11px] font-medium text-muted-foreground">Ordre {banner.position} · {banner.action_href}</p><div className="mt-3 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" className="h-8" onClick={() => edit(banner)}><Pencil className="mr-1.5 h-3.5 w-3.5" />Modifier</Button><Button type="button" size="sm" variant="outline" className="h-8" onClick={() => void toggle(banner)}><Power className="mr-1.5 h-3.5 w-3.5" />{banner.is_active ? 'Pause' : 'Activer'}</Button><Button type="button" size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => void remove(banner)}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Supprimer</Button></div></div></div></Card>)}</div> : <Card className="border-dashed"><CardContent className="py-12 text-center text-sm text-muted-foreground">Aucune bannière enregistrée. Exécute la migration SQL, puis crée ta première bannière.</CardContent></Card>}</section>
  </div></div>
}
