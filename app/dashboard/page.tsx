import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/auth/onboarding-form'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, prenom')
    .eq('id', user.id)
    .single()

  const showOnboarding = !profile || profile.onboarding_completed !== true

  if (showOnboarding) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="py-4 px-6">
          <span className="text-xl font-bold">
            CVA<span className="text-primary">frik</span>
          </span>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <OnboardingForm />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Tableau de bord (bientot disponible)</p>
    </div>
  )
}
