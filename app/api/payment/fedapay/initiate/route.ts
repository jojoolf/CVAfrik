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

function findTransactionId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null

  if (Array.isArray(payload)) {
    return findTransactionId(payload[0])
  }

  const value = payload as Record<string, unknown>
  const directId = parseFedaPayTransactionId(value.id)
  if (directId) return directId

  // FedaPay's official Node SDK handles transaction creation responses
  // wrapped under a versioned key such as { "v1/transaction": { id: ... } }.
  for (const key of ['v1/transaction', 'entity', 'data', 'transaction', 'v1', 'response']) {
    const nestedId = findTransactionId(value[key])
    if (nestedId) return nestedId
  }

  return null
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

    const transactionResponseText = await transactionResponse.text()
    let transactionData: Record<string, unknown> | null = null

    try {
      transactionData = transactionResponseText
        ? JSON.parse(transactionResponseText) as Record<string, unknown>
        : null
    } catch {
      console.error('FedaPay Transaction Error: réponse non JSON', {
        status: transactionResponse.status,
        body: transactionResponseText,
      })
    }

    if (!transactionResponse.ok) {
      console.error('FedaPay Transaction Error:', {
        status: transactionResponse.status,
        body: transactionData ?? transactionResponseText,
      })

      const responseError = transactionData?.error
      const responseErrorMessage = responseError && typeof responseError === 'object'
        ? (responseError as Record<string, unknown>).message
        : responseError

      return NextResponse.json(
        {
          error: 'Erreur FedaPay lors de la création de la transaction',
          details: transactionData?.message
            || responseErrorMessage
            || transactionData?.errors
            || `FedaPay a répondu HTTP ${transactionResponse.status}`,
          environment: getFedaPayApiBaseUrl().includes('sandbox') ? 'sandbox' : 'live',
        },
        { status: 502 },
      )
    }

    // The documented response contains the transaction id directly. Keep the
    // parser tolerant of known response envelopes, but do not call an
    // undocumented lookup endpoint that can hide the actual upstream response.
    const transactionId = findTransactionId(transactionData)

    if (!transactionId) {
      console.error('FedaPay Transaction Error: réponse sans identifiant', {
        status: transactionResponse.status,
        body: transactionData ?? transactionResponseText,
      })

      return NextResponse.json(
        {
          error: 'FedaPay a répondu sans identifiant de transaction',
          details: 'Consultez les logs serveur FedaPay pour voir la réponse exacte.',
          environment: getFedaPayApiBaseUrl().includes('sandbox') ? 'sandbox' : 'live',
        },
        { status: 502 },
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

    const tokenResponseText = await tokenResponse.text()
    let tokenData: Record<string, unknown> | null = null

    try {
      tokenData = tokenResponseText
        ? JSON.parse(tokenResponseText) as Record<string, unknown>
        : null
    } catch {
      console.error('FedaPay Token Error: réponse non JSON', {
        status: tokenResponse.status,
        body: tokenResponseText,
      })
    }

    const tokenDataRecord = tokenData?.data && typeof tokenData.data === 'object'
      ? tokenData.data as Record<string, unknown>
      : null
    const tokenV1Record = tokenData?.v1 && typeof tokenData.v1 === 'object'
      ? tokenData.v1 as Record<string, unknown>
      : null
    const paymentUrl = tokenData?.url || tokenDataRecord?.url || tokenV1Record?.url

    if (!tokenResponse.ok || typeof paymentUrl !== 'string' || !paymentUrl) {
      console.error('FedaPay Token Error:', {
        status: tokenResponse.status,
        body: tokenData ?? tokenResponseText,
      })

      const tokenError = tokenData?.error
      const tokenErrorMessage = tokenError && typeof tokenError === 'object'
        ? (tokenError as Record<string, unknown>).message
        : tokenError

      return NextResponse.json(
        {
          error: 'Erreur lors de la génération du lien FedaPay',
          details: tokenData?.message
            || tokenErrorMessage
            || tokenData?.errors
            || `FedaPay n’a pas renvoyé de lien de paiement (HTTP ${tokenResponse.status})`,
        },
        { status: 502 },
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
