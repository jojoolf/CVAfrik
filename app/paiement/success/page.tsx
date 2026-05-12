import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, FileText, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Paiement reussi',
  description: 'Votre paiement a ete effectue avec succes.',
}

interface PageProps {
  searchParams: Promise<{ transaction_id?: string; mock?: string }>
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { transaction_id, mock } = params

  if (!transaction_id) {
    redirect('/tarifs')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  // If mock payment, update the payment status manually (for development)
  if (mock === 'true') {
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('cinetpay_transaction_id', transaction_id)
      .single()

    if (payment && payment.statut === 'en_attente') {
      // Update payment status
      await supabase
        .from('payments')
        .update({ statut: 'accepte' })
        .eq('cinetpay_transaction_id', transaction_id)

      // Update user profile
      const planExpiry = new Date()
      planExpiry.setMonth(planExpiry.getMonth() + 1)

      await supabase
        .from('profiles')
        .update({
          plan: payment.plan_achete,
          plan_expiry: planExpiry.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    }
  }

  // Get updated profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Paiement reussi!</CardTitle>
          <CardDescription>
            Merci pour votre achat. Votre plan {profile?.plan === 'pro' ? 'Pro' : 'Premium'} est maintenant actif.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-mono text-xs text-foreground">{transaction_id}</p>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="font-semibold text-foreground">Vous pouvez maintenant:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Creer des CV illimites
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Utiliser les conseils IA
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Exporter en PDF sans filigrane
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link href="/cv-builder">
              Creer mon CV maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard">
              Aller au tableau de bord
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
