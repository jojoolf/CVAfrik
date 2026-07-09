import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CVBuilderForm } from '@/components/cv-builder/cv-builder-form'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'
import {
  getFirstAvailableTemplate,
  getTemplateConfig,
  getTemplateUpgradeHref,
  hasTemplateAccess,
} from '@/lib/template-access'

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
  const requestedPath = params.template
    ? `/cv-builder?template=${encodeURIComponent(params.template)}`
    : '/cv-builder'

  if (!user) {
    redirect(`/auth/connexion?redirect=${encodeURIComponent(requestedPath)}`)
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/profil/modifier')
  }

  // Get plan limits
  const plan = PLANS.find(p => p.id === profile.plan) || PLANS[0]

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

  const requestedTemplateId = existingCV?.template || params.template
  const requestedTemplate = requestedTemplateId ? getTemplateConfig(requestedTemplateId) : null

  if (requestedTemplate && !hasTemplateAccess(profile.plan, requestedTemplate.id)) {
    redirect(getTemplateUpgradeHref(requestedTemplate.id))
  }

  const selectedTemplate = requestedTemplate?.id || getFirstAvailableTemplate(profile.plan)

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
      selectedTemplate={selectedTemplate}
    />
  )
}
