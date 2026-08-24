import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEffectivePlan } from '@/lib/subscription'
import { PLANS } from '@/lib/types'
import { DocumentCvEditor } from '@/components/cv-editor/document-cv-editor'

interface PageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function CvEditorPage({ searchParams }: PageProps) {
  const { edit } = await searchParams
  if (!edit) redirect('/dashboard/cv')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/connexion?redirect=${encodeURIComponent(`/cv-editor?edit=${edit}`)}`)

  const [{ data: cv }, subscription] = await Promise.all([
    supabase.from('cvs').select('*').eq('id', edit).eq('user_id', user.id).maybeSingle(),
    getEffectivePlan(supabase, user.id),
  ])
  if (!cv) redirect('/dashboard/cv')

  const plan = PLANS.find((item) => item.id === subscription.planId) || PLANS[0]
  return <DocumentCvEditor cv={cv} plan={plan} />
}
