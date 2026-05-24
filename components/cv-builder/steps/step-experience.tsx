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
import { Plus, Trash2, Briefcase, X, GripVertical } from 'lucide-react'
import type { CVDonnees, Experience } from '@/lib/types'

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

function SortableExperienceCard({ experience, updateExperience, removeExperience, newRealisation, setNewRealisation, addRealisation, removeRealisation }: {
  experience: Experience
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

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : ''}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab touch-none p-1 hover:text-primary transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <div>
            <CardTitle className="text-base">
              {experience.poste || 'Nouveau poste'}
            </CardTitle>
            <CardDescription>
              {experience.entreprise || 'Entreprise non specifiee'}
            </CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeExperience(experience.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Poste occupe *</Label>
            <Input value={experience.poste} onChange={(e) => updateExperience(experience.id, { poste: e.target.value })} placeholder="Ex: Developpeur Full Stack" />
          </div>
          <div className="space-y-2">
            <Label>Entreprise *</Label>
            <Input value={experience.entreprise} onChange={(e) => updateExperience(experience.id, { entreprise: e.target.value })} placeholder="Ex: Orange Cote d'Ivoire" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ville</Label>
            <Input value={experience.ville} onChange={(e) => updateExperience(experience.id, { ville: e.target.value })} placeholder="Ex: Abidjan" />
          </div>
          <div className="space-y-2">
            <Label>Pays</Label>
            <Input value={experience.pays} onChange={(e) => updateExperience(experience.id, { pays: e.target.value })} placeholder="Ex: Cote d'Ivoire" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date de debut</Label>
            <Input type="month" value={experience.date_debut} onChange={(e) => updateExperience(experience.id, { date_debut: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Date de fin</Label>
            <Input type="month" value={experience.date_fin} onChange={(e) => updateExperience(experience.id, { date_fin: e.target.value })} disabled={experience.en_cours} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id={`en_cours_${experience.id}`} checked={experience.en_cours} onCheckedChange={(checked) => updateExperience(experience.id, { en_cours: checked as boolean })} />
          <Label htmlFor={`en_cours_${experience.id}`} className="text-sm">Poste actuel</Label>
        </div>
        <div className="space-y-2">
          <Label>Description du poste</Label>
          <Textarea value={experience.description} onChange={(e) => updateExperience(experience.id, { description: e.target.value })} placeholder="Decrivez vos responsabilites principales..." rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Realisations cles</Label>
          <div className="flex gap-2">
            <Input value={newRealisation[experience.id] || ''} onChange={(e) => setNewRealisation(prev => ({ ...prev, [experience.id]: e.target.value }))} placeholder="Ex: Augmentation des ventes de 30%" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRealisation(experience.id) }}} />
            <Button type="button" variant="outline" onClick={() => addRealisation(experience.id)}><Plus className="h-4 w-4" /></Button>
          </div>
          {experience.realisations.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {experience.realisations.map((realisation, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {realisation}
                  <button type="button" onClick={() => removeRealisation(experience.id, index)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Ajoutez des resultats concrets et mesurables</p>
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
    const newExperience: Experience = { ...emptyExperience, id: crypto.randomUUID() }
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
    if (exp) updateExperience(expId, { realisations: exp.realisations.filter((_, i) => i !== index) })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Experience professionnelle</h2>
        <p className="mt-2 text-muted-foreground">Decrivez vos experiences. Glissez-deposez pour reordonner.</p>
      </div>

      {data.experiences.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-center text-muted-foreground">Aucune experience ajoutee</p>
            <Button className="mt-4" onClick={addExperience}><Plus className="mr-2 h-4 w-4" /> Ajouter une experience</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.experiences.map(e => e.id)} strategy={verticalListSortingStrategy}>
              {data.experiences.map((experience) => (
                <SortableExperienceCard key={experience.id} experience={experience} updateExperience={updateExperience} removeExperience={removeExperience} newRealisation={newRealisation} setNewRealisation={setNewRealisation} addRealisation={addRealisation} removeRealisation={removeRealisation} />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="outline" className="w-full" onClick={addExperience}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une autre experience
          </Button>
        </div>
      )}
    </div>
  )
}
