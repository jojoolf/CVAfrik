import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const statuses = ['envoye', 'relance', 'entretien', 'refuse', 'accepte']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })
    const body = await request.json()
    const entreprise = typeof body.entreprise === 'string' ? body.entreprise.trim() : ''
    const poste = typeof body.poste === 'string' ? body.poste.trim() : ''
    if (!entreprise || !poste) return NextResponse.json({ error: 'L’entreprise et le poste sont obligatoires.' }, { status: 400 })
    const statut = statuses.includes(body.statut) ? body.statut : 'envoye'
    const { data, error } = await supabase.from('suivi_candidatures').insert({ user_id: user.id, nom_entreprise: entreprise.slice(0, 160), poste: poste.slice(0, 160), cv_id: body.cvId || null, lettre_id: body.lettreId || null, date_candidature: /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : new Date().toISOString().slice(0, 10), statut, rappel_date: /^\d{4}-\d{2}-\d{2}$/.test(body.rappel) ? body.rappel : null, notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 5000) || null : null }).select('*').single()
    if (error) throw error
    return NextResponse.json({ success: true, application: data })
  } catch (error) { console.error('[applications/create]', error); return NextResponse.json({ error: 'Création de la candidature impossible.' }, { status: 500 }) }
}
