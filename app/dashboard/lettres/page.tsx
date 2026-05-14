import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LettreGeneratorForm } from './lettre-generator-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSignature, History, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function LettresPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const isCreating = searchParams.new === 'true'

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Lettres de Motivation</h1>
              <p className="text-muted-foreground">
                Generez des lettres de motivation percutantes avec l&apos;IA.
              </p>
            </div>
            {!isCreating && (
              <Button asChild>
                <Link href="/dashboard/lettres?new=true">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle lettre
                </Link>
              </Button>
            )}
          </div>

          {isCreating ? (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="h-5 w-5 text-primary" />
                  Generer une nouvelle lettre
                </CardTitle>
                <CardDescription>
                  Remplissez les informations ci-dessous pour que l&apos;IA redige votre lettre.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LettreGeneratorForm cvs={cvs || []} profile={profile} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {lettres && lettres.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lettres.map((lettre) => (
                    <Card key={lettre.id} className="transition-all hover:border-primary/40 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg truncate">{lettre.titre}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <History className="h-3 w-3" />
                          Geree le {format(new Date(lettre.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/dashboard/lettres/${lettre.id}`}>Voir / Modifier</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <FileSignature className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Aucune lettre generee</h3>
                  <p className="mt-2 text-muted-foreground max-w-xs">
                    Vous n&apos;avez pas encore de lettre de motivation. Commencez par en generer une !
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/dashboard/lettres?new=true">Creer ma premiere lettre</Link>
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
