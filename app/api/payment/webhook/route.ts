import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PLANS } from '@/lib/types'

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID

// Use service role for webhook (no user context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cpm_trans_id, cpm_site_id } = body

    // Verify site ID
    if (cpm_site_id !== CINETPAY_SITE_ID) {
      return NextResponse.json({ status: 'error', message: 'Invalid site ID' }, { status: 400 })
    }

    // Verify transaction with CinetPay
    const verifyResponse = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: cpm_trans_id,
      }),
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.code !== '00') {
      // Payment not successful
      await supabaseAdmin
        .from('payments')
        .update({ statut: 'echoue' })
        .eq('cinetpay_transaction_id', cpm_trans_id)

      return NextResponse.json({ status: 'payment_failed' })
    }

    // Payment successful - update payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({ statut: 'accepte' })
      .eq('cinetpay_transaction_id', cpm_trans_id)
      .select()
      .single()

    if (paymentError || !payment) {
      console.error('Payment update error:', paymentError)
      return NextResponse.json({ status: 'error', message: 'Payment not found' }, { status: 404 })
    }

    // Get plan configuration
    const plan = PLANS.find(p => p.id === payment.plan_achete)
    if (!plan) {
      return NextResponse.json({ status: 'error', message: 'Plan not found' }, { status: 400 })
    }

    // Update user profile with new plan
    const planExpiry = new Date()
    planExpiry.setMonth(planExpiry.getMonth() + 1) // 1 month validity

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: payment.plan_achete,
        plan_expiry: planExpiry.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.user_id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json({ status: 'error', message: 'Profile update failed' }, { status: 500 })
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
