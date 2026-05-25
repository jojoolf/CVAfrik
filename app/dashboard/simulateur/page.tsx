import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { InterviewChat } from './interview-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareCode, Sparkles, Trophy, History } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/types'

export default async function SimulateurPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const planId = profile?.plan ?? 'gratuit'
  const planInfo = PLANS.find(p => p.id === planId) || PLANS[0]

  // Plan gratuit → redirection vers tarifs
  if (planId === 'gratuit') {
    redirect('/tarifs?locked=simulateur')
  }

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id, titre')
    .eq('user_id', user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <MessageSquareCode className="h-8 w-8 text-primary" />
              Simulateur d&apos;Entretien IA
            </h1>
            <p className="text-muted-foreground mt-2">
              Entrainez-vous avec notre coach IA pour décrocher votre prochain emploi.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {cvs && cvs.length > 0 ? (
                <InterviewChat cvs={cvs} />
              ) : (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
                  <CardContent className="p-8 text-center">
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      Vous devez d&apos;abord créer un CV avant de lancer une simulation d&apos;entretien.
                    </p>
                    <a href="/cv-builder" className="mt-4 inline-block text-primary underline underline-offset-4">
                      Créer mon premier CV →
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>1. Choisissez votre CV et le poste visé.</p>
                  <p>2. Le coach IA vous pose des questions personnalisées.</p>
                  <p>3. Répondez naturellement, comme dans un vrai entretien.</p>
                  <p>4. Recevez un score et des conseils détaillés à la fin.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Historique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consultez toutes vos simulations passées, les conversations complètes et les feedbacks détaillés.
                  </p>
                  <Button variant="outline" className="w-full rounded-full" asChild>
                    <Link href="/dashboard/simulateur/historique">
                      Voir l&apos;historique →
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Trophy className="h-4 w-4" />
                    Conseil du Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-primary/80 italic">
                  &quot;Soyez honnête et précis. L&apos;IA analyse non seulement le contenu mais aussi la structure de vos réponses pour vous aider à progresser.&quot;
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
