'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CVDonnees } from '@/lib/types'

interface StepPersonalInfoProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
}

export function StepPersonalInfo({ data, onUpdate }: StepPersonalInfoProps) {
  const handlePersonalChange = (field: string, value: string) => {
    onUpdate({
      informations_personnelles: {
        ...data.informations_personnelles,
        [field]: value,
      },
    })
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
        <CardContent className="space-y-4">
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
