import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingBanner } from '@/components/auth/onboarding-banner'

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

  return (
    <div className="min-h-screen">
      {showOnboarding && <OnboardingBanner prenom={profile?.prenom} />}
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Tableau de bord (bientot disponible)</p>
      </div>
    </div>
  )
}
