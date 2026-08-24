import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'
import { createPaymentReceiptPdf, receiptFileName } from '@/lib/payment/receipt-pdf'
import { getPlanExpiryDateFromDuration } from '@/lib/payment/fedapay'

export async function GET(_: Request, context: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !payment) return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 })
  if (payment.statut !== 'accepte') return NextResponse.json({ error: 'Le paiement n’est pas encore confirmé.' }, { status: 409 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom, email, plan_expiry')
    .eq('id', user.id)
    .maybeSingle()

  const issuedAt = payment.created_at
  const billing = payment.billing_cycle === 'annual' ? 'annual' : 'monthly'
  const expiryAt = profile?.plan_expiry || getPlanExpiryDateFromDuration(payment.duration_id, billing)
  const receiptData = {
    paymentId: payment.id,
    transactionId: payment.cinetpay_transaction_id,
    customerName: [profile?.prenom, profile?.nom].filter(Boolean).join(' ') || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client',
    customerEmail: profile?.email || user.email || '',
    planName: PLANS.find((plan) => plan.id === payment.plan_achete)?.nom || payment.plan_achete,
    amountFcfa: Number(payment.montant_fcfa || 0),
    paymentMethod: payment.operateur || 'FedaPay',
    issuedAt,
    expiryAt,
    durationLabel: payment.duration_label || null,
  }
  const pdf = await createPaymentReceiptPdf(receiptData)
  const name = receiptFileName(receiptData)

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
