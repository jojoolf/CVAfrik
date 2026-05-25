import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LettreGeneratorForm } from './lettre-generator-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileSignature, History, Plus, Sparkles, ArrowRight, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PLANS } from '@/lib/types'

export default async function LettresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const resolvedSearchParams = await searchParams
  const newParam = resolvedSearchParams?.new
  const isCreating = Array.isArray(newParam) ? newParam.includes('true') : newParam === 'true'

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre')
    .eq('user_id', user.id)

  const { data: lettres } = await supabase
    .from('lettres_motivation')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const planId = profile?.plan ?? 'gratuit'
  const planInfo = PLANS.find(p => p.id === planId) || PLANS[0]

  const currentMonthStart = new Date()
  currentMonthStart.setDate(1)
  currentMonthStart.setHours(0, 0, 0, 0)

  const generatedThisMonth = lettres?.filter(l => new Date(l.created_at) >= currentMonthStart).length || 0
  const letterLimit = planInfo.limites.lettres_par_mois
  const limitReached = letterLimit !== null && generatedThisMonth >= letterLimit

  if (isCreating && limitReached) {
    redirect('/tarifs?locked=lettres')
  }

  const totalLetters = lettres?.length || 0
  const isFreePlan = planId === 'gratuit'

  const stats = [
    { label: 'Total lettres', value: totalLetters, icon: FileSignature, gradient: 'bg-gradient-emerald' },
    { label: 'Ce mois', value: generatedThisMonth, icon: Sparkles, gradient: 'bg-gradient-primary' },
    { label: 'Limite mensuelle', value: letterLimit !== null ? `${generatedThisMonth}/${letterLimit}` : '∞', icon: Star, gradient: 'bg-gradient-amber' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border border-emerald-500/10 p-6 lg:p-8">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Lettres de motivation
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Générez des lettres percutantes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Des lettres de motivation personnalisées générées par l&apos;IA en quelques clics.
            </p>
          </div>
          {!isCreating && (
            <Button asChild className="rounded-full shadow-lg shadow-primary/20 shrink-0">
              <Link href="/dashboard/lettres?new=true">
                <Plus className="mr-1.5 h-4 w-4" />
                Nouvelle lettre
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 shadow-elegant">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.gradient} text-white shadow-sm`}>
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

      {/* Content */}
      {isCreating ? (
        <Card className="border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSignature className="h-5 w-5 text-emerald-500" />
              Générer une nouvelle lettre
            </CardTitle>
            <CardDescription>
              Remplissez une seule fois le formulaire et comparez 3 lettres générées par l&apos;IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LettreGeneratorForm cvs={cvs || []} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lettres && lettres.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lettres.map((lettre) => (
                <Link key={lettre.id} href={`/dashboard/lettres/${lettre.id}`}>
                  <Card className="group border-border/50 shadow-elegant hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-emerald text-white text-xs font-bold shadow-sm">
                            {lettre.titre?.charAt(0) || 'L'}
                          </div>
                          <div>
                            <CardTitle className="text-base truncate max-w-[180px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {lettre.titre}
                            </CardTitle>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:text-emerald-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(lettre.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
                          {lettre.entreprise || 'Non spécifiée'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          {lettre.poste || 'Non spécifié'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 shadow-elegant">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                  <FileSignature className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Aucune lettre générée</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">
                  Vous n&apos;avez pas encore de lettre de motivation. Commencez par en générer une !
                </p>
                <Button asChild className="mt-6">
                  <Link href="/dashboard/lettres?new=true">
                    Créer ma première lettre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
