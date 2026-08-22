import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin/access'
import { OPPORTUNITY_TYPES } from '@/lib/opportunities'

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function serviceClient() {
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

async function requireAdmin() {
  const auth = await createAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

export async function GET() {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })

    const { data, error } = await serviceClient()
      .from('opportunites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ opportunities: data || [] })
  } catch (error) {
    console.error('[admin/opportunities/list]', error)
    return NextResponse.json({ error: 'Impossible de charger les opportunités.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })

    const body = await request.json()
    const type = String(body.type || '')
    const titre = String(body.titre || '').trim()
    const organisation = String(body.organisation || '').trim()
    const description = String(body.description || '').trim()

    if (!OPPORTUNITY_TYPES.some((item) => item.id === type) || !titre || !organisation || !description) {
      return NextResponse.json({ error: 'Le type, le titre, l’organisation et la description sont obligatoires.' }, { status: 400 })
    }

    const opportunity = {
      type,
      titre: titre.slice(0, 180),
      slug: `${createSlug(titre).slice(0, 80)}-${Date.now().toString(36)}`,
      organisation: organisation.slice(0, 180),
      description: description.slice(0, 12000),
      pays: typeof body.pays === 'string' ? body.pays.trim().slice(0, 80) || null : null,
      ville: typeof body.ville === 'string' ? body.ville.trim().slice(0, 80) || null : null,
      remote: Boolean(body.remote),
      niveau: typeof body.niveau === 'string' ? body.niveau.trim().slice(0, 80) || null : null,
      secteur: typeof body.secteur === 'string' ? body.secteur.trim().slice(0, 100) || null : null,
      date_limite: /^\d{4}-\d{2}-\d{2}$/.test(String(body.dateLimite || '')) ? body.dateLimite : null,
      lien_candidature: typeof body.lienCandidature === 'string' ? body.lienCandidature.trim().slice(0, 1000) || null : null,
      image_url: typeof body.imageUrl === 'string' ? body.imageUrl.trim().slice(0, 1000) || null : null,
      source_nom: typeof body.sourceNom === 'string' ? body.sourceNom.trim().slice(0, 180) || null : null,
      source_url: typeof body.sourceUrl === 'string' ? body.sourceUrl.trim().slice(0, 1000) || null : null,
      publie: Boolean(body.publie),
      created_by: user.id,
    }

    const supabase = serviceClient()
    const { data, error } = await supabase.from('opportunites').insert(opportunity).select('*').single()
    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_email: user.email!,
      action: 'opportunite_creee',
      details: { opportunity_id: data.id, titre: data.titre, type: data.type, publie: data.publie },
    })

    return NextResponse.json({ success: true, opportunity: data })
  } catch (error) {
    console.error('[admin/opportunities/create]', error)
    return NextResponse.json({ error: 'La création de l’opportunité a échoué.' }, { status: 500 })
  }
}
