import { Metadata } from 'next'
import { PremiumPricingFlow } from '@/components/pricing/premium-pricing'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Passer au Pro — CVAfrik',
  description: 'Débloquez tous les avantages CVAfrik Pro. Paiement Mobile Money (Orange, MTN, Moov, Wave) ou carte bancaire.',
}

export default async function AbonnementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentPlan: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    currentPlan = profile?.plan ?? null
  }

  return <PremiumPricingFlow currentPlan={currentPlan} />
}
