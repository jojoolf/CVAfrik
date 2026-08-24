'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BellRing, BriefcaseBusiness, CheckCircle2, CircleDollarSign, Loader2, Megaphone, PanelsTopLeft, RefreshCw, UserCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Analytics = {
  accounts: { total: number; createdToday: number; online: number }
  subscriptions: { today: number }
  revenue: { today: number }
}

const quickActions = [
  { href: '/admin/bannieres', label: 'Bannières', description: 'Carrousel APK', icon: PanelsTopLeft, tone: 'bg-orange-500/10 text-orange-600 dark:text-orange-300' },
  { href: '/admin/campagnes', label: 'Campagnes', description: 'Affiches in-app', icon: Megaphone, tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  { href: '/admin/notifications', label: 'Notifications', description: 'Annonces', icon: BellRing, tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' },
  { href: '/admin/opportunites', label: 'Opportunités', description: 'Offres publiées', icon: BriefcaseBusiness, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
]

export function AdminMobileOverview({ firstName }: { firstName: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics', { cache: 'no-store' })
      const data = await response.json() as Analytics
      if (response.ok) setAnalytics(data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(true), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = [
    { label: 'En ligne', value: analytics?.accounts.online ?? '—', detail: 'maintenant', icon: UserCheck, tone: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-500/10' },
    { label: 'Comptes', value: analytics?.accounts.total ?? '—', detail: `+${analytics?.accounts.createdToday ?? 0} aujourd’hui`, icon: Users, tone: 'text-sky-600 dark:text-sky-300', bg: 'bg-sky-500/10' },
    { label: 'Abonnements', value: analytics?.subscriptions.today ?? '—', detail: 'aujourd’hui', icon: CheckCircle2, tone: 'text-violet-600 dark:text-violet-300', bg: 'bg-violet-500/10' },
    { label: 'CA du jour', value: analytics ? `${analytics.revenue.today.toLocaleString('fr-FR')} F` : '—', detail: 'FCFA', icon: CircleDollarSign, tone: 'text-orange-600 dark:text-orange-300', bg: 'bg-orange-500/10' },
  ]

  return <div className="admin-native-mobile mx-auto max-w-lg space-y-5 px-4 pb-7 pt-5">
    <header className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">Administration</p><h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">Bonjour, {firstName}</h1><p className="mt-1 text-sm text-muted-foreground">Pilote CVAfrik depuis ton téléphone.</p></div><Button type="button" variant="outline" size="icon" onClick={() => void load(true)} disabled={refreshing} aria-label="Actualiser les données" className="shrink-0 rounded-xl">{refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</Button></header>

    <section className="grid grid-cols-2 gap-3" aria-label="Indicateurs rapides">{metrics.map((metric) => { const Icon = metric.icon; return <article key={metric.label} className="rounded-2xl border border-border bg-card p-3 shadow-sm"><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">{metric.label}</p><p className="mt-2 text-2xl font-black tracking-tight text-foreground">{loading ? '…' : metric.value}</p><p className="mt-1 text-[11px] text-muted-foreground">{metric.detail}</p></div><span className={cn('grid h-8 w-8 place-items-center rounded-xl', metric.bg, metric.tone)}><Icon className="h-4 w-4" /></span></div></article> })}</section>

    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black text-foreground">Gérer l’application</h2><span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">Actualisé en direct</span></div><div className="grid grid-cols-2 gap-3">{quickActions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="rounded-2xl border border-border bg-card p-3 shadow-sm transition active:scale-[0.97]"><span className={cn('grid h-9 w-9 place-items-center rounded-xl', action.tone)}><Icon className="h-4 w-4" /></span><span className="mt-3 block text-sm font-black text-foreground">{action.label}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{action.description}</span></Link> })}</div></section>

    <Link href="/admin/statistiques" className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-foreground transition active:scale-[0.98]"><span>Voir les statistiques complètes</span><span className="text-primary">→</span></Link>
  </div>
}
