import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin/access'
import { sendUserNotification, type NotificationCategory } from '@/lib/notifications/send'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const allowedCategories: NotificationCategory[] = ['announcement', 'opportunity']
const MAX_RECIPIENTS_PER_REQUEST = 5_000
const DELIVERY_BATCH_SIZE = 10

function isSafeInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

export async function GET() {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })

    const supabase = createAdminClient()
    const { count, error } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    if (error) throw error

    return NextResponse.json({ audienceCount: count || 0 })
  } catch (error) {
    console.error('[admin/notifications/audience]', error)
    return NextResponse.json({ error: 'Audience indisponible.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })

    const raw = await request.json()
    const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 180) : ''
    const body = typeof raw.body === 'string' ? raw.body.trim().slice(0, 600) : ''
    const category = allowedCategories.includes(raw.category) ? raw.category : null
    const href = isSafeInternalPath(raw.href) ? raw.href.slice(0, 500) : null

    if (!title || !body || !category) {
      return NextResponse.json({ error: 'Le titre, le message et une catégorie valide sont obligatoires.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: recipients, error: recipientsError } = await supabase
      .from('profiles')
      .select('id,email')
      .limit(MAX_RECIPIENTS_PER_REQUEST)
    if (recipientsError) throw recipientsError

    const summary = { total: recipients?.length || 0, inbox: 0, push: 0, email: 0, skipped: 0 }
    for (let index = 0; index < (recipients?.length || 0); index += DELIVERY_BATCH_SIZE) {
      const batch = recipients!.slice(index, index + DELIVERY_BATCH_SIZE)
      const results = await Promise.all(batch.map((recipient) => sendUserNotification({
        userId: recipient.id,
        recipientEmail: recipient.email,
        category,
        title,
        body,
        href,
      })))
      for (const result of results) {
        if (result.skipped) {
          summary.skipped += 1
          continue
        }
        summary.inbox += 1
        summary.push += result.pushSent
        summary.email += result.emailSent ? 1 : 0
      }
    }

    await supabase.from('admin_logs').insert({
      admin_email: admin.email!,
      action: 'notification_diffusee',
      details: {
        category,
        audience: summary.total,
        inbox: summary.inbox,
        push: summary.push,
        email: summary.email,
        skipped: summary.skipped,
      },
    })

    return NextResponse.json({ success: true, summary })
  } catch (error) {
    console.error('[admin/notifications/broadcast]', error)
    return NextResponse.json({ error: 'La diffusion de notification a échoué.' }, { status: 500 })
  }
}
