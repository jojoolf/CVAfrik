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
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import type { Profile, PlanConfig, CV, CVDonnees } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { renderCvTemplate } from './templates/cv-preview-collection'

import { StepPersonalInfo } from './steps/step-personal-info'
import { StepFormation } from './steps/step-formation'
import { StepExperience } from './steps/step-experience'
import { StepCompetences } from './steps/step-competences'
import { StepPreview } from './steps/step-preview'
import { ProfileImportDialog } from './profile-import-dialog'

const steps = [
  { id: 'personal', title: 'Informations', icon: User, description: 'Coordonnées & profil' },
  { id: 'formation', title: 'Formation', icon: GraduationCap, description: 'Parcours académique' },
  { id: 'experience', title: 'Expérience', icon: Briefcase, description: 'Parcours pro' },
  { id: 'competences', title: 'Compétences', icon: Star, description: 'Savoir-faire & langues' },
  { id: 'preview', title: 'Aperçu', icon: FileText, description: 'Style & Export' },
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
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [cvTitle, setCvTitle] = useState(existingCV?.titre || 'Mon CV Professionnel')
  const [template, setTemplate] = useState(existingCV?.template || selectedTemplate)
  const [showLivePreview, setShowLivePreview] = useState(true)
  const [previewZoom, setPreviewZoom] = useState<number>(0.65)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

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
        photo: profile.avatar_url || '',
      },
    }
  )

  const updateCVData = useCallback((updates: Partial<CVDonnees>) => {
    setCvData(prev => ({ ...prev, ...updates }))
  }, [])

  const applyImportedData = useCallback((data: CVDonnees) => {
    setCvData(data)
    const fullName = [data.informations_personnelles.prenom, data.informations_personnelles.nom].filter(Boolean).join(' ')
    if (fullName) setCvTitle(`CV de ${fullName}`)
    setCurrentStep(0)
    toast.success('Profil importé : vérifie les informations avant de générer ton CV.')
  }, [])

  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  const handleSave = async (redirect = false) => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: existingCV?.id ?? null,
          titre: cvTitle,
          donnees: cvData,
          template,
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        if (result.code === 'template_locked') {
          toast.error('Ce modèle est réservé au plan Pro.')
          router.push('/tarifs?locked=template')
          return
        }
        if (result.code === 'cv_limit') {
          toast.error('Votre limite mensuelle de CV est atteinte.')
          router.push('/tarifs?locked=cv')
          return
        }
        throw new Error(result.error || 'La sauvegarde a échoué.')
      }

      toast.success(existingCV ? 'CV mis à jour avec succès !' : 'CV créé avec succès !')
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-slate-900/5 to-primary/5 p-4">
        <div className="max-w-md text-center bg-card/80 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Limite mensuelle atteinte</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Vous avez atteint la limite de création de CV pour ce mois avec votre plan actuel. Passez au plan Pro pour débloquer la création illimitée et tous les modèles premium.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild className="rounded-xl shadow-lg shadow-primary/25 h-11">
              <Link href="/tarifs">Découvrir les Plans Pro</Link>
            </Button>
            <Button variant="ghost" asChild className="rounded-xl h-11">
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/5 dark:bg-slate-950 text-foreground selection:bg-primary/20">
      {/* Header Glassmorphic Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-muted/80">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </Link>
            </Button>

            <div className="h-5 w-px bg-border/60" />

            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={cvTitle}
                  autoFocus
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  onChange={(e) => setCvTitle(e.target.value)}
                  className="rounded-lg bg-muted px-2.5 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="group flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-muted/60 transition-colors text-left"
                >
                  <span className="max-w-[160px] truncate sm:max-w-[260px] text-sm sm:text-base font-bold text-foreground">
                    {cvTitle}
                  </span>
                  <Edit3 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!existingCV && (
              <div className="hidden sm:block">
                <ProfileImportDialog currentData={cvData} onApply={applyImportedData} />
              </div>
            )}
            {/* Status Indicator */}
            {lastSavedTime && (
              <span className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Enregistré à {lastSavedTime}
              </span>
            )}

            {/* Toggle Split Screen Preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLivePreview(prev => !prev)}
              className="hidden lg:flex items-center gap-2 rounded-xl border-border/80 bg-background/50 hover:bg-accent"
              title={showLivePreview ? "Masquer l'aperçu en direct" : "Afficher l'aperçu côte à côte"}
            >
              {showLivePreview ? (
                <>
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Masquer Aperçu</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-xs">Aperçu en Direct</span>
                </>
              )}
            </Button>

            {/* Save Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="rounded-xl shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 font-medium text-xs sm:text-sm px-4"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="border-t border-border/40 bg-card/40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5">
            <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pb-1 pt-0.5">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                        : isCompleted
                        ? 'bg-primary/10 text-primary hover:bg-primary/15'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg transition-transform ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground group-hover:scale-110'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="leading-tight">{step.title}</span>
                    </div>

                    {index < steps.length - 1 && (
                      <span className="ml-1 hidden xl:inline text-muted-foreground/40 font-normal">
                        ›
                      </span>
                    )}
                  </button>
                )
              })}

              <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground pl-2 border-l border-border/50">
                <Progress value={progress} className="w-20 h-2 bg-muted overflow-hidden rounded-full" />
                <span className="text-[11px] font-bold text-primary">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Split Screen Layout */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className={`grid gap-8 transition-all duration-300 ${
          showLivePreview && currentStep !== 4
            ? 'lg:grid-cols-12' 
            : 'max-w-4xl mx-auto'
        }`}>
          {/* Form Step Section */}
          <div className={`${
            showLivePreview && currentStep !== 4 
              ? 'lg:col-span-7 xl:col-span-7' 
              : 'w-full'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {currentStep === 0 && (
                  <StepPersonalInfo
                    data={cvData}
                    onUpdate={updateCVData}
                    plan={plan}
                    onImport={applyImportedData}
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side-by-Side Live A4 Preview Section (Desktop) */}
          {showLivePreview && currentStep !== 4 && (
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 relative">
              <div className="sticky top-28 space-y-3">
                {/* Preview header bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card/60 border border-border/80 backdrop-blur-md shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span>Aperçu en temps réel</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewZoom(z => Math.max(0.35, parseFloat((z - 0.05).toFixed(2))))}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Dézoomer"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-medium px-1 text-muted-foreground">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setPreviewZoom(z => Math.min(0.9, parseFloat((z + 0.05).toFixed(2))))}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Zoomer"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="ml-2 flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Maximize2 className="h-3 w-3" />
                      Grand écran
                    </button>
                  </div>
                </div>

                {/* A4 preview container — uses wrapper sizing to prevent cutoff */}
                <div className="rounded-2xl border border-border/80 bg-slate-900/5 dark:bg-slate-900/40 p-3 shadow-xl overflow-auto custom-scrollbar max-h-[calc(100vh-200px)] flex justify-center items-start">
                  {/* Outer wrapper shrinks to scaled dimensions → no overflow */}
                  <div
                    style={{
                      width: `${Math.round(794 * previewZoom)}px`,
                      height: `${Math.round(1123 * previewZoom)}px`,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 bg-white shadow-2xl overflow-hidden"
                      style={{
                        width: '794px',
                        minHeight: '1123px',
                        transform: `scale(${previewZoom})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      {renderCvTemplate(template, { data: cvData, showWatermark: plan.limites.filigrane })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Floating Navigation Toolbar */}
      <footer className="sticky bottom-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-xl border-border/80 px-4 h-10 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Étape {currentStep + 1}</span> sur {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={nextStep} 
              className="rounded-xl px-6 h-10 font-medium shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            >
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => handleSave(true)} 
              disabled={isSaving}
              className="rounded-xl px-6 h-10 font-medium shadow-lg shadow-primary/25 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Terminer & Enregistrer
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
