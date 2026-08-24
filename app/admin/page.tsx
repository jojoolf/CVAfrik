import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  FilePlus2,
  PenLine,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { AdminPostItem } from '@/components/admin/admin-post-item'
import { AdminOverviewLive } from '@/components/admin/admin-overview-live'
import { AdminMobileOverview } from '@/components/admin/admin-mobile-overview'

export default async function AdminPage() {
  const supabase = await createClient()
  const [userResult, recentPostsResult, logsResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('blog_posts').select('id, titre, categorie, publie, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('admin_logs').select('action, admin_email, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const user = userResult.data.user
  const posts = recentPostsResult.data || []
  const logs = logsResult.data || []
  const firstName = user?.user_metadata?.prenom || user?.user_metadata?.first_name || 'Admin'

  return (
    <>
      <AdminMobileOverview firstName={firstName} />
      <div className="admin-native-web min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/15 p-6 shadow-elevated sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Tableau de bord
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Bonjour, {firstName}.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Gère le contenu, observe la croissance de CVAfrik et garde une vue claire sur l’activité de la plateforme.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                <Link href="/admin/blog/nouveau"><FilePlus2 className="mr-2 h-4 w-4" /> Nouveau contenu</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-border bg-card font-bold text-foreground hover:bg-muted hover:text-foreground">
                <Link href="/admin/notifications"><BellRing className="mr-2 h-4 w-4" /> Publier une annonce</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-border bg-card font-bold text-foreground hover:bg-muted hover:text-foreground">
                <Link href="/admin/statistiques"><BarChart3 className="mr-2 h-4 w-4" /> Voir les statistiques</Link>
              </Button>
            </div>
          </div>
        </section>

        <AdminOverviewLive />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-black text-foreground">Contenu récent</h2>
                <p className="mt-1 text-xs text-muted-foreground">Derniers articles, offres et opportunités publiés.</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/admin/blog/nouveau">Créer <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {posts.map((post) => <AdminPostItem key={post.id} post={post} />)}
              {posts.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">Aucun contenu pour le moment.</div>}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <div className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /><h2 className="font-black text-foreground">Actions rapides</h2></div>
              <div className="mt-4 space-y-2">
                <AdminAction href="/admin/blog/nouveau" icon={PenLine} title="Publier un contenu" detail="Article, offre ou opportunité" />
                <AdminAction href="/admin/notifications" icon={BellRing} title="Publier une annonce" detail="Diffuser une notification aux comptes autorisés" />
                <AdminAction href="/admin/statistiques" icon={BarChart3} title="Consulter les statistiques" detail="Suivre les indicateurs de la plateforme" />
                <AdminAction href="/admin/logs" icon={ScrollText} title="Voir le journal" detail="Contrôler les actions administratives" />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Activité récente</p>
              <div className="mt-3 space-y-1">
                {logs.length ? logs.map((log) => (
                  <div key={`${log.created_at}-${log.action}`} className="flex items-center justify-between gap-3 border-b border-border/60 py-2 last:border-0">
                    <span className="truncate text-xs text-foreground">{log.action.replaceAll('_', ' ')}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(log.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                )) : <p className="py-3 text-sm text-muted-foreground">Aucune activité enregistrée.</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>
      </div>
    </>
  )
}

function AdminAction({ href, icon: Icon, title, detail }: { href: string; icon: typeof Activity; title: string; detail: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition hover:border-primary/50 hover:bg-primary/5">
      <span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0"><span className="block text-sm font-bold text-foreground">{title}</span><span className="block truncate text-xs text-muted-foreground">{detail}</span></span>
      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}
