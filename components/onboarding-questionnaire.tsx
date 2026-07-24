'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Globe, 
  Share2,
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2, 
  X 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingQuestionnaireProps {
  userId?: string
  initialCompleted?: boolean
  initialNom?: string | null
  initialPrenom?: string | null
}

const STATUTS = [
  'Étudiant / Jeune Diplômé',
  'En recherche d\'emploi',
  'En poste (Souhaite évoluer)',
  'Reconversion professionnelle',
  'Autre',
]

const SECTEURS = [
  'Informatique / Tech / Digital',
  'Banque / Finance / Comptabilité',
  'Commerce / Vente / Marketing',
  'Santé / Médical / Pharmacie',
  'Ingénierie / BTP / Industrie',
  'Enseignement / Formation',
  'Autre',
]

const OBJECTIFS = [
  'Créer un CV professionnel moderne',
  'Rédiger une lettre de motivation IA',
  'Préparer mes prochains entretiens',
  'Trouver un stage ou un emploi rapidement',
  'Autre',
]

const SOURCES = [
  'LinkedIn',
  'IA (ChatGPT, Claude, Gemini...)',
  'Recherche Google',
  'Ami / Recommandation d\'un proche',
  'Réseaux sociaux (TikTok, Facebook, Insta)',
  'Autre',
]

const PAYS_LIST = [
  'Côte d\'Ivoire',
  'Sénégal',
  'Cameroun',
  'Bénin',
  'Togo',
  'Mali',
  'Burkina Faso',
  'RD Congo',
  'Autre',
]

