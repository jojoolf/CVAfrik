import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEffectivePlan } from '@/lib/subscription'
import { PLANS } from '@/lib/types'
import { templateCatalog } from '@/components/cv-builder/templates/cv-preview-collection'

const MAX_TITLE_LENGTH = 120

function isTemplateAvailable(templateId: string, allowedTemplates: string[]) {
  return allowedTemplates.includes('all') || allowedTemplates.includes(templateId)
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })
    }

    const body = await request.json()
    const cvId = typeof body.cvId === 'string' && body.cvId ? body.cvId : null
    const titre = typeof body.titre === 'string' ? body.titre.trim().slice(0, MAX_TITLE_LENGTH) : ''
    const template = typeof body.template === 'string' ? body.template : ''
    const donnees = body.donnees

    if (!titre || !template || !donnees || typeof donnees !== 'object') {
      return NextResponse.json({ error: 'Les données du CV sont incomplètes.' }, { status: 400 })
    }

    const templateConfig = templateCatalog.find((item) => item.id === template)
    if (!templateConfig) {
      return NextResponse.json({ error: 'Le modèle sélectionné est introuvable.' }, { status: 400 })
    }

    const subscription = await getEffectivePlan(supabase, user.id)
    const plan = PLANS.find((item) => item.id === subscription.planId) || PLANS[0]

    if (!isTemplateAvailable(template, plan.limites.templates)) {
      return NextResponse.json(
        { error: 'Ce modèle est réservé au plan Pro.', code: 'template_locked' },
        { status: 403 },
      )
    }

    if (cvId) {
      const { data: existingCV, error: existingError } = await supabase
        .from('cvs')
        .select('id')
        .eq('id', cvId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingError) throw existingError
      if (!existingCV) {
        return NextResponse.json({ error: 'CV introuvable.' }, { status: 404 })
      }

      const { error } = await supabase
        .from('cvs')
        .update({
          titre,
          donnees,
          template,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCV.id)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true, id: existingCV.id, action: 'updated' })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('cvs_generes_ce_mois')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    const limit = plan.limites.cvs_par_mois
    if (limit !== null && profile.cvs_generes_ce_mois >= limit) {
      return NextResponse.json(
        { error: 'La limite mensuelle de CV de votre plan est atteinte.', code: 'cv_limit' },
        { status: 403 },
      )
    }

    const { data: createdCV, error: createError } = await supabase
      .from('cvs')
      .insert({ user_id: user.id, titre, donnees, template })
      .select('id')
      .single()

    if (createError) throw createError

    const { error: countError } = await supabase
      .from('profiles')
      .update({
        cvs_generes_ce_mois: profile.cvs_generes_ce_mois + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (countError) throw countError

    return NextResponse.json({ success: true, id: createdCV.id, action: 'created' })
  } catch (error) {
    console.error('[cv/save]', error)
    return NextResponse.json(
      { error: 'La sauvegarde du CV a échoué. Réessaie dans quelques instants.' },
      { status: 500 },
    )
  }
}
