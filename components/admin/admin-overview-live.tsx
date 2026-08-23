'use client'

import { useEffect, useState } from 'react'
import { Activity, Banknote, CheckCircle2, Globe2, Loader2, RefreshCw, UserCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CountryMetric = { country: string; users: number }
type OverviewAnalytics = {
  generatedAt: string
  refreshAfterSeconds: number
  accounts: { total: number; createdToday: number; createdYesterday: number; paidActive: number; online: number }
  subscriptions: { today: number; yesterday: number; expiringTomorrow: number; expiringNext7Days: number }
  revenue: { today: number; yesterday: number; thisMonth: number }
  audience: { newsletterSubscribers: number; blogPostsPublished: number }
  onlineByCountry: CountryMetric[]
  recentAccounts: Array<{ id: string; email: string; prenom: string | null; nom: string | null; pays: string | null; created_at: string }>
}

const countryName = (code: string) => {
  if (code === 'Non renseigné') return code
  try { return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code) || code } catch { return code }
}

function LiveMetric({ label, value, detail, icon: Icon, tone = 'primary' }: { label: string; value: string | number; detail: string; icon: typeof Users; tone?: 'primary' | 'emerald' | 'sky' | 'violet' }) {
  const toneClass = {
    primary: 'bg-primary/10 text-primary ring-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
    sky: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300',
    violet: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
  }
  return <article className="rounded-2xl border border-border bg-card p-5 shadow-elegant"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-black text-foreground">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div><span className={`rounded-xl p-3 ring-1 ${toneClass[tone]}`}><Icon className="h-5 w-5" /></span></div></article>
}

export function AdminOverviewLive() {
  const [analytics, setAnalytics] = useState<OverviewAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = async (silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Données indisponibles.')
      setAnalytics(payload)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Données indisponibles.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(true), 15_000)
    const onFocus = () => void load(true)
    window.addEventListener('focus', onFocus)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', onFocus) }
  }, [])

  if (loading) return <div className="flex min-h-44 items-center justify-center rounded-2xl border border-border bg-card"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
  if (!analytics) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"><p>{error}</p><Button variant="outline" size="sm" className="mt-3" onClick={() => void load()}>Réessayer</Button></div>

  const updateTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(analytics.generatedAt))
  const onlineCountries = analytics.onlineByCountry.slice(0, 3)

  return <section className="mt-6 space-y-5" aria-live="polite">
    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="flex items-center gap-2 text-sm font-black text-emerald-800 dark:text-emerald-200"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" /> Activité en direct</p><p className="mt-1 text-xs text-emerald-800/70 dark:text-emerald-100/70">Les connexions et chiffres sont actualisés toutes les 15 secondes. Un compte est considéré en ligne s’il a été actif au cours des 75 dernières secondes.</p></div>
      <Button variant="outline" size="sm" disabled={refreshing} onClick={() => void load(true)} className="border-emerald-500/30 bg-background/70 text-foreground hover:bg-background">{refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Actualiser</Button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <LiveMetric label="Connectés maintenant" value={analytics.accounts.online} detail="Actifs sur CVAfrik à l’instant" icon={UserCheck} tone="emerald" />
      <LiveMetric label="Comptes créés" value={analytics.accounts.total.toLocaleString('fr-FR')} detail={`+${analytics.accounts.createdToday} aujourd’hui`} icon={Users} tone="sky" />
      <LiveMetric label="Souscriptions du jour" value={analytics.subscriptions.today} detail={`${analytics.subscriptions.expiringTomorrow} échéance(s) demain`} icon={CheckCircle2} tone="violet" />
      <LiveMetric label="CA aujourd’hui" value={`${analytics.revenue.today.toLocaleString('fr-FR')} FCFA`} detail={`${analytics.audience.newsletterSubscribers} abonnés newsletter`} icon={Banknote} />
    </div>

    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-elegant"><div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-2 font-black text-foreground"><Activity className="h-4 w-4 text-primary" /> Comptes connectés</p><p className="mt-1 text-xs text-muted-foreground">Présence active par pays.</p></div><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{analytics.accounts.online} en ligne</span></div><div className="mt-4 space-y-2">{onlineCountries.length ? onlineCountries.map((item) => <div key={item.country} className="flex items-center justify-between rounded-xl bg-muted/55 px-3 py-2 text-sm"><span className="flex items-center gap-2 font-medium text-foreground"><Globe2 className="h-4 w-4 text-primary" />{countryName(item.country)}</span><span className="font-black text-primary">{item.users}</span></div>) : <p className="rounded-xl bg-muted/55 p-4 text-sm text-muted-foreground">Aucun compte actif au cours des 75 dernières secondes.</p>}</div></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-elegant"><div><p className="font-black text-foreground">Derniers comptes créés</p><p className="mt-1 text-xs text-muted-foreground">Mise à jour en direct.</p></div><div className="mt-4 space-y-2">{analytics.recentAccounts.slice(0, 3).map((account) => <div key={account.id} className="rounded-xl bg-muted/55 px-3 py-2"><p className="text-sm font-bold text-foreground">{[account.prenom, account.nom].filter(Boolean).join(' ') || account.email}</p><p className="mt-0.5 text-xs text-muted-foreground">{account.pays || 'Pays non renseigné'} · {new Date(account.created_at).toLocaleDateString('fr-FR')}</p></div>)}</div></section>
    </div>
    <p className="text-right text-xs text-muted-foreground">Dernière synchronisation : {updateTime}</p>
  </section>
}
