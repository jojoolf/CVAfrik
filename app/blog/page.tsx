import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BookOpen, Briefcase, GraduationCap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Offres d\'emploi | CVAfrik',
  description: 'Découvrez nos derniers conseils carrière, offres d\'emploi et de stages en Afrique.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch only published posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publie', true)
    .order('created_at', { ascending: false })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'offres-emploi': return <Briefcase className="h-4 w-4 mr-1" />
      case 'stages': return <GraduationCap className="h-4 w-4 mr-1" />
      default: return <BookOpen className="h-4 w-4 mr-1" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'offres-emploi': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'stages': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-violet-100 text-violet-800 border-violet-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'offres-emploi': return 'Offre d\'emploi'
      case 'stages': return 'Stage'
      default: return 'Conseils'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      
      <main className="flex-1 bg-slate-50 pb-20 pt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Notre <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-slate-600">
              Conseils carrière, actualités RH et les meilleures offres d'emploi et de stages sélectionnées pour vous en Afrique.
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-700">Aucun article pour le moment</h2>
              <p className="text-slate-500 mt-2">Revenez bientôt pour découvrir nos premiers conseils et offres d'emploi !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200/60">
                    <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
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
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className={`font-semibold px-3 py-1 bg-white/90 backdrop-blur-sm ${getCategoryColor(post.categorie)}`}>
                          <span className="flex items-center">
                            {getCategoryIcon(post.categorie)}
                            {getCategoryLabel(post.categorie)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="flex-1">
                      <div className="text-sm text-slate-500 mb-2">
                        {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.titre}
                      </h3>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-600 line-clamp-3 text-sm">
                        {/* Strip markdown/HTML simple pour l'aperçu */}
                        {post.contenu.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                    
                    <CardFooter className="border-t border-slate-100 pt-4 mt-auto">
                      <span className="text-primary font-medium text-sm flex items-center group-hover:underline underline-offset-4">
                        Lire la suite <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
