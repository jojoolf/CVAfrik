'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Loader2, Sparkles, ChevronRight, ChevronLeft, Briefcase, Brain, Target, Compass } from 'lucide-react'
import { SECTORS, INTERVIEW_TYPES } from '@/lib/types'
import { toast } from 'sonner'

interface CVOption {
  id: string
  titre: string | null
}

interface InterviewSetupProps {
  cvs: CVOption[]
  loading: boolean
  onStart: (data: {
    cvId: string
    poste: string
    sector: 'finance' | 'tech' | 'marketing' | 'hr' | 'sales' | 'other'
    interviewType: 'behavioral' | 'technical' | 'mixed' | 'case_study'
    nombreQuestions: number
  }) => void
}

export function InterviewSetup({ cvs, loading, onStart }: InterviewSetupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cvId, setCvId] = useState<string>(cvs.length > 0 ? cvs[0].id : '')
  const [poste, setPoste] = useState<string>('')
  const [sector, setSector] = useState<'finance' | 'tech' | 'marketing' | 'hr' | 'sales' | 'other'>('tech')
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed' | 'case_study'>('mixed')
  const [nombreQuestions, setNombreQuestions] = useState<number>(5)

  const handleNext = () => {
    if (step === 1) {
      if (!poste.trim()) {
        toast.error('Veuillez indiquer le poste visé.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart({
      cvId,
      poste,
      sector,
      interviewType,
      nombreQuestions,
    })
  }

  return (
    <Card className="border-violet-500/20 shadow-xl overflow-hidden bg-background">
      <CardHeader className="bg-gradient-to-r from-violet-500/5 via-primary/5 to-transparent border-b py-5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Configuration de l&apos;Entretien v2
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Personnalisez votre simulateur IA selon vos objectifs.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-full text-xs font-semibold text-muted-foreground">
            <span>Étape {step} sur 3</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-violet-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Base info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4.5 w-4.5 text-violet-500" />
                  Sélectionnez votre CV de référence
                </Label>
                <Select value={cvId} onValueChange={setCvId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Choisir un CV" />
                  </SelectTrigger>
                  <SelectContent>
                    {cvs.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.titre || 'Mon CV sans titre'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Le coach IA analysera votre parcours pour orienter ses questions.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-4.5 w-4.5 text-violet-500" />
                  Quel poste visez-vous ?
                </Label>
                <Input
                  className="h-11 rounded-xl"
                  placeholder="Ex: Chef de projet, Développeur Full-Stack, Auditeur..."
                  value={poste}
                  onChange={(e) => setPoste(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Sector selection */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Compass className="h-4.5 w-4.5 text-violet-500" />
                Sélectionnez le secteur d&apos;activité
              </Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SECTORS.map((sec) => {
                  const isSelected = sector === sec.id
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSector(sec.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-violet-600 bg-violet-600/5 text-violet-700 dark:text-violet-300 ring-2 ring-violet-600/20 font-bold shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/10'
                      }`}
                    >
                      <span className="text-2xl mb-2">{sec.icon}</span>
                      <span className="text-xs">{sec.nom}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Interview type & questions */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Brain className="h-4.5 w-4.5 text-violet-500" />
                  Type d&apos;entretien
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTERVIEW_TYPES.map((type) => {
                    const isSelected = interviewType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInterviewType(type.id as any)}
                        className={`flex gap-3 items-start p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-violet-600 bg-violet-600/5 text-violet-700 dark:text-violet-300 ring-2 ring-violet-600/20 font-medium'
                            : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/10'
                        }`}
                      >
                        <span className="text-xl shrink-0 p-1 bg-muted rounded-lg">{type.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{type.nom}</p>
                          <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{type.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Nombre de questions</Label>
                  <span className="text-sm font-bold text-violet-600 bg-violet-600/10 px-2 py-0.5 rounded">
                    {nombreQuestions} questions
                  </span>
                </div>
                <Slider
                  min={3}
                  max={15}
                  step={1}
                  value={[nombreQuestions]}
                  onValueChange={(val) => setNombreQuestions(val[0])}
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Une simulation plus longue (5-10 questions) permet un feedback sectoriel et comportemental approfondi.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="h-11 px-5 rounded-xl border-border/80"
                onClick={handleBack}
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Retour
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl"
                onClick={handleNext}
              >
                Suivant
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-grow h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Démarrer la simulation
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
