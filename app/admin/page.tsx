import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Activity, ArrowUpRight, BarChart3, CreditCard, FileText, Mail, PenLine, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { AdminPostItem } from '@/components/admin/admin-post-item'

const ADMIN_EMAILS = ['nokejoel@gmail.com', 'jojoolf@gmail.com']

export default async function AdminPage() {
  const supabase = await createClient()
  const [userResult, usersResult, postsResult, subscribersResult, pendingResult, recentPostsResult, logsResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    supabase.from('manual_payments').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('admin_logs').select('action, admin_email, created_at').order('created_at', { ascending: false }).limit(4),
  ])

  const user = userResult.data.user
  const usersCount = usersResult.count || 0
  const postsCount = postsResult.count || 0
  const subscribersCount = subscribersResult.count || 0
  const pendingPaymentsCount = pendingResult.count || 0
  const posts = recentPostsResult.data || []
  const logs = logsResult.data || []
  const metrics = [
    { label: 'Utilisateurs', value: usersCount, detail: 'comptes inscrits', icon: Users, tone: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
    { label: 'Paiements en attente', value: pendingPaymentsCount, detail: pendingPaymentsCount ? 'à traiter maintenant' : 'aucune action urgente', icon: CreditCard, tone: pendingPaymentsCount ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Articles publiés', value: postsCount, detail: 'contenus dans le blog', icon: FileText, tone: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
    { label: 'Newsletter', value: subscribersCount, detail: 'abonnés actifs', icon: Mail, tone: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  ]
  const quickLinks: Array<{ href: string; label: string; detail: string; icon: typeof Activity }> = [
    { href: '/admin/statistiques', label: 'Statistiques', detail: 'Suivre les indicateurs clés', icon: BarChart3 },
    { href: '/admin/paiements', label: 'Paiements', detail: pendingPaymentsCount ? `${pendingPaymentsCount} demande(s) à traiter` : 'Tout est à jour', icon: CreditCard },
    { href: '/admin/logs', label: 'Journal d’activité', detail: 'Voir les dernières actions', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20 p-6 shadow-2xl sm:p-9">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary"><ShieldCheck className="h-4 w-4" /> Centre de contrôle</div>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Bonjour, {user?.user_metadata?.first_name || 'Admin'}.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Pilote les paiements, le contenu et la croissance de CVAfrik depuis un seul espace.</p>
            </div>
            <div className="flex flex-wrap gap-3"><Button asChild className="rounded-xl bg-primary font-black text-primary-foreground hover:bg-primary/90"><Link href="/admin/paiements"><CreditCard className="mr-2 h-4 w-4" /> Voir les paiements</Link></Button><Button asChild variant="outline" className="rounded-xl border-white/15 bg-white/5 font-bold text-white hover:bg-white/10 hover:text-white"><Link href="/admin/blog/nouveau"><PenLine className="mr-2 h-4 w-4" /> Nouvel article</Link></Button></div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-3xl font-black">{value.toLocaleString()}</p></div><div className={`rounded-xl p-3 ${tone}`}><Icon className="h-5 w-5" /></div></div><p className="mt-3 text-xs text-slate-500">{detail}</p></div>)}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><h2 className="font-black">Contenu récent</h2><p className="mt-1 text-xs text-slate-500">Les derniers articles et offres ajoutés.</p></div><Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary"><Link href="/admin/blog/nouveau">Ajouter <ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button></div><div className="divide-y divide-white/10">{posts.map(post => <AdminPostItem key={post.id} post={post} />)}{posts.length === 0 && <div className="p-10 text-center text-sm text-slate-500">Aucun contenu pour le moment.</div>}</div></section>
          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-5"><div className="flex items-center justify-between"><div><h2 className="font-black">Accès rapide</h2><p className="mt-1 text-xs text-slate-500">Les outils de gestion.</p></div><Activity className="h-5 w-5 text-primary" /></div><div className="mt-5 space-y-3">{quickLinks.map(({ href, label, detail, icon: ActionIcon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-primary/50 hover:bg-primary/5"><span className="rounded-lg bg-primary/10 p-2 text-primary"><ActionIcon className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-sm font-bold">{label}</span><span className="block truncate text-xs text-slate-500">{detail}</span></span><ArrowUpRight className="ml-auto h-4 w-4 text-slate-500" /></Link>)}</div><div className="mt-7 border-t border-white/10 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Activité récente</p>{logs.length ? logs.map(log => <div key={`${log.created_at}-${log.action}`} className="flex items-center justify-between gap-3 py-2 text-xs"><span className="truncate text-slate-300">{log.action.replaceAll('_', ' ')}</span><span className="shrink-0 text-slate-600">{new Date(log.created_at).toLocaleDateString('fr-FR')}</span></div>) : <p className="text-sm text-slate-600">Aucune activité enregistrée.</p>}</div></section>
        </div>
      </div>
    </div>
  )
}
