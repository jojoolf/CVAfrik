import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SimulationDetail } from './simulation-detail'
import { notFound } from 'next/navigation'

export default async function SimulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { id } = await params

  const { data: sim, error } = await supabase
    .from('simulations_entretien')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !sim) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-4xl px-4">
          <SimulationDetail sim={sim} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
