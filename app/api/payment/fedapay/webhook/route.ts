import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentReceipt } from '@/lib/email'
import { PLANS } from '@/lib/types'
import {
  fetchFedaPayTransaction,
  getFedaPaySecretKey,
  getPlanExpiryDateFromDuration,
  parseFedaPayTransactionId,
} from '@/lib/payment/fedapay'

export async function POST(req: Request) {
  try {
    const secretKey = getFedaPaySecretKey()
    if (!secretKey) {
      return NextResponse.json({ error: 'Configuration FedaPay manquante' }, { status: 500 })
    }

    const payload = await req.json().catch(() => ({}))
    const eventName = payload?.event?.name || payload?.event || payload?.name || payload?.type || ''
    const rawTransaction = payload?.entity || payload?.object || payload?.data || payload?.transaction || payload
    const transactionId = parseFedaPayTransactionId(rawTransaction?.id ?? payload?.id ?? rawTransaction?.transaction_id)

    if (!transactionId) {
      return NextResponse.json({ status: 'ignored' })
    }

    const transaction = await fetchFedaPayTransaction(transactionId)
    const status = String(transaction?.status || rawTransaction?.status || payload?.status || '').toLowerCase()
    const approved = eventName === 'transaction.approved' || status === 'approved'
    const declined = eventName === 'transaction.declined' || status === 'declined' || status === 'canceled'

    if (!approved && !declined) {
      return NextResponse.json({ status: 'ignored' })
    }

    const metadata = transaction?.custom_metadata || transaction?.metadata || rawTransaction?.custom_metadata || rawTransaction?.metadata || {}
    const userId = metadata?.user_id || metadata?.userId
    const planId = metadata?.plan_id || metadata?.planId
    const billing = metadata?.billing === 'annual' ? 'annual' : 'monthly'
    const durationId = metadata?.duration_id || metadata?.durationId || null

    if (!userId || !planId) {
      return NextResponse.json({ status: 'ignored' })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, statut')
      .eq('cinetpay_transaction_id', String(transactionId))
      .maybeSingle()

    if (approved) {
      const amount = Number(transaction?.amount || rawTransaction?.amount || 0)
      const planInfo = PLANS.find((p) => p.id === planId)
      const expiry = getPlanExpiryDateFromDuration(durationId, billing)

      if (existingPayment?.statut !== 'accepte') {
        if (existingPayment) {
          await supabaseAdmin
            .from('payments')
            .update({
              user_id: String(userId),
              montant_fcfa: amount || planInfo?.prix_fcfa || 0,
              plan_achete: planId,
              statut: 'accepte',
              operateur: 'FedaPay',
            })
            .eq('cinetpay_transaction_id', String(transactionId))
        } else {
          await supabaseAdmin.from('payments').insert({
            user_id: String(userId),
            cinetpay_transaction_id: String(transactionId),
            montant_fcfa: amount || planInfo?.prix_fcfa || 0,
            montant_usd: null,
            plan_achete: planId,
            statut: 'accepte',
            operateur: 'FedaPay',
            created_at: new Date().toISOString(),
          })
        }

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            plan: planId,
            plan_expiry: expiry.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', String(userId))

        if (updateError) {
          console.error('FedaPay Webhook Update Error:', updateError)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }

        try {
          const { data: user } = await supabaseAdmin.auth.admin.getUserById(String(userId))
          const userEmail = user?.user?.email
          const userName = user?.user?.user_metadata?.full_name || userEmail?.split('@')[0] || 'Utilisateur'
          const planName = planInfo?.nom || String(planId)
          const amountLabel = billing === 'annual'
            ? `${(planInfo?.prix_annuel_fcfa || amount || 0).toLocaleString()} FCFA`
            : `${(planInfo?.prix_fcfa || amount || 0).toLocaleString()} FCFA /mois`

          if (userEmail) {
            await sendPaymentReceipt({
              to: userEmail,
              userName,
              planName,
              amount: amountLabel,
              billing,
              transactionId: String(transactionId),
              paymentMethod: 'FedaPay',
            })
          }
        } catch (emailError) {
          console.error('Failed to send receipt email:', emailError)
        }
      }

      return NextResponse.json({ status: 'success' })
    }

    return NextResponse.json({ status: 'ignored' })
  } catch (error: any) {
    console.error('FedaPay Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
