import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock3, LifeBuoy, MessageSquareCode } from 'lucide-react'

export default async function SimulateurPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="px-6 py-12 text-center md:px-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock3 className="h-8 w-8" />
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary">Tous les plans</Badge>
                <Badge variant="outline">Bientot disponible</Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Simulateur d&apos;entretien IA
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Le simulateur est en cours de finalisation. Pour l&apos;instant, nous l&apos;affichons
                comme bientot disponible sur tous les plans afin d&apos;eviter toute confusion.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button asChild>
                  <Link href="/dashboard">
                    <MessageSquareCode className="mr-2 h-4 w-4" />
                    Retour au dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/support">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Contacter le support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
