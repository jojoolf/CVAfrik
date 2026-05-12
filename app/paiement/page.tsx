import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { PaymentForm } from '@/components/payment/payment-form'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Paiement',
  description: 'Finalisez votre achat avec Mobile Money ou carte bancaire.',
}

interface PageProps {
  searchParams: Promise<{ plan?: string }>
}

export default async function PaiementPage({ searchParams }: PageProps) {
  const params = await searchParams
  const planId = params.plan

  // Validate plan
  const plan = PLANS.find(p => p.id === planId && p.id !== 'gratuit')
  if (!plan) {
    redirect('/tarifs')
  }

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/connexion?redirect=/paiement?plan=${planId}`)
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col bg-secondary/20">
      <Navbar user={user} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-center text-3xl font-bold text-foreground">
              Finaliser votre achat
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              Vous avez choisi le plan <span className="font-semibold text-primary">{plan.nom}</span>
            </p>

            <PaymentForm plan={plan} userEmail={user.email!} userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
