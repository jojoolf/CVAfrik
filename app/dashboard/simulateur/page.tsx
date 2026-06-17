import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EnhancedInterviewChat } from '@/components/simulateur/enhanced-interview-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquareCode, Sparkles, Trophy, History, Clock, ChevronRight, Mic, Brain, Target } from 'lucide-react'
import Link from 'next/link'
import { PLANS } from '@/lib/types'

export default async function SimulateurPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, prenom')
    .eq('id', user.id)
    .single()

  const planId = profile?.plan ?? 'gratuit'
  const planInfo = PLANS.find(p => p.id === planId) || PLANS[0]

  if (planId === 'gratuit') {
    redirect('/tarifs?locked=simulateur')
  }

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre')
    .eq('user_id', user.id)

  const { data: simulations } = await supabase
    .from('simulations_entretien_v2')
    .select('score')
    .eq('user_id', user.id)

  const totalSims = simulations?.length || 0
  const scores = (simulations || []).map(s => s.score).filter((s): s is number => typeof s === 'number')
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—'
  const timeTotal = totalSims * 8 // Estimate 8 minutes per simulation session

  const stats = [
    { label: 'Simulations', value: totalSims.toString(), icon: MessageSquareCode, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Score moyen', value: avgScore !== '—' ? `${avgScore}%` : '—', icon: Trophy, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Temps d\'entraînement', value: `${timeTotal} min`, icon: Clock, gradient: 'from-violet-500 to-purple-500' },
  ]

  const steps = [
    { icon: Target, title: 'Choisissez un CV', desc: 'Sélectionnez le CV sur lequel baser votre simulation.' },
    { icon: Brain, title: 'Choisissez vos critères', desc: 'Définissez le poste, le type d\'entretien et le secteur.' },
    { icon: Mic, title: 'Entraînez-vous', desc: 'Répondez naturellement aux questions ciblées du coach.' },
    { icon: Trophy, title: 'Feedback sectoriel', desc: 'Obtenez des scores détaillés et des axes d\'amélioration concrets.' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-background border border-violet-500/10 p-6 lg:p-8">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Feature Premium / Pro
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                Simulateur d&apos;Entretien IA v2
              </h1>
              <p className="mt-1 text-muted-foreground">
                Mises en situation réelles par secteur et types d&apos;entretien avec analyses détaillées de performance.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link href="/dashboard/simulateur/historique">
                <History className="mr-1.5 h-4 w-4" />
                Historique
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 shadow-elegant">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat area */}
        <div className="lg:col-span-2">
          {cvs && cvs.length > 0 ? (
            <EnhancedInterviewChat cvs={cvs} />
          ) : (
            <Card className="border-dashed border-2 shadow-elegant">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-violet-500/10 p-4">
                  <MessageSquareCode className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Aucun CV disponible</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">
                  Vous devez d&apos;abord créer un CV afin de pouvoir lancer une simulation personnalisée.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/cv-builder">
                    Créer mon premier CV
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* How it works */}
          <Card className="border-border/50 shadow-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Comment ça marche ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* History link */}
          <Card className="border-border/50 shadow-elegant">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <History className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Historique</p>
                  <p className="text-xs text-muted-foreground">Consultez vos simulations passées</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/simulateur/historique">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coach tip */}
          <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/10 shadow-elegant">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Conseil du Coach</p>
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    &quot;Répondez de manière structurée et constructive. Le simulateur évalue à la fois votre communication, vos connaissances techniques, vos soft-skills et votre pertinence.&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
