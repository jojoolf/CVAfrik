import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AtsAnalyzer } from './ats-analyzer'

export default async function AtsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion?redirect=/dashboard/ats')

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return <AtsAnalyzer cvs={cvs || []} />
}
