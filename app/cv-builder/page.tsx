import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CVBuilderForm } from '@/components/cv-builder/cv-builder-form'
import { createClient } from '@/lib/supabase/server'
import { checkAndGetProfile } from '@/lib/supabase/profile'
import { PLANS } from '@/lib/types'
import { getEffectivePlan } from '@/lib/subscription'
import { templateCatalog } from '@/components/cv-builder/templates/cv-preview-collection'

export const metadata: Metadata = {
  title: 'Creer mon CV',
  description: 'Creez votre CV professionnel en quelques minutes avec notre editeur intuitif.',
}

interface PageProps {
  searchParams: Promise<{ template?: string; edit?: string }>
}

export default async function CVBuilderPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion?redirect=/cv-builder')
  }

  // Get user profile
  const profile = await checkAndGetProfile(supabase, user.id)

  if (!profile) {
    redirect('/profil/modifier')
  }

  // Get the effective subscription before granting access to paid templates.
  const subscription = await getEffectivePlan(supabase, user.id)
  const plan = PLANS.find(p => p.id === subscription.planId) || PLANS[0]

  const requestedTemplate = params.template || 'moderne'
  const templateExists = templateCatalog.some((item) => item.id === requestedTemplate)
  const templateAllowed = templateExists && (
    plan.limites.templates.includes('all') || plan.limites.templates.includes(requestedTemplate)
  )

  if (!templateAllowed) {
    redirect('/tarifs?locked=template')
  }

  // Check if editing existing CV
  let existingCV = null
  if (params.edit) {
    const { data } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', params.edit)
      .eq('user_id', user.id)
      .single()
    existingCV = data
  }

  // Check monthly limits for free plan
  const canCreate = plan.limites.cvs_par_mois === null || 
    profile.cvs_generes_ce_mois < (plan.limites.cvs_par_mois || 0) ||
    existingCV !== null

  if (!canCreate) {
    redirect('/tarifs?locked=cv')
  }

  return (
    <CVBuilderForm 
      profile={profile}
      plan={plan}
      existingCV={existingCV}
      canCreate={canCreate}
      selectedTemplate={requestedTemplate}
    />
  )
}
