'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitSupportTicket(data: {
  sujet: string
  message: string
  priorite: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non authentifie' }
    }

    const { error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        sujet: data.sujet,
        message: data.message,
        priorite: data.priorite,
      })

    if (error) {
      console.error(error)
      return { success: false, error: 'Erreur lors de l\'enregistrement de votre demande.' }
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erreur technique.' }
  }
}
