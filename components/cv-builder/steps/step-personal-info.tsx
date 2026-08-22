'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { 
  Lock, 
  Upload, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Sparkles, 
  Briefcase, 
  FileText,
  Camera,
  Check
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { ProfileImportDialog } from '../profile-import-dialog'

interface StepPersonalInfoProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
  plan: PlanConfig
  onImport?: (data: CVDonnees) => void
}

export function StepPersonalInfo({ data, onUpdate, plan, onImport }: StepPersonalInfoProps) {
  const isFreePlan = plan.id === 'gratuit'
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)

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
      toast.error('La photo de profil est réservée aux abonnés Pro et Premium.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 2 Mo')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      handlePersonalChange('photo', reader.result as string)
      toast.success('Photo de profil ajoutée !')
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    const newInfos = { ...data.informations_personnelles }
    delete newInfos.photo
    onUpdate({ informations_personnelles: newInfos })
    toast.info('Photo retirée.')
  }

  const handleAiSuggestSummary = () => {
    const title = data.titre_professionnel
    if (!title) {
      toast.error('Veuillez d\'abord saisir un titre professionnel !')
      return
    }

    setIsGeneratingBio(true)
    setTimeout(() => {
      const suggestions = [
        `Professionnel passionné et orienté résultats en tant que ${title}, avec une solide capacité d'adaptation et un esprit d'équipe éprouvé. Déterminé à apporter une vraie valeur ajoutée aux projets ambitieux.`,
        `${title} motivé avec une approche rigoureuse et créative. Spécialisé dans la résolution de problèmes complexes et la gestion efficace des missions confiées.`,
        `Expert enthousiaste en ${title}, reconnu pour son autonomie, sa rigueur opérationnelle et son engagement vers l'excellence.`
      ]
      const randomBio = suggestions[Math.floor(Math.random() * suggestions.length)]
      onUpdate({ resume: randomBio })
      setIsGeneratingBio(false)
      toast.success('Résumé suggéré par l\'IA généré avec succès !')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {onImport && (
        <div className="sm:hidden">
          <ProfileImportDialog currentData={data} onApply={onImport} />
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Informations Personnelles</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Ces coordonnées et votre profil professionnel seront mis en valeur au sommet de votre CV.
        </p>
      </div>

      {/* Card 1: Identité et Photo */}
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Identité & Photo</CardTitle>
              <CardDescription className="text-xs">Vos informations de contact et votre photo de profil</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-dashed border-border p-4 bg-muted/10">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-background bg-muted shadow-md overflow-hidden group">
              {data.informations_personnelles.photo ? (
                <>
                  <Image
                    src={data.informations_personnelles.photo}
                    alt="Photo de profil"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="rounded-full bg-destructive p-2 text-destructive-foreground hover:bg-destructive/90 transition-transform active:scale-95"
                      title="Supprimer la photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-2">
                  <Camera className="mx-auto h-7 w-7 text-muted-foreground/70" />
                  <span className="mt-1 block text-[10px] font-medium text-muted-foreground">Ajouter Photo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Label htmlFor="photo" className="text-sm font-semibold cursor-pointer">
                  Photo de profil
                </Label>
                {isFreePlan && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Lock className="h-2.5 w-2.5" />
                    Pro
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isFreePlan}
                  className="max-w-[280px] text-xs cursor-pointer file:rounded-lg file:bg-primary/10 file:text-primary file:border-0 file:font-semibold file:px-3 file:py-1 hover:file:bg-primary/20"
                />
              </div>

              <p className="text-xs text-muted-foreground leading-snug">
                {isFreePlan 
                  ? "Passez au plan Pro/Premium pour débloquer la photo de profil sur tous vos templates." 
                  : "Format carré recommandé (JPG ou PNG, Max : 2 Mo)."}
              </p>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prenom" className="text-xs font-semibold text-foreground">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="prenom"
                  value={data.informations_personnelles.prenom}
                  onChange={(e) => handlePersonalChange('prenom', e.target.value)}
                  placeholder="Ex: Kouassi"
                  className="pl-9 rounded-xl focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nom" className="text-xs font-semibold text-foreground">
                Nom <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nom"
                  value={data.informations_personnelles.nom}
                  onChange={(e) => handlePersonalChange('nom', e.target.value)}
                  placeholder="Ex: Yao"
                  className="pl-9 rounded-xl focus-visible:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Adresse Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={data.informations_personnelles.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                placeholder="kouassi.yao@exemple.com"
                className="pl-9 rounded-xl focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="telephone" className="text-xs font-semibold text-foreground">
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telephone"
                  type="tel"
                  value={data.informations_personnelles.telephone}
                  onChange={(e) => handlePersonalChange('telephone', e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="pl-9 rounded-xl focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedin" className="text-xs font-semibold text-foreground">
                Profil LinkedIn <span className="text-muted-foreground font-normal">(Optionnel)</span>
              </Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={data.informations_personnelles.linkedin || ''}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/votre-nom"
                  className="pl-9 rounded-xl focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adresse" className="text-xs font-semibold text-foreground">
              Ville, Pays
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="adresse"
                value={data.informations_personnelles.adresse}
                onChange={(e) => handlePersonalChange('adresse', e.target.value)}
                placeholder="Abidjan, Côte d'Ivoire"
                className="pl-9 rounded-xl focus-visible:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Profil & Résumé Professionnel */}
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Titre & Résumé Professionnel</CardTitle>
              <CardDescription className="text-xs">Présentez votre métier et votre accroche en 2-3 phrases</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="titre" className="text-xs font-semibold text-foreground">
              Titre Professionnel <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="titre"
                value={data.titre_professionnel}
                onChange={(e) => onUpdate({ titre_professionnel: e.target.value })}
                placeholder="Ex: Développeur Web Full Stack / Responsable Marketing"
                className="pl-9 rounded-xl focus-visible:ring-primary text-sm font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Le poste visé qui sera mis en valeur juste sous votre nom complet.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="resume" className="text-xs font-semibold text-foreground">
                Résumé de Carrière / Bio
              </Label>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAiSuggestSummary}
                disabled={isGeneratingBio}
                className="h-7 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg gap-1.5"
              >
                <Sparkles className={`h-3.5 w-3.5 text-primary ${isGeneratingBio ? 'animate-spin' : ''}`} />
                {isGeneratingBio ? 'Génération...' : 'Suggérer avec l\'IA'}
              </Button>
            </div>

            <Textarea
              id="resume"
              value={data.resume || ''}
              onChange={(e) => onUpdate({ resume: e.target.value })}
              placeholder="Décrivez brièvement vos points forts, vos accomplissements clés et ce que vous apportez à l'entreprise..."
              rows={4}
              className="rounded-xl focus-visible:ring-primary text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Conseil : 2 à 4 phrases percutantes pour capter l'attention.</span>
              <span>{(data.resume || '').length} / 500 caract.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
