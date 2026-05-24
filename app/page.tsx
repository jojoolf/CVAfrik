import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { TemplatesSection } from '@/components/landing/templates-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTASection } from '@/components/landing/cta-section'
import { createClient } from '@/lib/supabase/server'
import { createTranslator } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { locale, t } = await createTranslator()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <HeroSection t={t} />
        <FeaturesSection t={t} />
        <TemplatesSection />
        <PricingSection />
        <CTASection t={t} />
      </main>
      <Footer />
    </div>
  )
}
