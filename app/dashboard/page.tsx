import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, FileSignature, MessageSquareCode, ArrowRight, Clock, TrendingUp, Sparkles, Users, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CVAnalyzeButton } from '@/components/dashboard/cv-analyze-button'
import { DashboardChart } from './dashboard-chart'

export const metadata: Metadata = {
  title: 'Mon espace | CVAfrik',
  description: 'Tableau de bord CVAfrik — créez et gérez vos CV.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .maybeSingle()

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre, updated_at, created_at, template')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })
    .limit(6)

  const { count: lettresCount } = await supabase
    .from('lettres_motivation')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const displayName =
    [profile?.prenom, profile?.nom].filter(Boolean).join(' ').trim() ||
    profile?.email ||
    user!.email ||
    'Utilisateur'

  const planId = profile?.plan ?? 'gratuit'
  const isFreePlan = planId === 'gratuit'

  const totalCVs = cvs?.length || 0
  const totalLetters = lettresCount || 0

  const kpis = [
    {
      label: 'CV créés',
      value: totalCVs,
      icon: FileText,
      gradient: 'bg-gradient-primary',
      trend: '+2 cette semaine',
    },
    {
      label: 'Lettres générées',
      value: totalLetters,
      icon: FileSignature,
      gradient: 'bg-gradient-emerald',
      trend: `${totalLetters > 0 ? '+' : ''}${Math.min(totalLetters, 5)} ce mois`,
    },
    {
      label: 'Pays ciblés',
      value: 4,
      icon: TrendingUp,
      gradient: 'bg-gradient-violet',
      trend: 'Côte d\'Ivoire, Cameroun, Sénégal, RDC',
      small: true,
    },
    {
      label: 'Taux de complétion',
      value: `${Math.min(totalCVs * 15, 85)}%`,
      icon: Users,
      gradient: 'bg-gradient-amber',
      trend: `${totalCVs > 0 ? 'En progression' : 'Commencez par créer un CV'}`,
    },
  ]

  const quickActions = [
    {
      title: 'Créer un CV',
      description: 'Éditeur avec templates et export PDF',
      href: '/cv-builder',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Lettre de motivation',
      description: 'Générée par l\'IA en quelques clics',
      href: '/dashboard/lettres?new=true',
      icon: FileSignature,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Simuler un entretien',
      description: 'Entraînement avec un coach IA',
      href: '/dashboard/simulateur',
      icon: MessageSquareCode,
      gradient: 'from-violet-500 to-purple-500',
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-6 lg:p-8">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Tableau de bord
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                Bonjour, {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Voici un aperçu de votre activité sur CVAfrik.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isFreePlan ? 'secondary' : 'default'}
                className={`text-sm px-4 py-1.5 ${!isFreePlan ? 'bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20' : ''}`}
              >
                {!isFreePlan && <Star className="mr-1.5 h-3.5 w-3.5" />}
                Plan {isFreePlan ? 'Gratuit' : 'Pro'}
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
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden border-border/50 shadow-elegant hover:shadow-soft transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.gradient} text-white shadow-sm`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
              <p className={`mt-3 text-xs ${kpi.small ? 'text-muted-foreground truncate' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Recent CVs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-elegant">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Activité des CV</h3>
                  <p className="text-xs text-muted-foreground">Créations sur les 12 derniers mois</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                  +{totalCVs} total
                </Badge>
              </div>
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="space-y-4">
          <Card className="border-border/50 shadow-elegant">
            <CardContent className="p-5">
              <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Activité récente
              </h3>
              <div className="space-y-3">
                {cvs && cvs.length > 0 ? (
                  cvs.slice(0, 4).map((cv) => (
                    <div key={cv.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {cv.titre || 'Sans titre'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cv.updated_at
                            ? new Date(cv.updated_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : '—'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        Nouveau
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune activité récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Actions rapides</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="group h-full cursor-pointer border-border/50 shadow-elegant transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5 hover:border-primary/30">
                <CardContent className="flex flex-col items-start p-5">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                  <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent CVs grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Mes CV récents
          </h2>
          {cvs && cvs.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cv-builder">Voir tous</Link>
            </Button>
          )}
        </div>
        {!cvs?.length ? (
          <Card className="border-dashed border-2 shadow-elegant">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Aucun CV pour le moment</h3>
              <p className="mt-2 text-muted-foreground max-w-xs">Créez votre premier CV professionnel en quelques minutes.</p>
              <Button asChild className="mt-6">
                <Link href="/cv-builder">
                  Créer mon premier CV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <Link key={cv.id} href={`/cv-builder?edit=${cv.id}`}>
                <Card className="group transition-all duration-200 hover:border-primary/40 hover:shadow-soft hover:-translate-y-0.5 border-border/50 shadow-elegant">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-sm">
                          {cv.titre?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {cv.titre || 'Sans titre'}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {cv.updated_at
                              ? new Date(cv.updated_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <CVAnalyzeButton
                          cvId={cv.id}
                          userEmail={user!.email}
                          userName={displayName}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
