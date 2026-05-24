'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, ChevronRight, ChevronLeft, Sparkles, FileText, MessageSquareCode, FileSignature, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Créez votre CV',
    description: 'Remplissez vos informations en 5 étapes. Choisissez parmi 11 templates professionnels.',
    target: 'create-cv',
  },
  {
    icon: FileSignature,
    title: 'Générez des lettres',
    description: 'Laissez l\'IA rédiger vos lettres de motivation en 3 styles différents.',
    target: 'generate-letter',
  },
  {
    icon: MessageSquareCode,
    title: 'Simulez un entretien',
    description: 'Entraînez-vous avec notre simulateur IA coach. Questions personnalisées selon votre profil.',
    target: 'simulate-interview',
  },
  {
    icon: CheckCircle2,
    title: 'Suivez vos candidatures',
    description: 'Gardez une trace de toutes vos candidatures et recevez des rappels.',
    target: 'track-applications',
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem('onboarding_done')
    if (!done) {
      const timer = setTimeout(() => setIsOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('onboarding_done', 'true')
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  if (!isOpen) return null

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <Card className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-primary/20 shadow-2xl" style={{ animation: 'slideUp 0.3s ease-out' }}>
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        <CardContent className="p-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
            <current.icon className="h-8 w-8 text-white" />
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{current.description}</p>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Précédent
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs text-muted-foreground">
                Passer
              </Button>
              <Button size="sm" onClick={handleNext} className="text-xs">
                {step < steps.length - 1 ? (
                  <>Suivant <ChevronRight className="h-3 w-3 ml-1" /></>
                ) : (
                  'Terminer'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
