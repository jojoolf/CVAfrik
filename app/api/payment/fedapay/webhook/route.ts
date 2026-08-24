import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentReceipt } from '@/lib/email'
import { PLANS } from '@/lib/types'
import { createPaymentReceiptPdf, receiptFileName } from '@/lib/payment/receipt-pdf'
import {
  fetchFedaPayTransaction,
  getFedaPaySecretKey,
  getPlanExpiryDateFromDuration,
  parseFedaPayTransactionId,
} from '@/lib/payment/fedapay'

type PaymentRecord = {
  id: string
  user_id: string
  cinetpay_transaction_id: string
  montant_fcfa: number
  plan_achete: string
  operateur: string | null
  statut: string
  created_at: string
  billing_cycle: string | null
  duration_id: string | null
  duration_label: string | null
  receipt_sent_at: string | null
}

export async function POST(req: Request) {
  try {
    const secretKey = getFedaPaySecretKey()
    if (!secretKey) return NextResponse.json({ error: 'Configuration FedaPay manquante' }, { status: 500 })

    const payload = await req.json().catch(() => ({}))
    const eventName = payload?.event?.name || payload?.event || payload?.name || payload?.type || ''
    const rawTransaction = payload?.entity || payload?.object || payload?.data || payload?.transaction || payload
    const transactionId = parseFedaPayTransactionId(rawTransaction?.id ?? payload?.id ?? rawTransaction?.transaction_id)
    if (!transactionId) return NextResponse.json({ status: 'ignored' })

    const transaction = await fetchFedaPayTransaction(transactionId)
    const status = String(transaction?.status || rawTransaction?.status || payload?.status || '').toLowerCase()
    const approved = eventName === 'transaction.approved' || status === 'approved'
    const declined = eventName === 'transaction.declined' || status === 'declined' || status === 'canceled'
    if (!approved && !declined) return NextResponse.json({ status: 'ignored' })

    const metadata = transaction?.custom_metadata || transaction?.metadata || rawTransaction?.custom_metadata || rawTransaction?.metadata || {}
    const userId = metadata?.user_id || metadata?.userId
    const planId = metadata?.plan_id || metadata?.planId
    const billing = metadata?.billing === 'annual' ? 'annual' : 'monthly'
    const durationId = metadata?.duration_id || metadata?.durationId || null
    const durationLabel = metadata?.duration_label || metadata?.durationLabel || null
    if (!userId || !planId) return NextResponse.json({ status: 'ignored' })

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: existing } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('cinetpay_transaction_id', String(transactionId))
      .maybeSingle()

    if (!approved) return NextResponse.json({ status: 'ignored' })

    const amount = Number(transaction?.amount || rawTransaction?.amount || existing?.montant_fcfa || 0)
    const planInfo = PLANS.find((plan) => plan.id === planId)
    const expiry = getPlanExpiryDateFromDuration(durationId, billing)
    let payment = existing as PaymentRecord | null

    if (existing?.statut !== 'accepte') {
      const values = {
        user_id: String(userId),
        montant_fcfa: amount || planInfo?.prix_fcfa || 0,
        plan_achete: String(planId),
        statut: 'accepte',
        operateur: 'FedaPay',
        billing_cycle: billing,
        duration_id: durationId,
        duration_label: durationLabel,
      }
      const response = existing
        ? await supabaseAdmin.from('payments').update(values).eq('id', existing.id).select('*').single()
        : await supabaseAdmin.from('payments').insert({ ...values, cinetpay_transaction_id: String(transactionId), montant_usd: null, created_at: new Date().toISOString() }).select('*').single()

      if (response.error || !response.data) {
        console.error('FedaPay payment persistence error:', response.error)
        return NextResponse.json({ error: 'Payment persistence failed' }, { status: 500 })
      }
      payment = response.data as PaymentRecord

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: String(planId), plan_expiry: expiry.toISOString(), updated_at: new Date().toISOString() })
        .eq('id', String(userId))
      if (profileError) {
        console.error('FedaPay profile activation error:', profileError)
        return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
      }
    }

    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 500 })

    if (!payment.receipt_sent_at) {
      const { data: authLookup } = await supabaseAdmin.auth.admin.getUserById(String(userId))
      const email = authLookup?.user?.email
      if (!email) return NextResponse.json({ error: 'Customer email missing' }, { status: 500 })

      const { data: profile } = await supabaseAdmin.from('profiles').select('prenom, nom').eq('id', String(userId)).maybeSingle()
      const customerName = [profile?.prenom, profile?.nom].filter(Boolean).join(' ') || authLookup.user?.user_metadata?.full_name || email.split('@')[0]
      const planName = planInfo?.nom || String(payment.plan_achete)
      const receiptData = {
        paymentId: payment.id,
        transactionId: String(transactionId),
        customerName,
        customerEmail: email,
        planName,
        amountFcfa: Number(payment.montant_fcfa || amount),
        paymentMethod: payment.operateur || 'FedaPay',
        issuedAt: payment.created_at,
        expiryAt: expiry,
        durationLabel: payment.duration_label || durationLabel,
      }
      const receiptPdf = await createPaymentReceiptPdf(receiptData)
      const result = await sendPaymentReceipt({
        to: email,
        userName: customerName,
        planName,
        amount: `${Number(payment.montant_fcfa || amount).toLocaleString('fr-FR')} FCFA`,
        billing: payment.billing_cycle === 'annual' ? 'annual' : 'monthly',
        transactionId: String(transactionId),
        paymentMethod: payment.operateur || 'FedaPay',
        receiptPdf,
        receiptFileName: receiptFileName(receiptData),
      })

      if (!result.success) {
        console.error('Receipt delivery failed:', result.error)
        return NextResponse.json({ error: 'Receipt delivery failed' }, { status: 500 })
      }
      await supabaseAdmin.from('payments').update({ receipt_sent_at: new Date().toISOString() }).eq('id', payment.id)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error: unknown) {
    console.error('FedaPay Webhook Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook error' }, { status: 500 })
  }
}
