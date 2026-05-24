import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SupportForm } from './support-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LifeBuoy, Mail, MessageCircle, HelpCircle } from 'lucide-react'

export default async function SupportPage() {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LifeBuoy className="h-8 w-8 text-primary" />
              Aide & Support
            </h1>
            <p className="text-muted-foreground mt-2">
              Une question ? Un probleme ? Notre equipe est la pour vous aider.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Envoyer un message</CardTitle>
                  <CardDescription>
                    Decrivez votre demande et nous vous repondrons par email dans les plus brefs delais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupportForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Contact Direct
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground">contact@cvafrik.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-muted-foreground">+225 XX XX XX XX</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <HelpCircle className="h-4 w-4" />
                    FAQ Rapide
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4 text-primary/80">
                  <div>
                    <p className="font-bold">Comment telecharger mon CV ?</p>
                    <p>Allez dans l&apos;editeur, cliquez sur &quot;Terminer&quot; puis sur l&apos;icone de telechargement.</p>
                  </div>
                  <div>
                    <p className="font-bold">Quels sont les modes de paiement ?</p>
                    <p>Nous acceptons Orange Money, MTN et Moov via CinetPay.</p>
                  </div>
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
