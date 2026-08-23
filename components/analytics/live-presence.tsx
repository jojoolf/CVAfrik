'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

const HEARTBEAT_INTERVAL_MS = 60_000

export function LivePresence() {
  useEffect(() => {
    let active = true

    const heartbeat = async () => {
      if (!active) return
      try {
        await fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ platform: Capacitor.getPlatform() }),
        })
      } catch {
        // La présence est un indicateur non bloquant : aucune interaction utilisateur n’est interrompue.
      }
    }

    void heartbeat()
    const interval = window.setInterval(() => void heartbeat(), HEARTBEAT_INTERVAL_MS)
    const onFocus = () => void heartbeat()
    window.addEventListener('focus', onFocus)

    return () => {
      active = false
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return null
}
