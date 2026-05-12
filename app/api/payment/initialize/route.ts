import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID
const CINETPAY_API_URL = 'https://api-checkout.cinetpay.com/v2/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, payment_method, country, operator, phone_number, user_id, email } = body

    // Validate plan
    const plan = PLANS.find(p => p.id === plan_id && p.id !== 'gratuit')
    if (!plan) {
      return NextResponse.json(
        { success: false, message: 'Plan invalide' },
        { status: 400 }
      )
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== user_id) {
      return NextResponse.json(
        { success: false, message: 'Non autorise' },
        { status: 401 }
      )
    }

    // Generate unique transaction ID
    const transactionId = `CVAFRIK-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Store pending payment in database
    const { error: insertError } = await supabase.from('payments').insert({
      user_id,
      cinetpay_transaction_id: transactionId,
      montant_fcfa: plan.prix_fcfa,
      montant_usd: plan.prix_usd,
      plan_achete: plan.id,
      operateur: operator || 'card',
      statut: 'en_attente',
    })

    if (insertError) {
      console.error('Error inserting payment:', insertError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la creation du paiement' },
        { status: 500 }
      )
    }

    // If CinetPay credentials are not configured, return mock response for development
    if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID) {
      console.warn('CinetPay credentials not configured. Using mock payment flow.')
      return NextResponse.json({
        success: true,
        payment_url: `/paiement/success?transaction_id=${transactionId}&mock=true`,
        transaction_id: transactionId,
        message: 'Mode demo - Paiement simule',
      })
    }

    // Initialize CinetPay payment
    const baseUrl = request.nextUrl.origin
    const cinetpayPayload = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: plan.prix_fcfa,
      currency: 'XOF',
      description: `Abonnement CVAfrik - Plan ${plan.nom}`,
      notify_url: `${baseUrl}/api/payment/webhook`,
      return_url: `${baseUrl}/paiement/success?transaction_id=${transactionId}`,
      cancel_url: `${baseUrl}/paiement/cancel`,
      channels: payment_method === 'mobile_money' ? 'MOBILE_MONEY' : 'ALL',
      customer_name: email.split('@')[0],
      customer_email: email,
      customer_phone_number: phone_number || '',
      customer_address: country || '',
      customer_city: '',
      customer_country: country || 'CI',
      customer_state: '',
      customer_zip_code: '',
      metadata: JSON.stringify({
        user_id,
        plan_id: plan.id,
        operator,
      }),
    }

    const cinetpayResponse = await fetch(CINETPAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cinetpayPayload),
    })

    const cinetpayData = await cinetpayResponse.json()

    if (cinetpayData.code === '201') {
      return NextResponse.json({
        success: true,
        payment_url: cinetpayData.data.payment_url,
        transaction_id: transactionId,
      })
    } else {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ statut: 'echoue' })
        .eq('cinetpay_transaction_id', transactionId)

      return NextResponse.json({
        success: false,
        message: cinetpayData.message || 'Erreur CinetPay',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
