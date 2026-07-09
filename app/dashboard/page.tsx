import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, FileSignature, MessageSquareCode, LifeBuoy, ArrowRight, Crown, TrendingUp, Sparkles, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'
import { NewsletterPopup } from '@/components/newsletter-popup'
import { CVActions } from '@/components/dashboard/cv-actions'

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

  const { count: lettresCount } = await supabase
    .from('lettres_motivation')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const displayName =
    [profile?.prenom, profile?.nom].filter(Boolean).join(' ').trim() ||
    profile?.email ||
    user.email ||
    'Utilisateur'

  const planId = profile?.plan ?? 'gratuit'
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]
  const isFreePlan = planId === 'gratuit'

  const stats = [
    {
      label: 'CV crees',
      value: cvs?.length || 0,
      limit: plan.limites.cvs_par_mois,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Lettres generees',
      value: profile?.lettres_generees_ce_mois || 0,
      limit: plan.limites.lettres_par_mois,
      icon: FileSignature,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Simulations (bientot)',
      value: profile?.simulations_faites_ce_mois || 0,
      limit: null,
      icon: MessageSquareCode,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
  ]

  const quickActions = [
    {
      title: 'Creer un CV',
      description: 'Editeur avec templates et export PDF',
      href: '/cv-builder',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Lettre de motivation',
      description: 'Generee par l\'IA en quelques clics',
      href: '/dashboard/lettres?new=true',
      icon: FileSignature,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Simuler un entretien',
      description: 'Bientot disponible sur tous les plans',
      href: '/dashboard/simulateur',
      icon: MessageSquareCode,
      gradient: 'from-violet-500 to-purple-500',
      badge: 'Bientot',
    },
    {
      title: 'Aide & Support',
      description: 'Contactez notre equipe',
      href: '/dashboard/support',
      icon: LifeBuoy,
      gradient: 'from-orange-500 to-amber-500',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <NewsletterPopup userEmail={user.email} userName={profile?.prenom || ''} />
      <main className="flex-1 bg-gradient-to-b from-secondary/40 to-background pb-20">
        <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">

          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Mon espace
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Bonjour, {displayName} 👋
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Gerez vos CV, lettres de motivation et preparez vos entretiens.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isFreePlan ? 'secondary' : 'default'}
                className={`text-sm px-4 py-1.5 ${!isFreePlan ? 'bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20' : ''}`}
              >
                {!isFreePlan && <Crown className="mr-1.5 h-3.5 w-3.5" />}
                Plan {plan.nom}
              </Badge>
              {isFreePlan && (
                <Button size="sm" asChild className="rounded-full shadow-lg shadow-primary/20">
                  <Link href="/tarifs">
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                    Passer Pro
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {!profile && (
            <Card className="mb-8 border-amber-500/40 bg-amber-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Profil non trouve</CardTitle>
                <CardDescription>
                  Votre compte est connecte mais votre profil n&apos;est pas encore initialise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-amber-500/50 text-amber-700 hover:bg-amber-500/10" asChild>
                  <Link href="/profil/modifier">Initialiser mon profil</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                      {stat.limit !== null && (
                        <span className="text-sm font-normal text-muted-foreground">/{stat.limit}</span>
                      )}
                      {stat.limit === null && (
                        <span className="text-sm font-normal text-muted-foreground ml-1">∞</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Actions rapides</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="group h-full cursor-pointer border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                    <CardContent className="flex flex-col items-start p-5">
                      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                        {action.badge && (
                          <Badge variant="outline" className="text-[10px]">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                      <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mes CV recents */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Mes CV recents
              </h2>
              {cvs && cvs.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/cv-builder">Voir tous</Link>
                </Button>
              )}
            </div>
            {!cvs?.length ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Aucun CV pour le moment</h3>
                  <p className="mt-2 text-muted-foreground max-w-xs">Creez votre premier CV professionnel en quelques minutes.</p>
                  <Button asChild className="mt-6">
                    <Link href="/cv-builder">
                      Creer mon premier CV
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cvs.map((cv) => (
                  <li key={cv.id}>
                    <Link href={`/cv-builder?edit=${cv.id}`}>
                      <Card className="group transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                              {cv.titre || 'Sans titre'}
                            </CardTitle>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <CardDescription className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
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
