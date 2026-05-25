import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BookOpen, Briefcase, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Offres d\'emploi | CVAfrik',
  description: 'Découvrez nos derniers conseils carrière, offres d\'emploi et de stages en Afrique.',
}

const categories = [
  { id: 'all', label: 'Tous', icon: Sparkles },
  { id: 'offres-emploi', label: 'Offres d\'emploi', icon: Briefcase },
  { id: 'stages', label: 'Stages', icon: GraduationCap },
  { id: 'conseils', label: 'Conseils', icon: BookOpen },
]

function getCategoryMeta(cat: string) {
  switch (cat) {
    case 'offres-emploi':
      return { label: 'Offre d\'emploi', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' }
    case 'stages':
      return { label: 'Stage', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' }
    default:
      return { label: 'Conseils', color: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800' }
  }
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publie', true)
    .order('created_at', { ascending: false })

  const featured = posts?.[0]
  const remaining = posts?.slice(1) || []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-primary/[0.03] to-background pb-16 pt-20 lg:pt-28">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative container mx-auto px-4 max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Actualités & Conseils
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Notre <span className="text-primary">Blog</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Conseils carrière, actualités RH et les meilleures offres d&apos;emploi et de stages sélectionnées pour vous en Afrique.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10 pb-20">
          {/* Featured article */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block mb-12">
              <Card className="overflow-hidden border-border/50 shadow-elegant hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.titre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className={`font-semibold px-3 py-1 bg-background/90 backdrop-blur-sm ${getCategoryMeta(featured.categorie).color}`}>
                        {getCategoryMeta(featured.categorie).label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-8">
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(new Date(featured.created_at), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors lg:text-3xl">
                      {featured.titre}
                    </h2>
                    <p className="mt-3 text-muted-foreground line-clamp-3">
                      {featured.contenu.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                    </p>
                    <div className="mt-6 flex items-center text-primary font-medium">
                      Lire l&apos;article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Category pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {remaining.length > 0 || !featured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(remaining.length > 0 ? remaining : posts || []).map((post) => {
                const cat = getCategoryMeta(post.categorie)
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                    <Card className="h-full flex flex-col overflow-hidden border-border/50 shadow-elegant hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                      <div className="aspect-video w-full overflow-hidden relative">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className={`font-semibold px-2.5 py-0.5 text-[11px] bg-background/90 backdrop-blur-sm ${cat.color}`}>
                            {cat.label}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="flex-1 p-5">
                        <p className="text-xs text-muted-foreground mb-2">
                          {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.titre}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {post.contenu.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter className="border-t border-border px-5 py-4">
                        <span className="text-primary text-sm font-medium flex items-center group-hover:underline underline-offset-4">
                          Lire la suite <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-elegant">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Aucun article pour le moment</h2>
              <p className="text-muted-foreground mt-2">Revenez bientôt pour découvrir nos premiers conseils et offres d&apos;emploi !</p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 lg:p-12">
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="relative mx-auto max-w-xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Restez informé
              </Badge>
              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                Ne manquez aucun article
              </h2>
              <p className="mt-3 text-muted-foreground">
                Recevez chaque semaine nos derniers conseils carrière et offres d&apos;emploi directement dans votre boîte mail.
              </p>
              <div className="mt-6 flex max-w-md mx-auto gap-3">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  className="h-11 rounded-xl bg-background"
                />
                <Button className="h-11 rounded-xl shrink-0">
                  S&apos;abonner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
