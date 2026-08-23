'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Banknote, BellRing, CalendarClock, CheckCircle2, CircleDollarSign, FileText, Globe2, Loader2, Mail, MapPinned, RefreshCw, Sparkles, UserCheck, Users, Workflow } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WorldActivityMap } from '@/components/admin/world-activity-map'

type CountryMetric = { country: string; users: number }
type Analytics = {
  generatedAt: string
  refreshAfterSeconds: number
  accounts: { total: number; createdToday: number; createdYesterday: number; paidActive: number; online: number }
  subscriptions: { today: number; yesterday: number; expiringTomorrow: number; expiringNext7Days: number }
  revenue: { today: number; yesterday: number; thisMonth: number }
  audience: { newsletterSubscribers: number; newsletterOpenTracking: string; blogPostsPublished: number; blogViewTracking: string }
  production: { cvsThisMonth: number; lettersThisMonth: number; applicationsThisMonth: number }
  countries: CountryMetric[]
  onlineByCountry: CountryMetric[]
  recentAccounts: Array<{ id: string; email: string; prenom: string | null; nom: string | null; pays: string | null; plan: string | null; created_at: string; last_seen_at: string | null }>
}

const countryName = (code: string) => {
  if (code === 'Non renseigné') return code
  try { return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code) || code } catch { return code }
}

const currency = (value: number) => `${value.toLocaleString('fr-FR')} FCFA`

