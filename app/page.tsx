import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { MobileMoneySection } from '@/components/landing/mobile-money-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { TemplatesSection } from '@/components/landing/templates-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTASection } from '@/components/landing/cta-section'
import { SocialFollowCard } from '@/components/profile/social-follow-card'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <HeroSection />
        <div className="mobile-content-visibility"><MobileMoneySection /></div>
        <div className="mobile-content-visibility"><FeaturesSection /></div>
        <div className="mobile-content-visibility"><TemplatesSection /></div>
        <div className="mobile-content-visibility"><PricingSection /></div>
        <div className="mobile-content-visibility"><CTASection /></div>
        <section className="container mx-auto px-4 pb-14 pt-2 sm:pb-20"><SocialFollowCard className="mx-auto max-w-xl" /></section>
      </main>
      <Footer />
    </div>
  )
}
