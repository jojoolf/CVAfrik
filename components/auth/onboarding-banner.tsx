'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingForm } from './onboarding-form'

interface Props {
  prenom?: string
}

export function OnboardingBanner({ prenom }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="py-4 px-6 flex items-center justify-between">
          <span className="text-xl font-bold">
            CVA<span className="text-primary">frik</span>
          </span>
          <Button variant="ghost" onClick={() => setShowForm(false)}>
            <X className="h-4 w-4 mr-1" />
            Revenir au tableau de bord
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <OnboardingForm />
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm sm:text-base">
              {prenom ? `Bienvenue, ${prenom} !` : 'Bienvenue !'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Completez votre profil pour des suggestions de CV personnalisees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={() => setShowForm(true)}>
            Completer mon profil
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
