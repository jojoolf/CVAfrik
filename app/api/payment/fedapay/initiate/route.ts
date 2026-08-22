import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'
import {
  buildFedaPayPaymentCallbackUrl,
  getAppOrigin,
  getFedaPayApiBaseUrl,
  getFedaPaySecretKey,
  parseFedaPayTransactionId,
} from '@/lib/payment/fedapay'

const DURATION_AMOUNTS: Record<string, number> = {
  '15j': 2000,
  '1m': 2600,
  '3m': 6500,
  '6m': 11000,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { planId, billing, amount: requestedAmount, durationId, durationLabel } = body as {
      planId?: string
      billing?: 'monthly' | 'annual'
      amount?: number | string
      durationId?: string
      durationLabel?: string
    }
    const plan = PLANS.find((p) => p.id === planId)

    if (!plan || plan.id === 'gratuit') {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('prenom, nom, email, telephone, pays')
      .eq('id', user.id)
      .maybeSingle()

    const secretKey = getFedaPaySecretKey()
    if (!secretKey) {
      console.error('FEDAPAY_SECRET_KEY is missing or empty')
      return NextResponse.json({ error: 'Configuration de paiement manquante' }, { status: 500 })
    }

    const selectedBilling = billing === 'annual' ? 'annual' : 'monthly'
    const amount = durationId && DURATION_AMOUNTS[durationId]
      ? DURATION_AMOUNTS[durationId]
      : selectedBilling === 'annual'
        ? (plan.prix_annuel_fcfa || plan.prix_fcfa)
        : plan.prix_fcfa
    const appUrl = getAppOrigin(req)

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Montant de paiement invalide' }, { status: 400 })
    }

    const customer: Record<string, unknown> = {
      firstname: (profile?.prenom || user.user_metadata?.first_name || 'Client').substring(0, 50),
      lastname: (profile?.nom || user.user_metadata?.last_name || 'CVAfrik').substring(0, 50),
      email: user.email,
    }

    const countryCodes: Record<string, string> = {
      "cote d'ivoire": 'ci', 'côte d\'ivoire': 'ci', sénégal: 'sn', senegal: 'sn',
      cameroun: 'cm', bénin: 'bj', benin: 'bj', togo: 'tg', mali: 'ml',
      'burkina faso': 'bf', 'rd congo': 'cd', congo: 'cg',
    }
    const country = countryCodes[(profile?.pays || '').trim().toLowerCase()] || 'tg'

    if (profile?.telephone) {
      customer.phone_number = {
        number: profile.telephone.replace(/\s/g, ''),
        country,
      }
    }

    const merchantReference = `CVA-${user.id.slice(0, 8)}-${Date.now()}`
    const transactionResponse = await fetch(`${getFedaPayApiBaseUrl()}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        description: `Abonnement CVAfrik - Plan ${plan.nom}`,
        amount,
        currency: { iso: 'XOF' },
        callback_url: buildFedaPayPaymentCallbackUrl(req),
        merchant_reference: merchantReference,
        customer,
        custom_metadata: {
          user_id: user.id,
          plan_id: plan.id,
          billing: selectedBilling,
          duration_id: durationId || null,
          duration_label: durationLabel || null,
          app_url: appUrl,
        },
      }),
    })

    const transactionData = await transactionResponse.json().catch(() => null)
    const transactionId = parseFedaPayTransactionId(
      transactionData?.id ?? transactionData?.transaction?.id ?? transactionData?.v1?.transaction?.id,
    )

    if (!transactionResponse.ok || !transactionId) {
      console.error('FedaPay Transaction Error:', JSON.stringify(transactionData, null, 2))
      return NextResponse.json(
        {
          error: 'Erreur FedaPay',
          details: transactionData?.message || transactionData?.error || transactionData?.errors || 'Impossible de creer la transaction',
          environment: getFedaPayApiBaseUrl().includes('sandbox') ? 'sandbox' : 'live',
        },
        { status: 500 },
      )
    }

    const tokenResponse = await fetch(`${getFedaPayApiBaseUrl()}/transactions/${transactionId}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const tokenData = await tokenResponse.json().catch(() => null)
    const paymentUrl = tokenData?.url || tokenData?.data?.url || tokenData?.v1?.url

    if (!tokenResponse.ok || !paymentUrl) {
      console.error('FedaPay Token Error:', JSON.stringify(tokenData, null, 2))
      return NextResponse.json(
        {
          error: 'Erreur lors de la generation du lien FedaPay',
          details: tokenData?.message || tokenData?.error || tokenData?.errors || 'FedaPay n’a pas renvoye de lien de paiement',
        },
        { status: 500 },
      )
    }

    await supabase.from('payments').insert({
      user_id: user.id,
      cinetpay_transaction_id: String(transactionId),
      montant_fcfa: amount,
      montant_usd: null,
      plan_achete: plan.id,
      operateur: 'FedaPay',
      statut: 'en_attente',
    })

    return NextResponse.json({
      success: true,
      url: paymentUrl,
      transaction_id: String(transactionId),
    })
  } catch (error: any) {
    console.error('FedaPay Initiation Error:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
