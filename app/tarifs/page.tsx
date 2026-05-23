import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PaymentMethods } from '@/components/pricing/payment-methods'
import { FAQ } from '@/components/pricing/faq'
import { createClient } from '@/lib/supabase/server'

import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Explorez nos tarifs transparents. Commencez gratuitement, passez au Pro pour des CV illimités, le score ATS et la préparation aux entretiens.',
}

export default async function TarifsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const locked = params.locked as string

  let lockedMessage = null
  if (locked === 'simulateur') {
    lockedMessage = 'Le simulateur d\'entretien est réservé aux plans payants. Passez au niveau supérieur pour débloquer cette fonctionnalité !'
  } else if (locked === 'cv') {
    lockedMessage = 'Vous avez atteint la limite de création de CV de votre plan actuel. Passez au niveau supérieur pour en créer d\'autres !'
  } else if (locked === 'lettres') {
    lockedMessage = 'Vous avez atteint la limite de création de lettres de motivation de votre plan actuel. Passez au niveau supérieur pour en créer d\'autres !'
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        {lockedMessage && (
          <div className="bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800/50 py-3">
            <div className={cn(
                "container mx-auto px-4 flex items-center justify-center gap-2 text-amber-900 dark:text-amber-200 font-medium text-sm text-center"
              )}>
              <Lock className="h-4 w-4 shrink-0" />
              <span>{lockedMessage}</span>
            </div>
          </div>
        )}
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Des tarifs <span className="text-primary">accessibles</span> pour tous
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Commencez gratuitement et passez a un plan superieur quand vous en avez besoin.
              Paiement Mobile Money accepte dans toute l&apos;Afrique.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <PricingCards currentPlan={null} />
        </section>

        {/* Payment Methods */}
        <PaymentMethods />

        {/* FAQ */}
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
