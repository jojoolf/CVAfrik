import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeCvAgainstJob } from '@/lib/ats'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const body = await request.json()
    const cvId = typeof body.cvId === 'string' ? body.cvId : ''
    const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription.trim() : ''
    if (!cvId || jobDescription.length < 40) {
      return NextResponse.json({ error: 'Sélectionnez un CV et ajoutez une description d’offre suffisamment détaillée.' }, { status: 400 })
    }

    const { data: cv, error } = await supabase
      .from('cvs')
      .select('donnees')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()
    if (error || !cv) return NextResponse.json({ error: 'CV introuvable.' }, { status: 404 })

    return NextResponse.json({ success: true, result: analyzeCvAgainstJob(cv.donnees, jobDescription) })
  } catch (error) {
    console.error('[ats/analyze]', error)
    return NextResponse.json({ error: 'L’analyse ATS a échoué.' }, { status: 500 })
  }
}
