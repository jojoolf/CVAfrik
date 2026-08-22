import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin/access'

function serviceClient() {
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

async function requireAdmin() {
  const auth = await createAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const { id } = await params
    const body = await request.json()

    if (typeof body.publie !== 'boolean') {
      return NextResponse.json({ error: 'Statut de publication invalide.' }, { status: 400 })
    }

    const supabase = serviceClient()
    const { data, error } = await supabase
      .from('opportunites')
      .update({ publie: body.publie, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, titre, publie')
      .single()

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_email: user.email!,
      action: body.publie ? 'opportunite_publiee' : 'opportunite_mise_en_brouillon',
      details: { opportunity_id: data.id, titre: data.titre },
    })

    return NextResponse.json({ success: true, opportunity: data })
  } catch (error) {
    console.error('[admin/opportunities/update]', error)
    return NextResponse.json({ error: 'La mise à jour a échoué.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const { id } = await params
    const supabase = serviceClient()
    const { data, error } = await supabase.from('opportunites').delete().eq('id', id).select('id, titre').single()
    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_email: user.email!,
      action: 'opportunite_supprimee',
      details: { opportunity_id: data.id, titre: data.titre },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/opportunities/delete]', error)
    return NextResponse.json({ error: 'La suppression a échoué.' }, { status: 500 })
  }
}
