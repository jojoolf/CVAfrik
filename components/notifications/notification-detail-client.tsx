'use client'

import { useEffect } from 'react'
import { ArrowLeft, BriefcaseBusiness, CreditCard, ExternalLink, FileText, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Notification = {
  id: string
  category: string
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
  announcement: { label: 'Annonce importante', icon: Megaphone, color: 'bg-primary/10 text-primary' },
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date non disponible'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', hour: '2-digit', minute: '2-digit' }).format(date)
}

export function NotificationDetailClient({ notification, onBack }: { notification: Notification; onBack: () => void }) {
  const meta = categoryMeta[notification.category as keyof typeof categoryMeta] ?? categoryMeta.announcement
  const Icon = meta.icon
  const internalHref = typeof notification.href === 'string' && notification.href.startsWith('/') && !notification.href.startsWith('//') ? notification.href : null

  useEffect(() => {
    if (notification.read_at) return
    void fetch('/api/notifications/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids: [notification.id] }),
    }).catch(() => undefined)
  }, [notification.id, notification.read_at])

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
      <Button variant="ghost" size="sm" className="w-fit rounded-xl px-2 text-muted-foreground" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux notifications
      </Button>

      <article className="mt-5 flex flex-1 flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${meta.color}`}><Icon className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">{meta.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatDate(notification.created_at)}</p>
          </div>
        </div>

        <div className="mt-8 flex-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{notification.title || 'Notification CVAfrik'}</h1>
          <div className="mt-6 border-t border-border pt-6">
            <p className="whitespace-pre-wrap text-[1.05rem] leading-8 text-foreground/90">{notification.body || 'Aucun détail supplémentaire.'}</p>
          </div>
        </div>

        {internalHref && (
          <Button asChild className="mt-10 h-12 w-full rounded-2xl text-base font-black shadow-lg shadow-primary/20">
            <Link href={internalHref}>Voir le contenu associé <ExternalLink className="ml-2 h-4 w-4" /></Link>
          </Button>
        )}
      </article>
    </div>
  )
}
