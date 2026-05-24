'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/admin/image-upload'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ModifierPostProps {
  params: Promise<{ id: string }>
}

export default function ModifierPost({ params }: ModifierPostProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('conseils')
  const [imageUrl, setImageUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [publie, setPublie] = useState(true)
  const [slug, setSlug] = useState('')

  useEffect(() => {
    async function loadPost() {
      const supabase = createClient()
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !post) {
        toast.error('Article introuvable')
        router.push('/admin')
        return
      }

      setTitre(post.titre)
      setCategorie(post.categorie)
      setImageUrl(post.image_url || '')
      setContenu(post.contenu)
      setPublie(post.publie)
      setSlug(post.slug)
      setLoading(false)
    }

    loadPost()
  }, [resolvedParams.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titre || !contenu) {
      toast.error('Le titre et le contenu sont obligatoires')
      return
    }

    setSaving(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          titre,
          contenu,
          image_url: imageUrl || null,
          categorie,
          publie,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)

      if (error) throw error

      // Envoyer la newsletter si l'article est publié
      if (publie) {
        fetch('/api/newsletter/send-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: titre, slug, category: categorie }),
        }).catch(() => {})
      }

      // Log admin action
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        fetch('/api/admin/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminEmail: user.email, action: 'update_post', details: { title: titre, category: categorie, published: publie } }),
        }).catch(() => {})
      }

      toast.success('Article mis à jour avec succès !')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au panel
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Modifier l'article / offre</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl shadow-sm border border-border">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre principal</Label>
            <Input id="titre" value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Offre de Comptable Senior à Dakar" required />
          </div>

          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={categorie} onValueChange={setCategorie}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conseils">Conseils & Carrière</SelectItem>
                <SelectItem value="offres-emploi">Offre d'emploi</SelectItem>
                <SelectItem value="stages">Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Image de l'article (Optionnel)</Label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
          <p className="text-xs text-muted-foreground">Formats acceptes : PNG, JPG, WEBP. Max 5 Mo.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contenu">Contenu (Supporte le HTML simple)</Label>
          <Textarea 
            id="contenu" 
            value={contenu} 
            onChange={e => setContenu(e.target.value)} 
            className="min-h-[400px] font-mono text-sm leading-relaxed" 
            placeholder="Écrivez votre article ici..."
            required 
          />
        </div>

        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/30">
          <Switch id="publie" checked={publie} onCheckedChange={setPublie} />
          <Label htmlFor="publie" className="cursor-pointer font-medium">
            Publier immédiatement visible par le public
          </Label>
        </div>

        <Button type="submit" disabled={saving} className="w-full h-12 text-lg">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enregistrer les modifications'}
        </Button>
      </form>
    </div>
  )
}
