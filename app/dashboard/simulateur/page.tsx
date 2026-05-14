import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { InterviewChat } from './interview-chat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareCode, Sparkles, Trophy } from 'lucide-react'
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

  if (!planInfo.limites.simulation_entretien) {
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
              Entrainez-vous avec notre coach IA pour decrocher votre prochain emploi.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InterviewChat cvs={cvs || []} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Comment ca marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                  <p>
                    1. Choisissez votre CV et indiquez le poste vise.
                  </p>
                  <p>
                    2. Le coach IA vous posera une serie de questions personnalisees.
                  </p>
                  <p>
                    3. Repondez aux questions du mieux que vous pouvez.
                  </p>
                  <p>
                    4. Recevez un rapport detaille avec votre score et des conseils precieux.
                  </p>
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
                  &quot;Soyez honnete et precis. L&apos;IA analyse non seulement le contenu mais aussi la structure de vos reponses pour vous aider a progresser.&quot;
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
