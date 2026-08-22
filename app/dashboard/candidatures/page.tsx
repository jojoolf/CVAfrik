import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ApplicationsTracker } from './applications-tracker'

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion?redirect=/dashboard/candidatures')

  const [{ data: applications }, { data: cvs }, { data: letters }] = await Promise.all([
    supabase.from('suivi_candidatures').select('*').eq('user_id', user.id).order('date_candidature', { ascending: false }),
    supabase.from('cvs').select('id, titre').eq('user_id', user.id),
    supabase.from('lettres_motivation').select('id, titre').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return <ApplicationsTracker initialApplications={applications || []} cvs={cvs || []} letters={letters || []} />
}
