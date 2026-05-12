import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PaymentMethods } from '@/components/pricing/payment-methods'
import { FAQ } from '@/components/pricing/faq'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Decouvrez nos tarifs adaptes a l\'Afrique de l\'Ouest. Paiement Mobile Money accepte: Orange Money, Wave, MTN, Moov, Flooz.',
}

export default async function TarifsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Des tarifs <span className="text-primary">accessibles</span> pour tous
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Commencez gratuitement et passez a un plan superieur quand vous en avez besoin.
              Paiement Mobile Money accepte dans toute l&apos;Afrique de l&apos;Ouest.
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
