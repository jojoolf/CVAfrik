'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
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

export function StepFormation({ data, onUpdate }: StepFormationProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addFormation = () => {
    const newFormation: Formation = {
      ...emptyFormation,
      id: crypto.randomUUID(),
    }
    onUpdate({
      formations: [...data.formations, newFormation],
    })
    setEditingId(newFormation.id)
  }

  const updateFormation = (id: string, updates: Partial<Formation>) => {
    onUpdate({
      formations: data.formations.map(f =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })
  }

  const removeFormation = (id: string) => {
    onUpdate({
      formations: data.formations.filter(f => f.id !== id),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Formation</h2>
        <p className="mt-2 text-muted-foreground">
          Ajoutez vos diplomes et formations
        </p>
      </div>

      {data.formations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-center text-muted-foreground">
              Aucune formation ajoutee
            </p>
            <Button className="mt-4" onClick={addFormation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une formation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.formations.map((formation) => (
            <Card key={formation.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">
                    {formation.diplome || 'Nouvelle formation'}
                  </CardTitle>
                  <CardDescription>
                    {formation.etablissement || 'Etablissement non specifie'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeFormation(formation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Diplome / Formation *</Label>
                  <Input
                    value={formation.diplome}
                    onChange={(e) => updateFormation(formation.id, { diplome: e.target.value })}
                    placeholder="Ex: Licence en Informatique"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Etablissement *</Label>
                  <Input
                    value={formation.etablissement}
                    onChange={(e) => updateFormation(formation.id, { etablissement: e.target.value })}
                    placeholder="Ex: Universite Felix Houphouet-Boigny"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      value={formation.ville}
                      onChange={(e) => updateFormation(formation.id, { ville: e.target.value })}
                      placeholder="Ex: Abidjan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input
                      value={formation.pays}
                      onChange={(e) => updateFormation(formation.id, { pays: e.target.value })}
                      placeholder="Ex: Cote d'Ivoire"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date de debut</Label>
                    <Input
                      type="month"
                      value={formation.date_debut}
                      onChange={(e) => updateFormation(formation.id, { date_debut: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Input
                      type="month"
                      value={formation.date_fin}
                      onChange={(e) => updateFormation(formation.id, { date_fin: e.target.value })}
                      disabled={formation.en_cours}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`en_cours_${formation.id}`}
                    checked={formation.en_cours}
                    onCheckedChange={(checked) => 
                      updateFormation(formation.id, { en_cours: checked as boolean })
                    }
                  />
                  <Label htmlFor={`en_cours_${formation.id}`} className="text-sm">
                    Formation en cours
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    value={formation.description || ''}
                    onChange={(e) => updateFormation(formation.id, { description: e.target.value })}
                    placeholder="Mention, specialisation, projets notables..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={addFormation}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une autre formation
          </Button>
        </div>
      )}
    </div>
  )
}
