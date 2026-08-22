import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, FileText, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { fetchFedaPayTransaction, getFedaPaySecretKey, getPlanExpiryDateFromDuration, parseFedaPayTransactionId } from '@/lib/payment/fedapay'

export const metadata: Metadata = {
  title: 'Paiement reussi',
  description: 'Votre paiement a ete effectue avec succes.',
}

interface PageProps {
  searchParams: Promise<{ transaction_id?: string; id?: string; status?: string; mock?: string }>
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { status } = params
  const rawTransactionId = params.transaction_id || params.id

  if (!rawTransactionId) {
    redirect('/tarifs')
  }

  const transactionId = parseFedaPayTransactionId(rawTransactionId)
  if (!transactionId) {
    redirect('/tarifs')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: existingPayment } = await supabase
    .from('payments')
    .select('*')
    .eq('cinetpay_transaction_id', transactionId)
    .eq('user_id', user.id)
    .maybeSingle()

  let payment = existingPayment
  let paymentApproved = existingPayment?.statut === 'accepte'

  if (getFedaPaySecretKey()) {
    try {
      const transaction = await fetchFedaPayTransaction(transactionId)
      const metadata = transaction?.custom_metadata || transaction?.metadata || {}
      if (metadata?.user_id && String(metadata.user_id) !== user.id) {
        redirect('/paiement/abonnement?error=transaction_invalide')
      }
      const planId = metadata?.plan_id || metadata?.planId || payment?.plan_achete || 'pro'
      const billing = metadata?.billing === 'annual' ? 'annual' : 'monthly'
      const durationId = metadata?.duration_id || metadata?.durationId || null
      const amount = Number(transaction?.amount || payment?.montant_fcfa || 0)
      const approved = String(transaction?.status || '').toLowerCase() === 'approved'

      if (!payment) {
        const { data: createdPayment } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            cinetpay_transaction_id: transactionId,
            montant_fcfa: amount,
            montant_usd: null,
            plan_achete: planId,
            operateur: 'FedaPay',
            statut: approved ? 'accepte' : 'en_attente',
            created_at: new Date().toISOString(),
          })
          .select('*')
          .maybeSingle()

        payment = createdPayment || null
        paymentApproved = approved
      } else if (approved && payment.statut === 'en_attente') {
        await supabase
          .from('payments')
          .update({
            statut: 'accepte',
            operateur: 'FedaPay',
            montant_fcfa: amount || payment.montant_fcfa,
            plan_achete: planId,
          })
          .eq('cinetpay_transaction_id', transactionId)
        paymentApproved = true
      }

      if (approved) {
        paymentApproved = true
        const expiry = getPlanExpiryDateFromDuration(durationId, billing)
        await supabase
          .from('profiles')
          .update({
            plan: planId,
            plan_expiry: expiry.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      }
    } catch (error) {
      console.error('[paiement/success] verification FedaPay', error)
    }
  }

  if (!paymentApproved) {
    redirect('/paiement/abonnement?payment=pending')
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
            <p className="font-mono text-xs text-foreground">{transactionId}</p>
          </div>

          {status && (
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
              Statut FedaPay: {status}
            </div>
          )}

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
