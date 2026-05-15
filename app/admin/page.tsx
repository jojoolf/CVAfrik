import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, Mail } from 'lucide-react'
import Link from 'next/link'
import { AdminPostItem } from '@/components/admin/admin-post-item'

export default async function AdminPage() {
  const supabase = await createClient()

  // Get stats
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: postsCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true })
  const { count: subsCount } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })
  
  // Get pending payments count
  const { count: pendingPaymentsCount } = await supabase
    .from('manual_payments')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'en_attente')

  // Get recent posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Panel Administrateur</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30">
            <Link href="/admin/paiements">
              Gérer les Paiements
              {pendingPaymentsCount ? <span className="ml-2 bg-amber-500 text-amber-950 text-xs px-2 py-0.5 rounded-full font-black">{pendingPaymentsCount}</span> : null}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/nouveau">Écrire un article</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles & Offres</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subsCount || 0}</div>
          </CardContent>
        </Card>
        <Card className={pendingPaymentsCount ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-lg shadow-amber-500/5" : "bg-card text-card-foreground border-border"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{pendingPaymentsCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-black mb-4 text-foreground/80 uppercase tracking-widest text-xs">Derniers Articles / Offres</h2>
        <Card className="bg-card text-card-foreground overflow-hidden border-border shadow-sm">
          <div className="divide-y divide-border">
            {posts?.map(post => (
              <AdminPostItem key={post.id} post={post} />
            ))}
            {(!posts || posts.length === 0) && (
              <div className="p-8 text-center text-muted-foreground">Aucun article n'a encore été écrit.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
