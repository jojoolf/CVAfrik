import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PremiumPricing } from '@/components/pricing/premium-pricing'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Explorez nos tarifs transparents. Commencez gratuitement, passez au Pro pour des CV illimités, le score ATS et la préparation aux entretiens.',
}

export default async function TarifsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0F0D]">
      <Navbar user={user} />
      <main className="flex-1">
        <PremiumPricing user={user} />
      </main>
      <Footer />
    </div>
  )
}