function MetricCard({ label, value, detail, icon: Icon, tone = 'primary' }: { label: string; value: string | number; detail: string; icon: typeof Users; tone?: 'primary' | 'emerald' | 'sky' | 'violet' | 'amber' }) {
  const styles = {
    primary: 'bg-primary/10 text-primary ring-primary/20', emerald: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20', sky: 'bg-sky-400/10 text-sky-300 ring-sky-400/20', violet: 'bg-violet-400/10 text-violet-300 ring-violet-400/20', amber: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  }
  return <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-2xl font-black text-white">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div><span className={`rounded-xl p-3 ring-1 ${styles[tone]}`}><Icon className="h-5 w-5" /></span></div></CardContent></Card>
}

export default function AdminStatsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const response = await fetch('/api/admin/analytics', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Les données sont indisponibles.')
      setAnalytics(payload)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Les données sont indisponibles.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void load()
    const refresh = window.setInterval(() => void load(true), 30_000)
    return () => window.clearInterval(refresh)
  }, [])

  const subscriptionChart = useMemo(() => analytics ? [
    { name: 'Hier', souscriptions: analytics.subscriptions.yesterday, ca: analytics.revenue.yesterday },
    { name: "Aujourd’hui", souscriptions: analytics.subscriptions.today, ca: analytics.revenue.today },
  ] : [], [analytics])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (!analytics) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300"><p>{error || 'Chargement impossible.'}</p><Button onClick={() => void load()}>Réessayer</Button></div>

  const lastUpdate = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(analytics.generatedAt))

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-primary"><ArrowLeft className="h-4 w-4" /> Retour à Mon application Admin</Link>
        <header className="relative mt-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20 p-6 shadow-2xl sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Pilotage en direct</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">La santé de CVAfrik, en un regard.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Les chiffres proviennent directement des comptes, paiements, abonnements et activités CVAfrik. La page se rafraîchit automatiquement toutes les 30 secondes.</p></div><div className="flex flex-wrap items-center gap-3"><div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3"><p className="flex items-center gap-2 text-sm font-bold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Données en direct</p><p className="mt-1 text-xs text-emerald-100/60">Actualisées à {lastUpdate}</p></div><Button variant="outline" size="sm" disabled={refreshing} onClick={() => void load(true)} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">{refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Actualiser</Button></div></div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Comptes créés" value={analytics.accounts.total.toLocaleString('fr-FR')} detail={`+${analytics.accounts.createdToday} aujourd’hui · +${analytics.accounts.createdYesterday} hier`} icon={Users} tone="sky" />
          <MetricCard label="Connectés maintenant" value={analytics.accounts.online.toLocaleString('fr-FR')} detail="Actifs au cours des 5 dernières minutes" icon={UserCheck} tone="emerald" />
          <MetricCard label="Abonnés actifs" value={analytics.accounts.paidActive.toLocaleString('fr-FR')} detail={`${analytics.subscriptions.expiringTomorrow} échéance(s) demain`} icon={CheckCircle2} tone="violet" />
          <MetricCard label="CA aujourd’hui" value={currency(analytics.revenue.today)} detail={`${analytics.subscriptions.today} souscription(s) validée(s)`} icon={CircleDollarSign} tone="primary" />
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Souscriptions hier" value={analytics.subscriptions.yesterday} detail={currency(analytics.revenue.yesterday)} icon={CalendarClock} tone="amber" />
          <MetricCard label="Échéances à venir" value={analytics.subscriptions.expiringNext7Days} detail="Dans les 7 prochains jours" icon={CalendarClock} tone="primary" />
          <MetricCard label="Newsletter" value={analytics.audience.newsletterSubscribers.toLocaleString('fr-FR')} detail="Abonnés inscrits" icon={Mail} tone="violet" />
          <MetricCard label="CA du mois" value={currency(analytics.revenue.thisMonth)} detail="Paiements validés automatiquement et manuellement" icon={Banknote} tone="emerald" />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><MapPinned className="h-5 w-5 text-primary" /> Répartition mondiale des comptes</CardTitle><CardDescription>Le pays provient du profil ou du pays approximatif de dernière activité. Aucune adresse IP complète ni position précise n’est enregistrée.</CardDescription></CardHeader><CardContent><WorldActivityMap countries={analytics.countries} onlineByCountry={analytics.onlineByCountry} /></CardContent></Card>
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><Globe2 className="h-5 w-5 text-primary" /> Pays les plus présents</CardTitle><CardDescription>Comptes créés, avec activité en ligne quand disponible.</CardDescription></CardHeader><CardContent className="space-y-3">{analytics.countries.length ? analytics.countries.map((item, index) => <div key={item.country} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="flex items-center justify-between gap-3"><p className="font-bold text-slate-100">{index + 1}. {countryName(item.country)}</p><span className="text-sm font-black text-primary">{item.users}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, item.users / Math.max(...analytics.countries.map((country) => country.users)) * 100)}%` }} /></div></div>) : <p className="py-8 text-center text-sm text-slate-500">Les pays s’afficheront au fil des comptes créés.</p>}</CardContent></Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><Workflow className="h-5 w-5 text-primary" /> Souscriptions : aujourd’hui et hier</CardTitle><CardDescription>Les souscriptions validées se mettent à jour dès la réception d’un paiement confirmé.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={subscriptionChart}><CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} /><Bar dataKey="souscriptions" name="Souscriptions" fill="#f97316" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><FileText className="h-5 w-5 text-primary" /> Production et audience</CardTitle><CardDescription>Indicateurs de création cumulés sur le mois en cours.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">CV générés</p><p className="mt-2 text-2xl font-black">{analytics.production.cvsThisMonth}</p></div><div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Lettres créées</p><p className="mt-2 text-2xl font-black">{analytics.production.lettersThisMonth}</p></div><div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidatures suivies</p><p className="mt-2 text-2xl font-black">{analytics.production.applicationsThisMonth}</p></div><div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Articles publiés</p><p className="mt-2 text-2xl font-black">{analytics.audience.blogPostsPublished}</p></div><div className="sm:col-span-2 rounded-xl border border-dashed border-white/15 bg-slate-950/50 p-4 text-sm text-slate-400"><BellRing className="mr-2 inline h-4 w-4 text-primary" /><strong className="text-slate-200">Newsletter :</strong> {analytics.audience.newsletterOpenTracking}. Les ouvertures et clics seront alimentés par le webhook Resend, sans estimation artificielle.</div></CardContent></Card>
        </div>

        <Card className="mt-6 border-white/10 bg-slate-900/80 shadow-xl shadow-black/10"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><Users className="h-5 w-5 text-primary" /> Derniers comptes créés</CardTitle><CardDescription>Vue réservée à l’administration pour comprendre l’adoption de CVAfrik.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">Compte</th><th className="px-3 py-3">Pays</th><th className="px-3 py-3">Plan</th><th className="px-3 py-3">Créé le</th><th className="px-3 py-3">Dernière activité</th></tr></thead><tbody>{analytics.recentAccounts.map((account) => <tr key={account.id} className="border-b border-white/5 text-slate-300 last:border-0"><td className="px-3 py-3"><p className="font-semibold text-white">{[account.prenom, account.nom].filter(Boolean).join(' ') || 'Utilisateur CVAfrik'}</p><p className="mt-0.5 text-xs text-slate-500">{account.email}</p></td><td className="px-3 py-3">{account.pays ? countryName(account.pays) : 'Non renseigné'}</td><td className="px-3 py-3"><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{account.plan || 'gratuit'}</span></td><td className="px-3 py-3">{new Date(account.created_at).toLocaleDateString('fr-FR')}</td><td className="px-3 py-3 text-slate-400">{account.last_seen_at ? new Date(account.last_seen_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Pas encore enregistré'}</td></tr>)}</tbody></table></CardContent></Card>
      </div>
    </div>
  )
}
