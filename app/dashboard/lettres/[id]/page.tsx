import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LettreContentEditor } from './lettre-content-editor'

export default async function LettreViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: lettre } = await supabase
    .from('lettres_motivation')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!lettre) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="-ml-4">
              <Link href="/dashboard/lettres">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux lettres
              </Link>
            </Button>
          </div>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-xl">{lettre.titre}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <LettreContentEditor initialContent={lettre.contenu} id={lettre.id} title={lettre.titre} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
