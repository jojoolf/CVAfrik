'use client'

import { useEffect, useState } from 'react'
import { BellRing, CheckCircle2, Loader2, Mail, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { Capacitor } from '@capacitor/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { requestNativePushPermission } from '@/components/notifications/native-push-notifications'

type Preferences = {
  push_enabled: boolean
  email_enabled: boolean
  applications_enabled: boolean
  opportunities_enabled: boolean
  payments_enabled: boolean
  announcements_enabled: boolean
}

const initialPreferences: Preferences = {
  push_enabled: true,
  email_enabled: true,
  applications_enabled: true,
  opportunities_enabled: true,
  payments_enabled: true,
  announcements_enabled: true,
}

const options: Array<{ key: Exclude<keyof Preferences, 'push_enabled' | 'email_enabled'>; label: string; description: string }> = [
  { key: 'applications_enabled', label: 'Candidatures et rappels', description: 'Relances, entretiens et suivi de vos candidatures.' },
  { key: 'opportunities_enabled', label: 'Opportunités', description: 'Offres, stages, bourses et programmes sélectionnés.' },
  { key: 'payments_enabled', label: 'Paiements', description: 'Confirmations et informations importantes sur votre plan.' },
  { key: 'announcements_enabled', label: 'Actualités CVAfrik', description: 'Nouvelles fonctionnalités et annonces utiles.' },
]

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [permission, setPermission] = useState<'unknown' | 'granted' | 'denied' | 'web'>('unknown')
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    let active = true
    void fetch('/api/notifications/preferences', { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() : Promise.reject(new Error('Préférences indisponibles.')))
      .then((data) => { if (active) setPreferences({ ...initialPreferences, ...data.preferences }) })
      .catch(() => { if (active) toast.error('Impossible de charger les préférences de notifications.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const save = async (next: Preferences) => {
    setPreferences(next)
    setSaving(true)
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(next),
      })
      if (!response.ok) throw new Error('Mise à jour impossible.')
    } catch {
      toast.error('La mise à jour des préférences a échoué.')
    } finally {
      setSaving(false)
    }
  }

  const enablePush = async () => {
    setSaving(true)
    try {
      const result = await requestNativePushPermission()
      setPermission(result.state)
      if (result.state === 'granted') {
        await save({ ...preferences, push_enabled: true })
        toast.success('Les notifications sur ce téléphone sont activées.')
      } else if (result.state === 'denied') {
        toast.error('Autorisation refusée. Vous pouvez l’activer dans les réglages Android.')
      }
    } catch {
      toast.error('Les notifications ne peuvent pas être activées sur cet appareil.')
    } finally {
      setSaving(false)
    }
  }

  const sendTest = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Test indisponible.')
      if (data.pushSent > 0) {
        toast.success('Notification de test envoyée sur ce téléphone.')
      } else {
        toast.message('Test enregistré. Activez les notifications Android puis réessayez.')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Le test de notification a échoué.')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return <Card><CardContent className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Chargement des notifications…</CardContent></Card>
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground"><BellRing className="h-5 w-5" /></div>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choisissez les alertes utiles à votre carrière.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Notifications sur le téléphone</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isNative ? 'Recevez les rappels même lorsque CVAfrik est fermé.' : 'Disponibles dans l’application Android CVAfrik.'}
                </p>
              </div>
            </div>
            {isNative ? (
              <Button size="sm" disabled={saving || permission === 'granted'} onClick={() => void enablePush()}>
                {permission === 'granted' ? <><CheckCircle2 className="mr-2 h-4 w-4" />Activées</> : 'Activer'}
              </Button>
            ) : <span className="text-sm font-medium text-muted-foreground">Application Android requise</span>}
          </div>
          {isNative && (
            <Button variant="outline" size="sm" disabled={saving || testing} onClick={() => void sendTest()}>
              {testing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi…</> : 'Envoyer un test'}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary" /><div><p className="font-medium">E-mails de secours</p><p className="mt-1 text-sm text-muted-foreground">Recevez les alertes importantes aussi par e-mail.</p></div></div>
          <Switch checked={preferences.email_enabled} disabled={saving} onCheckedChange={(value) => void save({ ...preferences, email_enabled: value })} aria-label="Activer les e-mails de notifications" />
        </div>

        <div className="divide-y rounded-xl border">
          {options.map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-4 p-4">
              <div><p className="font-medium">{option.label}</p><p className="mt-1 text-sm text-muted-foreground">{option.description}</p></div>
              <Switch checked={preferences[option.key]} disabled={saving} onCheckedChange={(value) => void save({ ...preferences, [option.key]: value })} aria-label={`Activer ${option.label}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
