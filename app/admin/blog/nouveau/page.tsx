'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NouveauPost() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('conseils')
  const [imageUrl, setImageUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [publie, setPublie] = useState(true)

  // Générer un slug simple à partir du titre
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titre || !contenu) {
      toast.error('Le titre et le contenu sont obligatoires')
      return
    }

    setLoading(true)
    const supabase = createClient()
    
    // On ajoute un timestamp au slug pour s'assurer qu'il est unique
    const slug = `${generateSlug(titre)}-${Math.floor(Math.random() * 1000)}`

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          titre,
          slug,
          contenu,
          image_url: imageUrl || null,
          categorie,
          publie
        })

      if (error) throw error

      toast.success('Article publié avec succès !')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au panel
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Rédiger un article / offre</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
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
          <Label htmlFor="image">URL de l'image (Optionnel)</Label>
          <Input id="image" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://exemple.com/image.jpg" />
          <p className="text-xs text-muted-foreground">Collez le lien direct d'une image (vous pouvez héberger l'image sur Imgur, etc.)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contenu">Contenu (Supporte le HTML simple : &lt;b&gt;, &lt;br&gt;, &lt;ul&gt;)</Label>
          <Textarea 
            id="contenu" 
            value={contenu} 
            onChange={e => setContenu(e.target.value)} 
            className="min-h-[300px]" 
            placeholder="Écrivez votre article ici..."
            required 
          />
        </div>

        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-slate-50">
          <Switch id="publie" checked={publie} onCheckedChange={setPublie} />
          <Label htmlFor="publie" className="cursor-pointer font-medium">
            Publier immédiatement visible par le public
          </Label>
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enregistrer'}
        </Button>
      </form>
    </div>
  )
}
