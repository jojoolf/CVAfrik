import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HistoryList } from './history-list'
import { MessageSquareCode, History } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function HistoriquePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link href="/dashboard/simulateur">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-2">
                <History className="h-8 w-8 text-primary" />
                Historique des simulations
              </h1>
              <p className="text-muted-foreground mt-2">
                Consultez toutes vos simulations d&apos;entretien passées.
              </p>
            </div>
          </div>

          <HistoryList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
