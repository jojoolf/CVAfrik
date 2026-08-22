'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpenText, CheckCircle2, CircleDotDashed, Eye, FileText, ImageIcon, Loader2, Save, Send, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/image-upload'

const categories = [
  { value: 'conseils', label: 'Conseils & Carrière', detail: 'Guides, conseils et actualités.' },
  { value: 'offres-emploi', label: "Offre d'emploi", detail: 'Emplois à diffuser sur CVAfrik.' },
  { value: 'stages', label: 'Stage', detail: 'Stages et premières expériences.' },
]

export default function NouveauPost() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('conseils')
  const [imageUrl, setImageUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [publie, setPublie] = useState(true)

  const selectedCategory = useMemo(
    () => categories.find((item) => item.value === categorie) || categories[0],
    [categorie],
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!titre.trim() || !contenu.trim()) {
      toast.error('Ajoute un titre et du contenu avant d’enregistrer.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre, contenu, categorie, imageUrl, publie }),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.post) {
        throw new Error(result?.error || 'La publication a échoué.')
      }

      if (publie) {
        fetch('/api/newsletter/send-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: result.post.titre, slug: result.post.slug, category: result.post.categorie }),
        }).catch(() => undefined)
      }

      toast.success(publie ? 'Contenu publié avec succès.' : 'Brouillon enregistré avec succès.')
      router.push('/admin')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </Link>

        <header className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Espace éditorial
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Créer un contenu qui inspire.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Publie un article, une offre d’emploi ou un stage avec une présentation propre et prête pour tes lecteurs.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
            <CircleDotDashed className="h-4 w-4 text-primary" />
            <span>{publie ? 'Publication immédiate activée' : 'Enregistrement en brouillon'}</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
              <div><h2 className="font-black text-white">Le contenu</h2><p className="text-sm text-slate-500">Les informations visibles par tes lecteurs.</p></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3"><Label htmlFor="titre" className="text-sm font-bold text-slate-200">Titre principal</Label><span className="text-xs text-slate-500">{titre.length}/120</span></div>
              <Input id="titre" value={titre} maxLength={120} onChange={(event) => setTitre(event.target.value)} placeholder="Ex. Offre de Comptable Senior à Dakar" className="h-12 border-white/10 bg-slate-950 text-base text-white placeholder:text-slate-600 focus-visible:ring-primary" required />
              <p className="text-xs text-slate-500">Utilise un titre concret, précis et facile à comprendre.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-200">Catégorie</Label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger className="h-12 border-white/10 bg-slate-950 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">{selectedCategory.detail}</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-primary" /><Label className="text-sm font-bold text-slate-200">Image de couverture <span className="font-normal text-slate-500">(facultative)</span></Label></div>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
              <p className="text-xs text-slate-500">PNG, JPG ou WEBP · 5 Mo maximum · une image nette améliore la visibilité du contenu.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label htmlFor="contenu" className="text-sm font-bold text-slate-200">Rédaction</Label><span className="text-xs text-slate-500">{contenu.trim() ? `${contenu.trim().split(/\s+/).length} mots` : 'Commence à écrire'}</span></div>
              <Textarea id="contenu" value={contenu} onChange={(event) => setContenu(event.target.value)} className="min-h-[460px] resize-y border-white/10 bg-slate-950 font-mono text-sm leading-7 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary" placeholder={"Présente le contexte, les critères, la date limite et la manière de postuler.\n\nTu peux utiliser du HTML simple : <b>, <br>, <ul> et <li>."} required />
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/10 to-slate-900 p-5 shadow-xl shadow-black/20">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Send className="h-5 w-5" /></span><div><h2 className="font-black">Publication</h2><p className="text-xs text-slate-400">Choisis la visibilité du contenu.</p></div></div>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div><Label htmlFor="publie" className="cursor-pointer text-sm font-bold text-white">Publier maintenant</Label><p className="mt-1 text-xs leading-5 text-slate-500">Le contenu sera visible publiquement et la newsletter sera envoyée.</p></div>
                <Switch id="publie" checked={publie} onCheckedChange={setPublie} />
              </div>
              <Button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-primary font-black text-primary-foreground hover:bg-primary/90">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : publie ? <Send className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                {loading ? 'Enregistrement…' : publie ? 'Publier le contenu' : 'Enregistrer le brouillon'}
              </Button>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2"><BookOpenText className="h-5 w-5 text-primary" /><h2 className="font-black">Avant de publier</h2></div>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {['Vérifie la date limite et le lien de candidature.', 'Ajoute les informations essentielles dès le premier paragraphe.', 'Privilégie une image lisible et adaptée au contenu.'].map((tip) => <li key={tip} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{tip}</li>)}
              </ul>
            </section>

            <Link href="/admin" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"><Eye className="h-4 w-4" /> Revenir au tableau de bord</Link>
          </aside>
        </form>
      </div>
    </div>
  )
}