export function OnboardingQuestionnaire({ 
  userId, 
  initialCompleted,
  initialNom,
  initialPrenom,
}: OnboardingQuestionnaireProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [prenom, setPrenom] = useState(initialPrenom || '')
  const [nom, setNom] = useState(initialNom || '')

  const [statut, setStatut] = useState('')
  const [customStatut, setCustomStatut] = useState('')

  const [secteur, setSecteur] = useState('')
  const [customSecteur, setCustomSecteur] = useState('')

  const [objectif, setObjectif] = useState('')
  const [customObjectif, setCustomObjectif] = useState('')

  const [source, setSource] = useState('')
  const [customSource, setCustomSource] = useState('')

  const [pays, setPays] = useState('')
  const [customPays, setCustomPays] = useState('')

  useEffect(() => {
    if (initialCompleted) return
    const localDone = localStorage.getItem('onboarding_questionnaire_completed')
    if (!localDone) {
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [initialCompleted])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('onboarding_questionnaire_completed', 'true')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const finalStatut = statut === 'Autre' ? customStatut || 'Autre' : statut
      const finalSecteur = secteur === 'Autre' ? customSecteur || 'Autre' : secteur
      const finalObjectif = objectif === 'Autre' ? customObjectif || 'Autre' : objectif
      const finalSource = source === 'Autre' ? customSource || 'Autre' : source
      const finalPays = pays === 'Autre' ? customPays || 'Autre' : pays

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const targetUserId = userId || session?.user?.id

      if (targetUserId) {
        await supabase
          .from('profiles')
          .update({
            prenom: prenom.trim() || null,
            nom: nom.trim() || null,
            statut: finalStatut,
            secteur: finalSecteur,
            objectif: finalObjectif,
            source: finalSource,
            pays: finalPays,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId)
      }

      localStorage.setItem('onboarding_questionnaire_completed', 'true')
      toast.success('Profil mis à jour avec succès ! Bienvenue sur CVAfrik 🚀')
      setIsOpen(false)
    } catch (err) {
      console.error('Questionnaire submit error:', err)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const stepsInfo = [
    {
      title: 'Comment vous appelez-vous ?',
      subtitle: 'Pour personnaliser vos CV et lettres de motivation',
      icon: User,
    },
    {
      title: 'Quel est votre statut actuel ?',
      subtitle: 'Cela nous aide à vous conseiller les meilleurs formats',
      icon: GraduationCap,
    },
    {
      title: 'Dans quel secteur d\'activité évoluez-vous ?',
      subtitle: 'Pour vous suggérer les compétences les plus demandées',
      icon: Briefcase,
    },
    {
      title: 'Quel est votre objectif principal ?',
      subtitle: 'Pour adapter les fonctionnalités de votre espace',
      icon: Target,
    },
    {
      title: 'Comment avez-vous connu CVAfrik ?',
      subtitle: 'Aidez-nous à savoir ce qui vous a amené ici',
      icon: Share2,
    },
    {
      title: 'Dans quel pays recherchez-vous du travail ?',
      subtitle: 'Pour adapter les templates aux standards locaux',
      icon: Globe,
    },
  ]

  const currentInfo = stepsInfo[currentStep]

  const canGoNext = () => {
    if (currentStep === 0) return prenom.trim().length > 0 && nom.trim().length > 0
    if (currentStep === 1) return statut && (statut !== 'Autre' || customStatut.trim())
    if (currentStep === 2) return secteur && (secteur !== 'Autre' || customSecteur.trim())
    if (currentStep === 3) return objectif && (objectif !== 'Autre' || customObjectif.trim())
    if (currentStep === 4) return source && (source !== 'Autre' || customSource.trim())
    if (currentStep === 5) return pays && (pays !== 'Autre' || customPays.trim())
    return false
  }

  const handleNextStep = () => {
    if (currentStep < stepsInfo.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={handleClose} />

      {/* Modal Content */}
      <Card className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden text-white z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Passer"
        >
          <X className="h-4 w-4" />
        </button>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header Badge & Stepper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Bienvenue sur CVAfrik
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400">
                Étape {currentStep + 1} / {stepsInfo.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              {stepsInfo.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 h-full transition-all duration-300 rounded-full',
                    i <= currentStep ? 'bg-primary' : 'bg-slate-700/50'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <currentInfo.icon className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-xl font-bold tracking-tight text-white">{currentInfo.title}</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentInfo.subtitle}</p>
          </div>

          {/* ── STEP 0: Nom & Prénom ────────────────────────────────────── */}
          {currentStep === 0 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  type="text"
                  placeholder="Ex: Joël"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  autoFocus
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Nom
                </Label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="Ex: EKON"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-xl h-11"
                />
              </div>
            </div>
          )}

          {/* ── STEP 1: Statut ───────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {STATUTS.map((item) => {
                const isSelected = statut === item
                return (
                  <div key={item} className="space-y-2">
                    <button
                      onClick={() => setStatut(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left text-sm font-semibold',
                        isSelected
                          ? 'bg-primary/15 border-primary text-white shadow-md shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </button>

                    {item === 'Autre' && isSelected && (
                      <Input
                        type="text"
                        placeholder="Précisez votre statut (ex: Indépendant, Consultant...)"
                        value={customStatut}
                        onChange={(e) => setCustomStatut(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-primary text-white placeholder-slate-500 rounded-xl"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── STEP 2: Secteur ──────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {SECTEURS.map((item) => {
                const isSelected = secteur === item
                return (
                  <div key={item} className="space-y-2">
                    <button
                      onClick={() => setSecteur(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left text-sm font-semibold',
                        isSelected
                          ? 'bg-primary/15 border-primary text-white shadow-md shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </button>

                    {item === 'Autre' && isSelected && (
                      <Input
                        type="text"
                        placeholder="Précisez votre secteur (ex: Agroalimentaire, Transport...)"
                        value={customSecteur}
                        onChange={(e) => setCustomSecteur(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-primary text-white placeholder-slate-500 rounded-xl"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── STEP 3: Objectif ─────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {OBJECTIFS.map((item) => {
                const isSelected = objectif === item
                return (
                  <div key={item} className="space-y-2">
                    <button
                      onClick={() => setObjectif(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left text-sm font-semibold',
                        isSelected
                          ? 'bg-primary/15 border-primary text-white shadow-md shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </button>

                    {item === 'Autre' && isSelected && (
                      <Input
                        type="text"
                        placeholder="Précisez votre objectif..."
                        value={customObjectif}
                        onChange={(e) => setCustomObjectif(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-primary text-white placeholder-slate-500 rounded-xl"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── STEP 4: Source (Comment vous nous avez connus) ───────────── */}
          {currentStep === 4 && (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {SOURCES.map((item) => {
                const isSelected = source === item
                return (
                  <div key={item} className="space-y-2">
                    <button
                      onClick={() => setSource(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left text-sm font-semibold',
                        isSelected
                          ? 'bg-primary/15 border-primary text-white shadow-md shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </button>

                    {item === 'Autre' && isSelected && (
                      <Input
                        type="text"
                        placeholder="Précisez où vous avez entendu parler de nous..."
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-primary text-white placeholder-slate-500 rounded-xl"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── STEP 5: Pays ─────────────────────────────────────────────── */}
          {currentStep === 5 && (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {PAYS_LIST.map((item) => {
                const isSelected = pays === item
                return (
                  <div key={item} className="space-y-2">
                    <button
                      onClick={() => setPays(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left text-sm font-semibold',
                        isSelected
                          ? 'bg-primary/15 border-primary text-white shadow-md shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </button>

                    {item === 'Autre' && isSelected && (
                      <Input
                        type="text"
                        placeholder="Indiquez votre pays..."
                        value={customPays}
                        onChange={(e) => setCustomPays(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-primary text-white placeholder-slate-500 rounded-xl"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0 || isSubmitting}
              className="text-slate-400 hover:text-white rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>

            <Button
              onClick={handleNextStep}
              disabled={!canGoNext() || isSubmitting}
              className="rounded-xl px-6 bg-primary font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : currentStep < stepsInfo.length - 1 ? (
                <>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                'Finaliser mon profil'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
