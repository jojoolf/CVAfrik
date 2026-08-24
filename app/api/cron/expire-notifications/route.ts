import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const RETENTION_MS = 3 * 24 * 60 * 60 * 1000

/**
 * Nettoyage quotidien des notifications conservées au maximum trois jours.
 * La route est appelée automatiquement par la tâche planifiée Vercel.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const cutoff = new Date(Date.now() - RETENTION_MS).toISOString()

  const { data: expiredNotifications, error: selectError } = await supabase
    .from('user_notifications')
    .select('id')
    .lt('created_at', cutoff)

  if (selectError) {
    console.error('[cron/expire-notifications/select]', selectError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!expiredNotifications?.length) {
    return NextResponse.json({ message: 'No expired notifications', count: 0 })
  }

  const { error: deleteError } = await supabase
    .from('user_notifications')
    .delete()
    .in('id', expiredNotifications.map((notification) => notification.id))

  if (deleteError) {
    console.error('[cron/expire-notifications/delete]', deleteError)
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 })
  }

  return NextResponse.json({
    message: 'Expired notifications deleted',
    count: expiredNotifications.length,
    cutoff,
  })
}
