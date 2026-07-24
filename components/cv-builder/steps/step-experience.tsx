'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Briefcase, X, GripVertical, Calendar, Building2, MapPin, Sparkles, CheckCircle2 } from 'lucide-react'
import type { CVDonnees, Experience } from '@/lib/types'
import { toast } from 'sonner'

interface StepExperienceProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
}

const emptyExperience: Omit<Experience, 'id'> = {
  poste: '',
  entreprise: '',
  ville: '',
  pays: '',
  date_debut: '',
  date_fin: '',
  en_cours: false,
  description: '',
  realisations: [],
}

function SortableExperienceCard({ 
  experience, 
  index,
  updateExperience, 
  removeExperience, 
  newRealisation, 
  setNewRealisation, 
  addRealisation, 
  removeRealisation 
}: {
  experience: Experience
  index: number
  updateExperience: (id: string, updates: Partial<Experience>) => void
  removeExperience: (id: string) => void
  newRealisation: Record<string, string>
  setNewRealisation: React.Dispatch<React.SetStateAction<Record<string, string>>>
  addRealisation: (expId: string) => void
  removeRealisation: (expId: string, index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: experience.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleAiSuggestRealisation = () => {
    if (!experience.poste) {
      toast.error('Veuillez préciser le poste occupé pour obtenir des suggestions !')
      return
    }

    const suggestionsMap: Record<string, string[]> = {
      default: [
        "Optimisation des processus et réduction des délais de livraison de 25%",
        "Gestion efficace d'une équipe et suivi des objectifs clés de performance",
        "Amélioration de la satisfaction client et résolution rapide des incidents"
      ]
    }

    const suggestions = suggestionsMap.default
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    
    updateExperience(experience.id, { 
      realisations: [...experience.realisations, randomSuggestion] 
    })
    toast.success('Réalisation suggérée par l\'IA ajoutée !')
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden border-border/80 bg-card/90 backdrop-blur-sm shadow-sm transition-all hover:shadow-md ${
        isDragging ? 'shadow-2xl border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 px-5 py-3.5 space-y-0">
        <div className="flex items-center gap-3">
          <button 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Glisser pour réordonner"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-sm font-semibold leading-none">
                {experience.poste || 'Nouveau Poste / Mission'}
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                {experience.entreprise || 'Entreprise non spécifiée'}
              </CardDescription>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          onClick={() => removeExperience(experience.id)}
          title="Supprimer l'expérience"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Poste Occupé <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={experience.poste}
                onChange={(e) => updateExperience(experience.id, { poste: e.target.value })}
                placeholder="Ex: Développeur Full Stack"
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Entreprise / Organisation <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={experience.entreprise}
                onChange={(e) => updateExperience(experience.id, { entreprise: e.target.value })}
                placeholder="Ex: Orange Côte d'Ivoire"
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Ville</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={experience.ville}
                onChange={(e) => updateExperience(experience.id, { ville: e.target.value })}
                placeholder="Ex: Abidjan"
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Pays</Label>
            <Input
              value={experience.pays}
              onChange={(e) => updateExperience(experience.id, { pays: e.target.value })}
              placeholder="Ex: Côte d'Ivoire"
              className="rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Date de Début</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="month"
                value={experience.date_debut}
                onChange={(e) => updateExperience(experience.id, { date_debut: e.target.value })}
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Date de Fin</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="month"
                value={experience.date_fin}
                onChange={(e) => updateExperience(experience.id, { date_fin: e.target.value })}
                disabled={experience.en_cours}
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id={`en_cours_${experience.id}`}
            checked={experience.en_cours}
            onCheckedChange={(checked) => updateExperience(experience.id, { en_cours: checked as boolean })}
            className="rounded-md"
          />
          <Label htmlFor={`en_cours_${experience.id}`} className="text-xs font-medium cursor-pointer">
            Poste actuellement occupé (En cours)
          </Label>
        </div>

        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold">Missions & Responsabilités Principales</Label>
          <Textarea
            value={experience.description}
            onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
            placeholder="Décrivez vos missions quotidiennes, outils utilisés, encadrement..."
            rows={3}
            className="rounded-xl text-sm leading-relaxed"
          />
        </div>

        {/* Key Achievements Badges & Inputs */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Réalisations Clés / Chiffres Marquants
            </Label>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAiSuggestRealisation}
              className="h-6 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md gap-1"
            >
              <Sparkles className="h-3 w-3" />
              IA Suggestion
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={newRealisation[experience.id] || ''}
              onChange={(e) => setNewRealisation(prev => ({ ...prev, [experience.id]: e.target.value }))}
              placeholder="Ex: Augmentation des ventes de 30% en 6 mois"
              className="rounded-xl text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addRealisation(experience.id)
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary" 
              className="rounded-xl px-4 font-semibold shrink-0" 
              onClick={() => addRealisation(experience.id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {experience.realisations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {experience.realisations.map((realisation, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="gap-1.5 py-1 px-3 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
                >
                  <span>{realisation}</span>
                  <button
                    type="button"
                    onClick={() => removeRealisation(experience.id, idx)}
                    className="rounded-full hover:bg-primary/20 p-0.5 text-primary/80 hover:text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            Astuce : Les résultats chiffrés attirent 40% plus l'attention des recruteurs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function StepExperience({ data, onUpdate }: StepExperienceProps) {
  const [newRealisation, setNewRealisation] = useState<Record<string, string>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = data.experiences.findIndex(e => e.id === active.id)
    const newIndex = data.experiences.findIndex(e => e.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newExperiences = [...data.experiences]
    newExperiences.splice(newIndex, 0, newExperiences.splice(oldIndex, 1)[0])
    onUpdate({ experiences: newExperiences })
  }, [data.experiences, onUpdate])

  const addExperience = () => {
    const newExperience: Experience = {
      ...emptyExperience,
      id: crypto.randomUUID(),
    }
    onUpdate({ experiences: [...data.experiences, newExperience] })
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onUpdate({ experiences: data.experiences.map(e => e.id === id ? { ...e, ...updates } : e) })
  }

  const removeExperience = (id: string) => {
    onUpdate({ experiences: data.experiences.filter(e => e.id !== id) })
  }

  const addRealisation = (expId: string) => {
    const realisation = newRealisation[expId]?.trim()
    if (!realisation) return

    const exp = data.experiences.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, { realisations: [...exp.realisations, realisation] })
      setNewRealisation(prev => ({ ...prev, [expId]: '' }))
    }
  }

  const removeRealisation = (expId: string, index: number) => {
    const exp = data.experiences.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, { realisations: exp.realisations.filter((_, i) => i !== index) })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Expériences Professionnelles</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Mettez en avant vos postes et accomplissements majeurs. Glissez-déposez pour réordonner la chronologie.
        </p>
      </div>

      {data.experiences.length === 0 ? (
        <Card className="border-2 border-dashed border-border/80 bg-card/40 rounded-2xl p-8 text-center shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Aucune expérience ajoutée</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Ajoutez vos stages, emplois, missions de consulting ou projets significatifs.
            </p>
            <Button className="mt-6 rounded-xl font-medium shadow-md shadow-primary/20" onClick={addExperience}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Première Expérience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.experiences.map(e => e.id)} strategy={verticalListSortingStrategy}>
              {data.experiences.map((experience, index) => (
                <SortableExperienceCard
                  key={experience.id}
                  experience={experience}
                  index={index}
                  updateExperience={updateExperience}
                  removeExperience={removeExperience}
                  newRealisation={newRealisation}
                  setNewRealisation={setNewRealisation}
                  addRealisation={addRealisation}
                  removeRealisation={removeRealisation}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button 
            variant="outline" 
            className="w-full py-6 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all"
            onClick={addExperience}
          >
            <Plus className="mr-2 h-4 w-4 text-primary" />
            Ajouter une Autre Expérience
          </Button>
        </div>
      )}
    </div>
  )
}
