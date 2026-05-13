'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2, Save, User, Calendar, Phone, MapPin, Globe } from 'lucide-react'
import { Profile, PAYS_AFRIQUE_OUEST } from '@/lib/types'

interface EditProfileFormProps {
  initialProfile: Partial<Profile>
  userId: string
}

export function EditProfileForm({ initialProfile, userId }: EditProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    prenom: initialProfile?.prenom || '',
    nom: initialProfile?.nom || '',
    date_naissance: initialProfile?.date_naissance || '',
    telephone: initialProfile?.telephone || '',
    adresse: initialProfile?.adresse || '',
    pays: initialProfile?.pays || 'CI',
    linkedin: initialProfile?.linkedin || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...formData,
          updated_at: new Date().toISOString(),
        })

      if (upsertError) throw upsertError

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informations Personnelles
          </CardTitle>
          <CardDescription>
            Ces informations seront utilisées pour pré-remplir vos futurs CV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                placeholder="Ex: Amina"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="Ex: Coulibaly"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date_naissance"
                  type="date"
                  className="pl-10"
                  value={formData.date_naissance}
                  onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telephone"
                  placeholder="Ex: +225 01 02 03 04 05"
                  className="pl-10"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pays">Pays</Label>
            <select
              id="pays"
              className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-primary outline-none"
              value={formData.pays}
              onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
            >
              {PAYS_AFRIQUE_OUEST.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.nom} ({p.indicatif})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="adresse"
                placeholder="Ex: Rue des Jardins, Abidjan"
                className="pl-10"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn (URL)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                placeholder="Ex: linkedin.com/in/nom-prenom"
                className="pl-10"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 text-emerald-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Profil mis à jour avec succès !
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1 py-6 text-lg font-bold shadow-xl shadow-primary/20"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="py-6 px-8"
          onClick={() => router.push('/profil')}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
