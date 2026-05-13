import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, LayoutDashboard, Sparkles, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Mon espace',
  description: 'Tableau de bord CVAfrik — creez et gerez vos CV.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(6)

  const displayName =
    [profile?.prenom, profile?.nom].filter(Boolean).join(' ').trim() ||
    profile?.email ||
    user.email ||
    'Utilisateur'

  const planId = profile?.plan ?? 'gratuit'
  const planLabel = PLANS.find((p) => p.id === planId)?.nom ?? planId

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="mb-10">
            <p className="text-sm font-medium text-primary">Mon espace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Bonjour, {displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Creez un CV professionnel ou retrouvez vos derniers documents. Aucun questionnaire
              n&apos;est requis pour utiliser cette page.
            </p>
            {profile && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  Plan {planLabel}
                </Badge>
              </div>
            )}
          </div>

          {!profile && (
            <Card className="mb-8 border-amber-500/40 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-lg">Profil non trouve</CardTitle>
                <CardDescription>
                  Votre compte est connecte mais la ligne profil est absente en base. Executez la
                  migration Supabase (trigger de creation de profil) ou contactez le support.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 shadow-sm">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Creer ou modifier un CV</CardTitle>
                <CardDescription>
                  Ouvrez l&apos;editeur avec vos templates et export PDF.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/cv-builder">
                    Ouvrir le createur de CV
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Passer a un plan superieur</CardTitle>
                <CardDescription>
                  Plus de CV par mois et fonctionnalites avancees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/tarifs">Voir les tarifs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Mes CV recents</h2>
            </div>
            {!cvs?.length ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">Vous n&apos;avez pas encore de CV enregistre.</p>
                  <Button asChild className="mt-4">
                    <Link href="/cv-builder">Creer mon premier CV</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {cvs.map((cv) => (
                  <li key={cv.id}>
                    <Link href={`/cv-builder?edit=${cv.id}`}>
                      <Card className="transition-colors hover:border-primary/40 hover:bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">
                            {cv.titre || 'Sans titre'}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Modifie le{' '}
                            {cv.updated_at
                              ? new Date(cv.updated_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
