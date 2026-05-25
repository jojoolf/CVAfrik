import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { PLANS } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom, email, plan')
    .eq('id', user.id)
    .maybeSingle()

  const displayName =
    [profile?.prenom, profile?.nom].filter(Boolean).join(' ').trim() ||
    profile?.email ||
    user.email ||
    'Utilisateur'

  const planId = profile?.plan ?? 'gratuit'
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]
  const isFreePlan = planId === 'gratuit'

  return (
    <DashboardShell
      user={user}
      displayName={displayName}
      planName={plan.nom}
      isFreePlan={isFreePlan}
    >
      {children}
    </DashboardShell>
  )
}
