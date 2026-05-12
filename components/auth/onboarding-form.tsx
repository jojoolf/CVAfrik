'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 'prenom',
    title: 'Votre prenom',
  },
  {
    id: 'statut',
    title: 'Qui etes-vous ?',
  },
  {
    id: 'secteur',
    title: 'Votre secteur',
  },
  {
    id: 'objectif',
    title: 'Votre objectif',
  },
  {
    id: 'source',
    title: 'Comment nous avez-vous connu ?',
  },
  {
    id: 'recap',
    title: 'Recapitulatif',
  },
]

const statuts = [
  { id: 'etudiant', label: 'Etudiant', icon: '🎓' },
  { id: 'chercheur_emploi', label: 'Chercheur d\'emploi', icon: '🔍' },
  { id: 'professionnel', label: 'Professionnel en poste', icon: '💼' },
  { id: 'freelance', label: 'Freelance', icon: '🚀' },
]

const secteurs = [
  { id: 'tech', label: 'Tech / IT' },
  { id: 'commerce', label: 'Commerce / Marketing' },
  { id: 'finance', label: 'Finance / Comptabilite' },
  { id: 'sante', label: 'Sante' },
  { id: 'education', label: 'Education' },
  { id: 'btp', label: 'BTP / Architecture' },
  { id: 'autre', label: 'Autre' },
]

const objectifs = [
  { id: 'premier_emploi', label: 'Decrocher mon premier emploi' },
  { id: 'changement_poste', label: 'Changer de poste ou de carriere' },
  { id: 'stage', label: 'Trouver un stage' },
  { id: 'international', label: 'Postuler a l\'international' },
  { id: 'freelance', label: 'Me lancer en freelance' },
  { id: 'mise_a_jour', label: 'Mettre a jour mon CV' },
]

const sources = [
  { id: 'reseaux', label: 'Reseaux sociaux (Facebook, WhatsApp, LinkedIn)' },
  { id: 'bouche_oreille', label: 'Bouche a oreille / ami' },
  { id: 'google', label: 'Google' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'ecole', label: 'Mon ecole / universite' },
  { id: 'pub', label: 'Publicite en ligne' },
]

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [answers, setAnswers] = useState({
    prenom: '',
    statut: '',
    secteur: '',
    objectif: '',
    source: '',
  })

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    const key = steps[step].id
    if (key === 'prenom') return answers.prenom.trim().length >= 1
    if (key === 'recap') return true
    return answers[key as keyof typeof answers] !== ''
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Vous devez etre connecte')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: answers.prenom,
          statut: answers.statut,
          secteur: answers.secteur,
          objectif: answers.objectif,
          source: answers.source,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Parfait ! Creez votre CV maintenant')
      router.push('/cv-builder?onboarded=true')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatutLabel = (id: string) => statuts.find(s => s.id === id)?.label || id
  const getSecteurLabel = (id: string) => secteurs.find(s => s.id === id)?.label || id
  const getObjectifLabel = (id: string) => objectifs.find(o => o.id === id)?.label || id
  const getSourceLabel = (id: string) => sources.find(s => s.id === id)?.label || id

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'flex-1 h-1 rounded-full mx-0.5 transition-colors',
                i <= step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {step + 1} / {steps.length}
        </p>
      </div>

      {/* Step: Prénom */}
      {step === 0 && (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Comment vous appelez-vous ?
          </h2>
          <p className="text-muted-foreground">
            Pour personnaliser toute votre experience
          </p>
          <div className="max-w-xs mx-auto">
            <Input
              placeholder="Votre prenom"
              value={answers.prenom}
              onChange={(e) => updateAnswer('prenom', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && setStep(1)}
              autoFocus
              className="text-center text-lg"
            />
          </div>
        </div>
      )}

      {/* Step: Statut */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Qui etes-vous ?
          </h2>
          <p className="text-muted-foreground text-center">
            Pour adapter les templates a votre profil
          </p>
          <div className="grid gap-3 mt-6">
            {statuts.map((s) => (
              <button
                key={s.id}
                onClick={() => { updateAnswer('statut', s.id); setStep(2) }}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  answers.statut === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="font-medium text-foreground">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Secteur */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Votre secteur
          </h2>
          <p className="text-muted-foreground text-center">
            Pour mettre en avant les bonnes competences
          </p>
          <div className="grid grid-cols-1 gap-2 mt-6">
            {secteurs.map((s) => (
              <button
                key={s.id}
                onClick={() => { updateAnswer('secteur', s.id); setStep(3) }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  answers.secteur === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <span className="font-medium text-foreground">{s.label}</span>
                {answers.secteur === s.id && (
                  <CheckCircle className="h-4 w-4 text-primary ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Objectif */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Votre objectif
          </h2>
          <p className="text-muted-foreground text-center">
            Pour des conseils personnalises
          </p>
          <div className="grid gap-2 mt-6">
            {objectifs.map((o) => (
              <button
                key={o.id}
                onClick={() => { updateAnswer('objectif', o.id); setStep(4) }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  answers.objectif === o.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <span className="font-medium text-foreground">{o.label}</span>
                {answers.objectif === o.id && (
                  <CheckCircle className="h-4 w-4 text-primary ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Source */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Comment nous avez-vous connu ?
          </h2>
          <p className="text-muted-foreground text-center">
            Cela nous aide a nous ameliorer
          </p>
          <div className="grid gap-2 mt-6">
            {sources.map((s) => (
              <button
                key={s.id}
                onClick={() => { updateAnswer('source', s.id); setStep(5) }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  answers.source === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <span className="font-medium text-foreground">{s.label}</span>
                {answers.source === s.id && (
                  <CheckCircle className="h-4 w-4 text-primary ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Recap */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Ravie de vous rencontrer, {answers.prenom} !
            </h2>
            <p className="text-muted-foreground mt-1">
              Voici ce que nous avons retenu
            </p>
          </div>

          <div className="space-y-3 bg-muted/30 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Prenom</span>
              <span className="font-medium text-foreground">{answers.prenom}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Statut</span>
              <span className="font-medium text-foreground">{getStatutLabel(answers.statut)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Secteur</span>
              <span className="font-medium text-foreground">{getSecteurLabel(answers.secteur)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Objectif</span>
              <span className="font-medium text-foreground">{getObjectifLabel(answers.objectif)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium text-foreground">{getSourceLabel(answers.source)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Nous utiliserons ces informations pour personnaliser vos suggestions de CV et conseils IA.
          </p>

          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Creer mon CV maintenant'
            )}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 0 && step < 5 ? (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Retour
          </Button>
        ) : <div />}
        {step < 4 && (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Suivant
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
