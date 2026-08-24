import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { getFirebaseMessaging } from '@/lib/notifications/firebase-admin'

export type NotificationCategory = 'application' | 'opportunity' | 'payment' | 'announcement'

type NotificationInput = {
  userId: string
  recipientEmail?: string | null
  category: NotificationCategory
  title: string
  body: string
  href?: string | null
}

type NotificationPreferences = {
  push_enabled: boolean
  email_enabled: boolean
  applications_enabled: boolean
  opportunities_enabled: boolean
  payments_enabled: boolean
  announcements_enabled: boolean
}

const defaultPreferences: NotificationPreferences = {
  push_enabled: true,
  email_enabled: true,
  applications_enabled: true,
  opportunities_enabled: true,
  payments_enabled: true,
  announcements_enabled: true,
}

const categoryPreferenceKey: Record<NotificationCategory, keyof Pick<NotificationPreferences, 'applications_enabled' | 'opportunities_enabled' | 'payments_enabled' | 'announcements_enabled'>> = {
  application: 'applications_enabled',
  opportunity: 'opportunities_enabled',
  payment: 'payments_enabled',
  announcement: 'announcements_enabled',
}

function sanitizeInternalHref(value: string | null | undefined) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]!)
}

async function sendEmailFallback(input: NotificationInput, href: string | null) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const email = input.recipientEmail?.trim()
  if (!apiKey || !from || !email) return false

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://cv-afrik.vercel.app').replace(/\/$/, '')
  const destination = href ? `${appUrl}${href}` : appUrl
  const safeTitle = escapeHtml(input.title)
  const safeBody = escapeHtml(input.body)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: input.title,
        text: `${input.body}\n\nOuvrir CVAfrik : ${destination}`,
        html: `<main style="font-family:Arial,sans-serif;line-height:1.55;color:#171717"><h2>${safeTitle}</h2><p>${safeBody}</p><p><a href="${destination}">Ouvrir CVAfrik</a></p></main>`,
      }),
    })
    return response.ok
  } catch {
    console.error('[notifications/email] Envoi de secours impossible.')
    return false
  }
}

function invalidTokenError(code: string | undefined) {
  return code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token'
}

export async function sendUserNotification(input: NotificationInput) {
  const supabase = createAdminClient()
  const href = sanitizeInternalHref(input.href)
  const title = input.title.trim().slice(0, 180)
  const body = input.body.trim().slice(0, 600)

  if (!title || !body) {
    throw new Error('Une notification doit contenir un titre et un message.')
  }

  const { data: storedPreferences, error: preferencesError } = await supabase
    .from('notification_preferences')
    .select('push_enabled,email_enabled,applications_enabled,opportunities_enabled,payments_enabled,announcements_enabled')
    .eq('user_id', input.userId)
    .maybeSingle()
  if (preferencesError) throw preferencesError

  const preferences: NotificationPreferences = { ...defaultPreferences, ...(storedPreferences ?? {}) }
  if (!preferences[categoryPreferenceKey[input.category]]) {
    return { skipped: true, notificationId: null, pushSent: 0, emailSent: false }
  }

  const { data: notification, error: notificationError } = await supabase
    .from('user_notifications')
    .insert({
      user_id: input.userId,
      category: input.category,
      title,
      body,
      href,
    })
    .select('id')
    .single()
  if (notificationError) throw notificationError

  let pushSent = 0
  if (preferences.push_enabled) {
    const { data: devices, error: devicesError } = await supabase
      .from('push_devices')
      .select('id,token')
      .eq('user_id', input.userId)
      .eq('is_active', true)
    if (devicesError) throw devicesError

    if (devices?.length) {
      try {
        const messaging = getFirebaseMessaging()
        const deliveries = await Promise.all(devices.map(async (device) => {
          try {
            await messaging.send({
              token: device.token,
              notification: { title, body },
              data: {
                category: input.category,
                href: `/notifications?open=${notification.id}`,
              },
              android: {
                priority: 'high',
                notification: {
                  channelId: 'cvafrik_general',
                  icon: 'ic_stat_cvafrik',
                  color: '#F97316',
                },
              },
            })
            return { id: device.id, delivered: true }
          } catch (error) {
            const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : undefined
            if (invalidTokenError(code)) {
              await supabase.from('push_devices').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', device.id)
            }
            console.error('[notifications/push] Remise Android impossible.', code || 'unknown')
            return { id: device.id, delivered: false }
          }
        }))
        pushSent = deliveries.filter((delivery) => delivery.delivered).length
      } catch {
        console.error('[notifications/push] Service Firebase indisponible.')
      }
    }
  }

  const emailSent = preferences.email_enabled ? await sendEmailFallback(input, href) : false
  if (pushSent > 0 || emailSent) {
    await supabase.from('user_notifications').update({ delivered_at: new Date().toISOString() }).eq('id', notification.id)
  }

  return { skipped: false, notificationId: notification.id, pushSent, emailSent }
}
