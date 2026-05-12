import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/auth/onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

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
