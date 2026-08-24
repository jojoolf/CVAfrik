'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bell, BriefcaseBusiness, CheckCheck, CreditCard, FileText, Loader2, Megaphone, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type InboxNotification = {
  id: string
  category: 'application' | 'opportunity' | 'payment' | 'announcement'
  title: string
  body: string
  href: string | null
  read_at: string | null
  created_at: string
}

const categoryMeta = {
  application: { label: 'Candidature', icon: FileText, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  opportunity: { label: 'Opportunité', icon: BriefcaseBusiness, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  payment: { label: 'Paiement', icon: CreditCard, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  announcement: { label: 'Annonce', icon: Megaphone, color: 'bg-primary/10 text-primary' },
}

function relativeDate(value: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours} h`
  if (hours < 48) return 'Hier'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

export function NotificationsInboxClient() {
  const [items, setItems] = useState<InboxNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const unread = useMemo(() => items.filter((item) => !item.read_at), [items])

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const response = await fetch('/api/notifications/inbox', { credentials: 'include', cache: 'no-store' })
      if (!response.ok) throw new Error(`Inbox unavailable (${response.status})`)
      const data = await response.json()
      setItems(Array.isArray(data.notifications) ? data.notifications : [])
    } catch (error) {
      console.error('[notifications/inbox/client]', error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const listener = () => void refresh()
    window.addEventListener('cvafrik:push-received', listener)
    return () => window.removeEventListener('cvafrik:push-received', listener)
  }, [refresh])

  const markRead = async (ids: string[]) => {
    if (!ids.length) return
    setItems((current) => current.map((item) => ids.includes(item.id) ? { ...item, read_at: new Date().toISOString() } : item))
    try {
      await fetch('/api/notifications/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      })
    } catch {
      // La liste reste disponible, même si le marquage lu est temporairement indisponible.
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Bell className="h-4 w-4" /> Centre de notifications</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Vos notifications</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Vos annonces, opportunités, paiements et rappels récents apparaissent ici.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading} className="rounded-xl">
              {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="mr-1.5 h-3.5 w-3.5" />}Actualiser
            </Button>
            {unread.length > 0 && <Button variant="secondary" size="sm" onClick={() => void markRead(unread.map((item) => item.id))} className="rounded-xl"><CheckCheck className="mr-1.5 h-3.5 w-3.5" />Tout lire</Button>}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Chargement de vos notifications…</p>
        </section>
      ) : loadError ? (
        <section className="rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><AlertTriangle className="h-6 w-6" /></span>
          <h2 className="mt-4 text-lg font-bold text-foreground">Impossible de charger les notifications</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Vérifiez votre connexion puis réessayez. Vos notifications ne sont pas perdues.</p>
          <Button className="mt-6 rounded-xl" onClick={() => void refresh()}><RotateCcw className="mr-2 h-4 w-4" />Réessayer</Button>
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bell className="h-6 w-6" /></span>
          <h2 className="mt-4 text-lg font-bold text-foreground">Aucune notification pour le moment</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Vos rappels, opportunités, paiements et annonces apparaîtront ici.</p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          {items.map((item, index) => {
            const meta = categoryMeta[item.category]
            const Icon = meta.icon
            return (
              <article key={item.id} className={`flex w-full items-start gap-3 px-4 py-4 sm:px-5 ${index > 0 ? 'border-t border-border/70' : ''} ${item.read_at ? '' : 'bg-primary/[0.035]'}`}>
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}><Icon className="h-4.5 w-4.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3"><span className="line-clamp-1 text-sm font-bold text-foreground">{item.title}</span><span className="whitespace-nowrap text-xs text-muted-foreground">{relativeDate(item.created_at)}</span></span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.body}</span>
                  <span className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary"><span className={`h-1.5 w-1.5 rounded-full ${item.read_at ? 'bg-muted-foreground/35' : 'bg-primary'}`} />{meta.label}{item.read_at ? ' · Lu' : ' · Non lu'}</span>
                </span>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
