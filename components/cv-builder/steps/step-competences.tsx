'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Star, Languages, X, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CVDonnees, Competence, Langue } from '@/lib/types'

interface StepCompetencesProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
}

const niveauxCompetence = [
  { value: 'debutant', label: 'Debutant' },
  { value: 'intermediaire', label: 'Intermediaire' },
  { value: 'avance', label: 'Avance' },
  { value: 'expert', label: 'Expert' },
]

const categoriesCompetence = [
  { value: 'technique', label: 'Technique' },
  { value: 'soft_skill', label: 'Soft Skill' },
  { value: 'autre', label: 'Autre' },
]

const niveauxLangue = [
  { value: 'debutant', label: 'Debutant (A1-A2)' },
  { value: 'intermediaire', label: 'Intermediaire (B1-B2)' },
  { value: 'courant', label: 'Courant (C1)' },
  { value: 'bilingue', label: 'Bilingue (C2)' },
  { value: 'natif', label: 'Langue maternelle' },
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

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'expert':
      case 'bilingue':
      case 'natif':
        return 'bg-green-100 text-green-800'
      case 'avance':
      case 'courant':
        return 'bg-blue-100 text-blue-800'
      case 'intermediaire':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Competences et langues</h2>
        <p className="mt-2 text-muted-foreground">
          Mettez en avant vos competences cles
        </p>
      </div>

      {/* Competences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-primary" />
            Competences
          </CardTitle>
          <CardDescription>Ajoutez vos competences techniques et soft skills</CardDescription>
          {data.informations_personnelles?.titre_professionnel && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
              onClick={async () => {
                setSuggesting(true)
                try {
                  const res = await fetch('/api/cv/suggest-skills', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobTitle: data.informations_personnelles.titre_professionnel }),
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
                      toast.success(`${newSkills.length} competences suggerees ajoutees !`)
                    } else {
                      toast('Toutes les competences suggerees sont deja dans votre liste')
                    }
                  }
                } catch {
                  toast.error('Erreur lors de la suggestion')
                }
                setSuggesting(false)
              }}
              disabled={suggesting}
            >
              {suggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {suggesting ? 'Analyse...' : `Suggérer pour ${data.informations_personnelles.titre_professionnel}`}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label>Competence</Label>
              <Input
                value={newCompetence.nom}
                onChange={(e) => setNewCompetence(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: JavaScript"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCompetence()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select
                value={newCompetence.niveau}
                onValueChange={(v) => setNewCompetence(prev => ({ ...prev, niveau: v as Competence['niveau'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {niveauxCompetence.map(n => (
                    <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label>Categorie</Label>
                <Select
                  value={newCompetence.categorie}
                  onValueChange={(v) => setNewCompetence(prev => ({ ...prev, categorie: v as Competence['categorie'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesCompetence.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCompetence} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {data.competences.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.competences.map((competence) => (
                <Badge
                  key={competence.id}
                  variant="secondary"
                  className={`gap-1 ${getNiveauColor(competence.niveau)}`}
                >
                  {competence.nom}
                  <span className="text-xs opacity-70">({niveauxCompetence.find(n => n.value === competence.niveau)?.label})</span>
                  <button
                    type="button"
                    onClick={() => removeCompetence(competence.id)}
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

      {/* Langues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="h-5 w-5 text-primary" />
            Langues
          </CardTitle>
          <CardDescription>Indiquez les langues que vous maitrisez</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Input
                value={newLangue.nom}
                onChange={(e) => setNewLangue(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: Français"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addLangue()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select
                value={newLangue.niveau}
                onValueChange={(v) => setNewLangue(prev => ({ ...prev, niveau: v as Langue['niveau'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {niveauxLangue.map(n => (
                    <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addLangue} size="icon">
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
                  className={`gap-1 ${getNiveauColor(langue.niveau)}`}
                >
                  {langue.nom}
                  <span className="text-xs opacity-70">({niveauxLangue.find(n => n.value === langue.niveau)?.label})</span>
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

      {/* Centres d'interet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Centres d&apos;interet (optionnel)</CardTitle>
          <CardDescription>Ajoutez vos hobbies et passions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInteret}
              onChange={(e) => setNewInteret(e.target.value)}
              placeholder="Ex: Lecture, Sport, Musique..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addInteret()
                }
              }}
            />
            <Button onClick={addInteret} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {(data.centres_interet || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {(data.centres_interet || []).map((interet, index) => (
                <Badge key={index} variant="outline" className="gap-1">
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
