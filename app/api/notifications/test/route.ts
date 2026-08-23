import { NextResponse } from 'next/server'
import { sendUserNotification } from '@/lib/notifications/send'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    const result = await sendUserNotification({
      userId: user.id,
      recipientEmail: user.email,
      category: 'announcement',
      title: 'Test de notification CVAfrik',
      body: 'Vos alertes sont prêtes sur ce téléphone.',
      href: '/profil',
    })

    if (result.skipped) {
      return NextResponse.json({ error: 'Les actualités CVAfrik sont désactivées dans vos préférences.' }, { status: 409 })
    }

    return NextResponse.json({
      success: true,
      pushSent: result.pushSent,
      emailSent: result.emailSent,
    })
  } catch (error) {
    console.error('[notifications/test]', error)
    return NextResponse.json({ error: 'Le test de notification est indisponible pour le moment.' }, { status: 500 })
  }
}
