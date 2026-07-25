import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Cron endpoint to automatically downgrade all expired subscriptions.
 * This runs as a safety net — the main check happens in getEffectivePlan() on each page load.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/expire-subscriptions", "schedule": "0 3 * * *" }]
 * }
 */
export async function GET(req: Request) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date().toISOString()

  // Find all users whose plan is not 'gratuit' AND plan_expiry is in the past
  const { data: expiredProfiles, error } = await supabase
    .from('profiles')
    .select('id, email, plan, plan_expiry')
    .neq('plan', 'gratuit')
    .lt('plan_expiry', now)

  if (error) {
    console.error('[CRON] Error fetching expired profiles:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!expiredProfiles || expiredProfiles.length === 0) {
    return NextResponse.json({ message: 'No expired subscriptions', count: 0 })
  }

  // Downgrade all expired users to gratuit
  const expiredIds = expiredProfiles.map((p) => p.id)
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan: 'gratuit', updated_at: now })
    .in('id', expiredIds)

  if (updateError) {
    console.error('[CRON] Error downgrading profiles:', updateError)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  console.log(`[CRON] Downgraded ${expiredIds.length} expired subscriptions:`, expiredProfiles.map(p => p.email))

  return NextResponse.json({
    message: `Downgraded ${expiredIds.length} expired subscriptions`,
    count: expiredIds.length,
    users: expiredProfiles.map(p => ({ email: p.email, expired_at: p.plan_expiry })),
  })
}
