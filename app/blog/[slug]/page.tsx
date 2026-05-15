import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeft, Calendar, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('titre, contenu')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Article introuvable | CVAfrik' }

  return {
    title: `${post.titre} | Blog CVAfrik`,
    description: post.contenu.substring(0, 160).replace(/<[^>]*>?/gm, ''),
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('publie', true)
    .single()

  if (!post) {
    notFound()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'offres-emploi': return <Briefcase className="h-4 w-4 mr-1.5" />
      case 'stages': return <GraduationCap className="h-4 w-4 mr-1.5" />
      default: return <BookOpen className="h-4 w-4 mr-1.5" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'offres-emploi': return 'Offre d\'emploi'
      case 'stages': return 'Stage'
      default: return 'Conseils & Carrière'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      
      <main className="flex-1 bg-background pb-20 pt-10">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>

          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                <span className="flex items-center text-foreground/80">
                  {getCategoryIcon(post.categorie)}
                  {getCategoryLabel(post.categorie)}
                </span>
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1.5 h-4 w-4" />
                {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-8 leading-tight">
              {post.titre}
            </h1>

            {post.image_url && (
              <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl relative mt-8">
                <img 
                  src={post.image_url} 
                  alt={post.titre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <div 
            className="prose prose-slate dark:prose-invert prose-lg md:prose-xl mx-auto prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.contenu }}
          />
        </article>
      </main>

      <Footer />
    </div>
  )
}
