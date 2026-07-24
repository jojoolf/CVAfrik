'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Star, Languages, X, Sparkles, Loader2, Heart, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CVDonnees, Competence, Langue } from '@/lib/types'

interface StepCompetencesProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
}

const niveauxCompetence = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
]

const categoriesCompetence = [
  { value: 'technique', label: 'Compétence Technique' },
  { value: 'soft_skill', label: 'Soft Skill / Humain' },
  { value: 'autre', label: 'Autre' },
]

const niveauxLangue = [
  { value: 'debutant', label: 'Débutant (A1-A2)' },
  { value: 'intermediaire', label: 'Intermédiaire (B1-B2)' },
  { value: 'courant', label: 'Courant (C1)' },
  { value: 'bilingue', label: 'Bilingue (C2)' },
  { value: 'natif', label: 'Langue maternelle' },
]

const popularSoftSkills = [
  "Esprit d'équipe",
  "Gestion du stress",
  "Communication claire",
  "Résolution de problèmes",
  "Adaptabilité",
  "Leadership",
  "Rigueur & Organisation"
]

export function StepCompetences({ data, onUpdate }: StepCompetencesProps) {
  const [newCompetence, setNewCompetence] = useState({ nom: '', niveau: 'intermediaire' as Competence['niveau'], categorie: 'technique' as Competence['categorie'] })
  const [suggesting, setSuggesting] = useState(false)
  const [newLangue, setNewLangue] = useState({ nom: '', niveau: 'intermediaire' as Langue['niveau'] })
  const [newInteret, setNewInteret] = useState('')

  const addCompetence = () => {
    if (!newCompetence.nom.trim()) return
    
    const competence: Competence = {
      id: crypto.randomUUID(),
      nom: newCompetence.nom.trim(),
      niveau: newCompetence.niveau,
      categorie: newCompetence.categorie,
    }
    onUpdate({
      competences: [...data.competences, competence],
    })
    setNewCompetence({ nom: '', niveau: 'intermediaire', categorie: 'technique' })
  }

  const addQuickSkill = (skillName: string, categorie: Competence['categorie'] = 'soft_skill') => {
    if (data.competences.some(c => c.nom.toLowerCase() === skillName.toLowerCase())) {
      toast.info(`"${skillName}" est déjà dans votre liste.`)
      return
    }

    const competence: Competence = {
      id: crypto.randomUUID(),
      nom: skillName,
      niveau: 'avance',
      categorie,
    }
    onUpdate({
      competences: [...data.competences, competence],
    })
    toast.success(`"${skillName}" ajouté !`)
  }

  const removeCompetence = (id: string) => {
    onUpdate({
      competences: data.competences.filter(c => c.id !== id),
    })
  }

  const addLangue = () => {
    if (!newLangue.nom.trim()) return
    
    const langue: Langue = {
      id: crypto.randomUUID(),
      nom: newLangue.nom.trim(),
      niveau: newLangue.niveau,
    }
    onUpdate({
      langues: [...data.langues, langue],
    })
    setNewLangue({ nom: '', niveau: 'intermediaire' })
  }

  const removeLangue = (id: string) => {
    onUpdate({
      langues: data.langues.filter(l => l.id !== id),
    })
  }

  const addInteret = () => {
    if (!newInteret.trim()) return
    
    onUpdate({
      centres_interet: [...(data.centres_interet || []), newInteret.trim()],
    })
    setNewInteret('')
  }

  const removeInteret = (index: number) => {
    onUpdate({
      centres_interet: (data.centres_interet || []).filter((_, i) => i !== index),
    })
  }

  const getNiveauBadgeStyle = (niveau: string) => {
    switch (niveau) {
      case 'expert':
      case 'bilingue':
      case 'natif':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      case 'avance':
      case 'courant':
        return 'bg-primary/10 text-primary border-primary/30'
      case 'intermediaire':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Compétences & Langues</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Mettez en valeur vos savoir-faire techniques, vos qualités relationnelles et vos langues maîtrisées.
        </p>
      </div>

      {/* Card 1: Compétences */}
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Compétences Clés</CardTitle>
                <CardDescription className="text-xs">Savoir-faire techniques & Soft Skills</CardDescription>
              </div>
            </div>

            {data.titre_professionnel && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 rounded-xl gap-1.5"
                onClick={async () => {
                  setSuggesting(true)
                  try {
                    const res = await fetch('/api/cv/suggest-skills', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ jobTitle: data.titre_professionnel }),
                    })
                    const result = await res.json()
                    if (result.success && result.competences?.length) {
                      const newSkills = result.competences.filter((s: string) => !data.competences.some(c => c.nom.toLowerCase() === s.toLowerCase()))
                      if (newSkills.length > 0) {
                        onUpdate({
                          competences: [
                            ...data.competences,
                            ...newSkills.map((nom: string) => ({
                              id: crypto.randomUUID(),
                              nom,
                              niveau: 'intermediaire' as Competence['niveau'],
                              categorie: 'technique' as Competence['categorie'],
                            })),
                          ],
                        })
                        toast.success(`${newSkills.length} compétences suggérées ajoutées !`)
                      } else {
                        toast.info('Toutes les compétences suggérées sont déjà dans votre liste.')
                      }
                    }
                  } catch {
                    toast.error('Erreur lors de la suggestion')
                  }
                  setSuggesting(false)
                }}
                disabled={suggesting}
              >
                {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {suggesting ? 'Analyse...' : `Suggérer pour ${data.titre_professionnel}`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="space-y-1.5 sm:col-span-5">
              <Label className="text-xs font-semibold">Nom de la compétence</Label>
              <Input
                value={newCompetence.nom}
                onChange={(e) => setNewCompetence(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: Management, Excel, React..."
                className="rounded-xl text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCompetence()
                  }
                }}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-xs font-semibold">Niveau</Label>
              <Select
                value={newCompetence.niveau}
                onValueChange={(v) => setNewCompetence(prev => ({ ...prev, niveau: v as Competence['niveau'] }))}
              >
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {niveauxCompetence.map(n => (
                    <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-4 flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs font-semibold">Catégorie</Label>
                <Select
                  value={newCompetence.categorie}
                  onValueChange={(v) => setNewCompetence(prev => ({ ...prev, categorie: v as Competence['categorie'] }))}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesCompetence.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addCompetence} size="icon" className="rounded-xl shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick-add Soft Skills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Ajout rapide Soft Skills populaires :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSoftSkills.map((skill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addQuickSkill(skill, 'soft_skill')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/15 hover:text-primary transition-colors border border-border/50"
                >
                  <Plus className="h-2.5 w-2.5" />
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills List */}
          {data.competences.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/40">
              <Label className="text-xs font-semibold text-foreground">Compétences enregistrées ({data.competences.length})</Label>
              <div className="flex flex-wrap gap-2">
                {data.competences.map((competence) => (
                  <Badge
                    key={competence.id}
                    variant="secondary"
                    className={`gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-semibold shadow-2xs ${getNiveauBadgeStyle(competence.niveau)}`}
                  >
                    <span>{competence.nom}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      ({niveauxCompetence.find(n => n.value === competence.niveau)?.label})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCompetence(competence.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
                      title="Supprimer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Langues */}
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Languages className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Langues Pratiquées</CardTitle>
              <CardDescription className="text-xs">Indiquez votre niveau de maîtrise pour chaque langue</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="space-y-1.5 sm:col-span-6">
              <Label className="text-xs font-semibold">Langue</Label>
              <Input
                value={newLangue.nom}
                onChange={(e) => setNewLangue(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: Français, Anglais, Espagnol..."
                className="rounded-xl text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addLangue()
                  }
                }}
              />
            </div>
            
            <div className="space-y-1.5 sm:col-span-6 flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs font-semibold">Niveau de maîtrise</Label>
                <Select
                  value={newLangue.niveau}
                  onValueChange={(v) => setNewLangue(prev => ({ ...prev, niveau: v as Langue['niveau'] }))}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {niveauxLangue.map(n => (
                      <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addLangue} size="icon" className="rounded-xl shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {data.langues.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.langues.map((langue) => (
                <Badge
                  key={langue.id}
                  variant="secondary"
                  className={`gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-semibold ${getNiveauBadgeStyle(langue.niveau)}`}
                >
                  <span>{langue.nom}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    ({niveauxLangue.find(n => n.value === langue.niveau)?.label})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLangue(langue.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 3: Centres d'intérêt */}
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Centres d'Intérêt & Passions (Optionnel)</CardTitle>
              <CardDescription className="text-xs">Hobbies et activités personnelles pour humaniser votre candidature</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInteret}
              onChange={(e) => setNewInteret(e.target.value)}
              placeholder="Ex: Photographie, Échecs, Basket-ball, Voyages..."
              className="rounded-xl text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addInteret()
                }
              }}
            />
            <Button onClick={addInteret} size="icon" variant="outline" className="rounded-xl shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {(data.centres_interet || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {(data.centres_interet || []).map((interet, index) => (
                <Badge key={index} variant="outline" className="gap-1.5 py-1 px-3 rounded-xl border-border/80 text-xs font-medium bg-muted/30">
                  {interet}
                  <button
                    type="button"
                    onClick={() => removeInteret(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
