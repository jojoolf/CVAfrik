import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { TemplateGallery } from '@/components/templates/template-gallery'
import { createClient } from '@/lib/supabase/server'
import type { Plan } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Templates CV',
  description: 'Decouvrez les templates CVAfrik et choisissez le modele adapte a votre abonnement.',
}

export default async function TemplatesPage() {
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

    currentPlan = profile?.plan ?? 'gratuit'
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={user} />
      <main className="flex-1 py-12 pb-20">
        <TemplateGallery currentPlan={currentPlan} />
      </main>
      <Footer />
    </div>
  )
}
