'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, Camera, CheckCircle2, Globe, Loader2, MapPin, Phone, Save, User, Calendar, X } from 'lucide-react'
import { Profile, PAYS_AFRIQUE } from '@/lib/types'
import { ACCEPTED_IMAGE_ACCEPT, imageExtensionFromMimeType, validateImageFile } from '@/lib/images/client-validation'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

interface EditProfileFormProps {
  initialProfile: Partial<Profile>
  userId: string
}

export function EditProfileForm({ initialProfile, userId }: EditProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '')
  const [avatarPreview, setAvatarPreview] = useState(initialProfile?.avatar_url || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    prenom: initialProfile?.prenom || '',
    nom: initialProfile?.nom || '',
    date_naissance: initialProfile?.date_naissance || '',
    telephone: initialProfile?.telephone || '',
    adresse: initialProfile?.adresse || '',
    pays: initialProfile?.pays || 'CI',
    linkedin: initialProfile?.linkedin || '',
  })

  const initials = `${formData.prenom?.[0] || ''}${formData.nom?.[0] || ''}`.toUpperCase() || 'CA'

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file, MAX_IMAGE_SIZE)
    if (validationError) {
      setError(validationError)
      event.target.value = ''
      return
    }

    setError(null)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarUrl('')
    setAvatarPreview('')
  }

  const uploadAvatar = async (supabase: ReturnType<typeof createClient>) => {
    if (!avatarFile) return avatarUrl || null

    const extension = imageExtensionFromMimeType(avatarFile.type)
    const filePath = `${userId}/profile.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, {
        cacheControl: '3600',
        contentType: avatarFile.type,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return `${data.publicUrl}?v=${Date.now()}`
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== userId) throw new Error('Utilisateur non trouvé')

      const nextAvatarUrl = await uploadAvatar(supabase)
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          avatar_url: nextAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('id')
        .maybeSingle()

      if (updateError) throw updateError
      if (!updatedProfile) throw new Error('Profil introuvable. Réessaie après avoir rechargé la page.')

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: nextAvatarUrl,
          prenom: formData.prenom,
          nom: formData.nom,
          full_name: `${formData.prenom} ${formData.nom}`.trim(),
        },
      })
      if (authError) throw authError

      setAvatarUrl(nextAvatarUrl || '')
      setAvatarPreview(nextAvatarUrl || '')
      setAvatarFile(null)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Ces informations seront utilisées pour pré-remplir vos futurs CV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center">
            <Avatar className="h-24 w-24 shrink-0 rounded-2xl border border-primary/20 bg-muted ring-4 ring-primary/10">
              <AvatarImage src={avatarPreview || undefined} alt="Photo de profil" className="h-full w-full object-cover object-center" />
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-foreground">Photo de profil</p>
              <p className="text-sm text-muted-foreground">JPG, PNG ou WEBP · 5 Mo maximum.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="relative overflow-hidden" disabled={loading}>
                <Camera className="mr-2 h-4 w-4" />
                Choisir une photo
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_ACCEPT}
                  onChange={handleAvatarChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="Choisir une photo de profil"
                />
              </Button>
              {avatarPreview && (
                <Button type="button" variant="ghost" size="icon" onClick={removeAvatar} disabled={loading} aria-label="Retirer la photo">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" placeholder="Ex: Amina" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Ex: Coulibaly" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="date_naissance" type="date" className="pl-10" value={formData.date_naissance} onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="telephone" placeholder="Ex: +225 01 02 03 04 05" className="pl-10" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pays">Pays</Label>
            <select id="pays" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" value={formData.pays} onChange={(e) => setFormData({ ...formData, pays: e.target.value })}>
              {PAYS_AFRIQUE.map((country) => (
                <option key={country.code} value={country.code}>{country.nom} ({country.indicatif})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="adresse" placeholder="Ex: Rue des Jardins, Abidjan" className="pl-10" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn (URL)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="linkedin" placeholder="Ex: linkedin.com/in/nom-prenom" className="pl-10" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      {success && <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600"><CheckCircle2 className="h-5 w-5 shrink-0" />Profil mis à jour avec succès !</div>}

      <div className="flex gap-4">
        <Button type="submit" className="flex-1 py-6 text-lg font-bold shadow-xl shadow-primary/20" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
        <Button type="button" variant="outline" className="px-8 py-6" onClick={() => router.push('/profil')} disabled={loading}>Annuler</Button>
      </div>
    </form>
  )
}
