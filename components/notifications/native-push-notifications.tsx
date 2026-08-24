'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'

function isSafeInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

async function persistToken(token: string) {
  await fetch('/api/notifications/device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, platform: Capacitor.getPlatform() }),
  })
}

export async function requestNativePushPermission() {
  if (!Capacitor.isNativePlatform()) {
    return { state: 'web' as const }
  }

  let permission = await PushNotifications.checkPermissions()
  if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
    permission = await PushNotifications.requestPermissions()
  }

  if (permission.receive !== 'granted') {
    return { state: 'denied' as const }
  }

  await PushNotifications.createChannel({
    id: 'cvafrik_general',
    name: 'CVAfrik',
    description: 'Rappels, opportunités et actualités de votre carrière',
    importance: 4,
    visibility: 1,
    vibration: true,
    lights: true,
    lightColor: '#F97316',
  })
  await PushNotifications.register()
  return { state: 'granted' as const }
}

export function NativePushNotifications() {
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listeners = [
      PushNotifications.addListener('registration', (token) => {
        void persistToken(token.value)
      }),
      PushNotifications.addListener('registrationError', (error) => {
        console.error('[notifications/registration]', error.error)
      }),
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        window.dispatchEvent(new CustomEvent('cvafrik:push-received', { detail: notification }))
      }),
      PushNotifications.addListener('pushNotificationActionPerformed', ({ notification }) => {
        const href = notification.data?.href ?? notification.data?.path
        if (!isSafeInternalPath(href)) return

        // Une navigation interne évite de recharger toute la WebView Android,
        // qui pouvait afficher « This page couldn't load » après un clic push.
        window.setTimeout(() => router.push(href), 120)
      }),
    ]

    return () => {
      void Promise.all(listeners.map(async (listener) => (await listener).remove()))
    }
  }, [router])

  return null
}
