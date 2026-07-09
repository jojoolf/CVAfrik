import { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PaymentMethods } from '@/components/pricing/payment-methods'
import { FAQ } from '@/components/pricing/faq'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { PLANS, type Plan } from '@/lib/types'
import { getPlanLabel, getTemplateConfig } from '@/lib/template-access'

export const metadata: Metadata = {
  title: 'Tarifs',
  description:
    'Explorez nos tarifs transparents. Commencez gratuitement, passez au Pro pour des CV illimites, le score ATS et la preparation aux entretiens.',
}

interface TarifsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TarifsPage({ searchParams }: TarifsPageProps) {
  const params = await searchParams
  const locked = params.locked as string | undefined
  const lockedTemplateId = params.template as string | undefined
  const highlightedPlan = PLANS.find((plan) => plan.id === params.requiredPlan)?.id ?? null

  let lockedMessage: string | null = null

  if (locked === 'simulateur') {
    lockedMessage = 'Le simulateur d\'entretien est bientot disponible sur tous les plans.'
  } else if (locked === 'cv') {
    lockedMessage =
      'Vous avez atteint la limite de creation de CV de votre plan actuel. Passez au niveau superieur pour en creer d\'autres !'
  } else if (locked === 'lettres') {
    lockedMessage =
      'Vous avez atteint la limite de creation de lettres de motivation de votre plan actuel. Passez au niveau superieur pour en creer d\'autres !'
  } else if (locked === 'template' && lockedTemplateId) {
    const template = getTemplateConfig(lockedTemplateId)
    const requiredLabel = highlightedPlan ? getPlanLabel(highlightedPlan) : 'superieur'
    lockedMessage = template
      ? `Le template ${template.name} est reserve au plan ${requiredLabel}. Passez au bon abonnement pour le debloquer.`
      : `Ce template est reserve au plan ${requiredLabel}. Passez au bon abonnement pour le debloquer.`
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentPlan: Plan | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle()

    currentPlan = profile?.plan ?? null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        {lockedMessage && (
          <div className="border-b border-amber-200 bg-amber-100/50 py-3 dark:border-amber-800/50 dark:bg-amber-900/30">
            <div
              className={cn(
                'container mx-auto flex items-center justify-center gap-2 px-4 text-center text-sm font-medium text-amber-900 dark:text-amber-200',
              )}
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span>{lockedMessage}</span>
            </div>
          </div>
        )}

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

        <section className="py-12">
          <PricingCards currentPlan={currentPlan} highlightedPlan={highlightedPlan} />
        </section>

        <PaymentMethods />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
