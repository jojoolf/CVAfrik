import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const statuses = ['envoye', 'relance', 'entretien', 'refuse', 'accepte']

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })
    const { id } = await params
    const { statut } = await request.json()
    if (!statuses.includes(statut)) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
    const { data, error } = await supabase.from('suivi_candidatures').update({ statut, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id).select('*').single()
    if (error || !data) return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 })
    return NextResponse.json({ success: true, application: data })
  } catch (error) { console.error('[applications/update]', error); return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 }) }
}
