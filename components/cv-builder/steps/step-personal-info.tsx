'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { Lock, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface StepPersonalInfoProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
  plan: PlanConfig
}

export function StepPersonalInfo({ data, onUpdate, plan }: StepPersonalInfoProps) {
  const isFreePlan = plan.id === 'gratuit'

  const handlePersonalChange = (field: string, value: string) => {
    onUpdate({
      informations_personnelles: {
        ...data.informations_personnelles,
        [field]: value,
      },
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isFreePlan) {
      toast.error('La photo est une fonctionnalite Pro/Premium.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La photo ne doit pas depasser 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      handlePersonalChange('photo', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    const newInfos = { ...data.informations_personnelles }
    delete newInfos.photo
    onUpdate({ informations_personnelles: newInfos })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Informations personnelles</h2>
        <p className="mt-2 text-muted-foreground">
          Ces informations apparaitront en haut de votre CV
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Identite</CardTitle>
          <CardDescription>Vos informations de contact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 overflow-hidden">
              {data.informations_personnelles.photo ? (
                <>
                  <Image
                    src={data.informations_personnelles.photo}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <span className="mt-1 block text-[10px] text-muted-foreground">Photo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <Label htmlFor="photo" className="flex items-center gap-2">
                Photo de profil
                {isFreePlan && <Lock className="h-3 w-3 text-muted-foreground" />}
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isFreePlan}
                  className="max-w-[250px]"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isFreePlan 
                  ? "Passez au plan Pro pour ajouter une photo a votre CV." 
                  : "Format carre recommande (Max: 2MB)."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prenom *</Label>
              <Input
                id="prenom"
                value={data.informations_personnelles.prenom}
                onChange={(e) => handlePersonalChange('prenom', e.target.value)}
                placeholder="Votre prenom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={data.informations_personnelles.nom}
                onChange={(e) => handlePersonalChange('nom', e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.informations_personnelles.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone *</Label>
              <Input
                id="telephone"
                type="tel"
                value={data.informations_personnelles.telephone}
                onChange={(e) => handlePersonalChange('telephone', e.target.value)}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (optionnel)</Label>
              <Input
                id="linkedin"
                value={data.informations_personnelles.linkedin || ''}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/votre-profil"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={data.informations_personnelles.adresse}
              onChange={(e) => handlePersonalChange('adresse', e.target.value)}
              placeholder="Ville, Pays"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profil professionnel</CardTitle>
          <CardDescription>Resumez votre profil en quelques mots</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre professionnel *</Label>
            <Input
              id="titre"
              value={data.titre_professionnel}
              onChange={(e) => onUpdate({ titre_professionnel: e.target.value })}
              placeholder="Ex: Developpeur Web Full Stack"
              required
            />
            <p className="text-xs text-muted-foreground">
              Le titre qui apparaitra sous votre nom
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (optionnel)</Label>
            <Textarea
              id="resume"
              value={data.resume || ''}
              onChange={(e) => onUpdate({ resume: e.target.value })}
              placeholder="Decrivez brievement votre parcours et vos objectifs professionnels..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              2-3 phrases pour capter l&apos;attention du recruteur
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
