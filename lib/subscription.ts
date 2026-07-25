import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Checks if a user's subscription has expired and auto-downgrades if needed.
 * Returns the effective plan ID ('gratuit' if expired, or the current plan if still valid).
 *
 * This function is the SINGLE SOURCE OF TRUTH for plan status across the app.
 */
export async function getEffectivePlan(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  planId: string
  isExpired: boolean
  expiryDate: Date | null
  daysRemaining: number | null
}> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_expiry')
    .eq('id', userId)
    .maybeSingle()

  const planId = profile?.plan ?? 'gratuit'
  const planExpiry = profile?.plan_expiry ? new Date(profile.plan_expiry) : null

  // Plan gratuit = no expiry needed
  if (planId === 'gratuit' || !planExpiry) {
    return {
      planId,
      isExpired: false,
      expiryDate: planExpiry,
      daysRemaining: null,
    }
  }

  const now = new Date()
  const isExpired = now > planExpiry

  if (isExpired) {
    // Auto-downgrade to gratuit in the database
    await supabase
      .from('profiles')
      .update({
        plan: 'gratuit',
        updated_at: now.toISOString(),
      })
      .eq('id', userId)

    return {
      planId: 'gratuit',
      isExpired: true,
      expiryDate: planExpiry,
      daysRemaining: 0,
    }
  }

  // Calculate remaining days
  const msRemaining = planExpiry.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  return {
    planId,
    isExpired: false,
    expiryDate: planExpiry,
    daysRemaining,
  }
}

/**
 * Formats the remaining days into a human-readable string.
 */
export function formatDaysRemaining(days: number | null): string {
  if (days === null) return ''
  if (days <= 0) return 'Expiré'
  if (days === 1) return '1 jour restant'
  if (days <= 7) return `${days} jours restants`
  if (days <= 30) return `${Math.ceil(days / 7)} semaines restantes`
  return `${Math.ceil(days / 30)} mois restants`
}
