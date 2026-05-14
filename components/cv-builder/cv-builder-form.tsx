'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Star,
  Loader2,
  AlertCircle,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Profile, PlanConfig, CV, CVDonnees } from '@/lib/types'

import { StepPersonalInfo } from './steps/step-personal-info'
import { StepFormation } from './steps/step-formation'
import { StepExperience } from './steps/step-experience'
import { StepCompetences } from './steps/step-competences'
import { StepPreview } from './steps/step-preview'

const steps = [
  { id: 'personal', title: 'Informations', icon: User },
  { id: 'formation', title: 'Formation', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'competences', title: 'Competences', icon: Star },
  { id: 'preview', title: 'Aperçu', icon: FileText },
]

interface CVBuilderFormProps {
  profile: Profile
  plan: PlanConfig
  existingCV: CV | null
  canCreate: boolean
  selectedTemplate: string
}

const defaultCVData: CVDonnees = {
  informations_personnelles: {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    linkedin: '',
  },
  titre_professionnel: '',
  resume: '',
  formations: [],
  experiences: [],
  competences: [],
  langues: [],
  certifications: [],
  centres_interet: [],
}

export function CVBuilderForm({ 
  profile, 
  plan, 
  existingCV, 
  canCreate,
  selectedTemplate 
}: CVBuilderFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(existingCV ? steps.length - 1 : 0)
  const [isSaving, setIsSaving] = useState(false)
  const [cvTitle, setCvTitle] = useState(existingCV?.titre || 'Mon CV')
  const [template, setTemplate] = useState(existingCV?.template || selectedTemplate)
  const [cvData, setCvData] = useState<CVDonnees>(
    existingCV?.donnees || {
      ...defaultCVData,
      informations_personnelles: {
        ...defaultCVData.informations_personnelles,
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email,
        telephone: profile.telephone || '',
        adresse: profile.adresse || '',
        linkedin: profile.linkedin || '',
      },
    }
  )

  const updateCVData = useCallback((updates: Partial<CVDonnees>) => {
    setCvData(prev => ({ ...prev, ...updates }))
  }, [])

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSave = async (redirect = false) => {
    setIsSaving(true)

    try {
      const supabase = createClient()
      
      if (existingCV) {
        // Update existing CV
        const { error } = await supabase
          .from('cvs')
          .update({
            titre: cvTitle,
            donnees: cvData,
            template,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingCV.id)

        if (error) throw error
        toast.success('CV mis a jour avec succes!')
      } else {
        // Create new CV
        const { error } = await supabase
          .from('cvs')
          .insert({
            user_id: profile.id,
            titre: cvTitle,
            donnees: cvData,
            template,
          })

        if (error) throw error

        // Update monthly counter
        await supabase
          .from('profiles')
          .update({
            cvs_generes_ce_mois: profile.cvs_generes_ce_mois + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id)

        toast.success('CV cree avec succes!')
      }

      if (redirect) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  if (!canCreate) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Limite atteinte</h1>
          <p className="mt-2 text-muted-foreground">
            Vous avez atteint la limite de CV pour ce mois avec le plan gratuit. 
            Passez au plan Pro pour creer des CV illimites.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild>
              <Link href="/tarifs">Voir les plans</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <input
                type="text"
                value={cvTitle}
                onChange={(e) => setCvTitle(e.target.value)}
                className="bg-transparent text-lg font-semibold text-foreground focus:outline-none"
                placeholder="Titre du CV"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="h-2" />
          <div className="mt-4 flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  index <= currentStep
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    index === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'border-primary bg-primary/10'
                      : 'border-muted'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="hidden text-xs font-medium sm:block">
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {currentStep === 0 && (
            <StepPersonalInfo
              data={cvData}
              onUpdate={updateCVData}
            />
          )}
          {currentStep === 1 && (
            <StepFormation
              data={cvData}
              onUpdate={updateCVData}
            />
          )}
          {currentStep === 2 && (
            <StepExperience
              data={cvData}
              onUpdate={updateCVData}
            />
          )}
          {currentStep === 3 && (
            <StepCompetences
              data={cvData}
              onUpdate={updateCVData}
            />
          )}
          {currentStep === 4 && (
            <StepPreview
              data={cvData}
              template={template}
              onTemplateChange={setTemplate}
              plan={plan}
            />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 border-t border-border bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Precedent
          </Button>

          <span className="text-sm text-muted-foreground">
            Etape {currentStep + 1} sur {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => handleSave(true)} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Terminer
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
