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
import { Plus, Trash2, GraduationCap, GripVertical, Calendar, Building, MapPin, Award } from 'lucide-react'
import type { CVDonnees, Formation } from '@/lib/types'

interface StepFormationProps {
  data: CVDonnees
  onUpdate: (updates: Partial<CVDonnees>) => void
}

const emptyFormation: Omit<Formation, 'id'> = {
  diplome: '',
  etablissement: '',
  ville: '',
  pays: '',
  date_debut: '',
  date_fin: '',
  en_cours: false,
  description: '',
}

function SortableFormationCard({ 
  formation, 
  index,
  updateFormation, 
  removeFormation 
}: { 
  formation: Formation; 
  index: number;
  updateFormation: (id: string, updates: Partial<Formation>) => void; 
  removeFormation: (id: string) => void 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: formation.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
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
                {formation.diplome || 'Nouvelle Formation / Diplôme'}
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                {formation.etablissement || 'Établissement non spécifié'}
              </CardDescription>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          onClick={() => removeFormation(formation.id)}
          title="Supprimer la formation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Diplôme / Titre de la Formation <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Award className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={formation.diplome}
                onChange={(e) => updateFormation(formation.id, { diplome: e.target.value })}
                placeholder="Ex: Licence en Génie Informatique"
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Établissement / École / Université <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={formation.etablissement}
                onChange={(e) => updateFormation(formation.id, { etablissement: e.target.value })}
                placeholder="Ex: Université Félix Houphouët-Boigny"
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
                value={formation.ville}
                onChange={(e) => updateFormation(formation.id, { ville: e.target.value })}
                placeholder="Ex: Abidjan"
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Pays</Label>
            <Input
              value={formation.pays}
              onChange={(e) => updateFormation(formation.id, { pays: e.target.value })}
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
                value={formation.date_debut}
                onChange={(e) => updateFormation(formation.id, { date_debut: e.target.value })}
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
                value={formation.date_fin}
                onChange={(e) => updateFormation(formation.id, { date_fin: e.target.value })}
                disabled={formation.en_cours}
                className="pl-9 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id={`en_cours_${formation.id}`}
            checked={formation.en_cours}
            onCheckedChange={(checked) => updateFormation(formation.id, { en_cours: checked as boolean })}
            className="rounded-md"
          />
          <Label htmlFor={`en_cours_${formation.id}`} className="text-xs font-medium cursor-pointer">
            Formation actuellement en cours
          </Label>
        </div>

        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold">Description ou Mentions (Optionnel)</Label>
          <Textarea
            value={formation.description || ''}
            onChange={(e) => updateFormation(formation.id, { description: e.target.value })}
            placeholder="Mention obtenue, spécialisation, projets de fin d'études notables..."
            rows={2}
            className="rounded-xl text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function StepFormation({ data, onUpdate }: StepFormationProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = data.formations.findIndex(f => f.id === active.id)
    const newIndex = data.formations.findIndex(f => f.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newFormations = [...data.formations]
    newFormations.splice(newIndex, 0, newFormations.splice(oldIndex, 1)[0])
    onUpdate({ formations: newFormations })
  }, [data.formations, onUpdate])

  const addFormation = () => {
    const newFormation: Formation = {
      ...emptyFormation,
      id: crypto.randomUUID(),
    }
    onUpdate({ formations: [...data.formations, newFormation] })
  }

  const updateFormation = (id: string, updates: Partial<Formation>) => {
    onUpdate({ formations: data.formations.map(f => f.id === id ? { ...f, ...updates } : f) })
  }

  const removeFormation = (id: string) => {
    onUpdate({ formations: data.formations.filter(f => f.id !== id) })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Formations & Diplômes</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Valorisez votre parcours académique. Utilisez la poignée à gauche pour réordonner vos diplômes.
        </p>
      </div>

      {data.formations.length === 0 ? (
        <Card className="border-2 border-dashed border-border/80 bg-card/40 rounded-2xl p-8 text-center shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Aucune formation ajoutée</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Ajoutez vos diplômes, études universitaires ou certifications.
            </p>
            <Button className="mt-6 rounded-xl font-medium shadow-md shadow-primary/20" onClick={addFormation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Première Formation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.formations.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {data.formations.map((formation, index) => (
                <SortableFormationCard
                  key={formation.id}
                  formation={formation}
                  index={index}
                  updateFormation={updateFormation}
                  removeFormation={removeFormation}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button 
            variant="outline" 
            className="w-full py-6 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all"
            onClick={addFormation}
          >
            <Plus className="mr-2 h-4 w-4 text-primary" />
            Ajouter une Autre Formation
          </Button>
        </div>
      )}
    </div>
  )
}
