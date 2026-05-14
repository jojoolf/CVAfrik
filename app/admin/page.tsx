import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, Mail } from 'lucide-react'
import Link from 'next/link'

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
    .eq('status', 'en_attente')

  // Get recent posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Panel Administrateur</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="border-amber-500 text-amber-700 hover:bg-amber-50">
            <Link href="/admin/paiements">
              Gérer les Paiements
              {pendingPaymentsCount ? <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingPaymentsCount}</span> : null}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/nouveau">Écrire un article</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles & Offres</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subsCount || 0}</div>
          </CardContent>
        </Card>
        <Card className={pendingPaymentsCount ? "border-amber-400 bg-amber-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingPaymentsCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Derniers Articles / Offres</h2>
        <Card>
          <div className="divide-y">
            {posts?.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div>
                  <p className="font-semibold">{post.titre}</p>
                  <p className="text-sm text-slate-500">Catégorie: {post.categorie} | État: {post.publie ? '🟢 Publié' : '⚪ Brouillon'}</p>
                </div>
                {/* Plus tard on pourra ajouter un bouton Éditer */}
              </div>
            ))}
            {(!posts || posts.length === 0) && (
              <div className="p-4 text-center text-slate-500">Aucun article n'a encore été écrit.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
