import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, planId, userEmail, userFirstname, userLastname } = await req.json();

    const FEDAPAY_API_KEY = process.env.FEDAPAY_SECRET_KEY;
    const isLive = FEDAPAY_API_KEY?.startsWith('sk_live');
    const apiUrl = isLive 
      ? 'https://api.fedapay.com/v1/transactions' 
      : 'https://sandbox-api.fedapay.com/v1/transactions';

    // 1. Création de la transaction via Fetch direct (plus stable sur Vercel)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `Abonnement CVAfrik - Plan ${planId}`,
        amount: amount,
        currency: { iso: 'XOF' },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        customer: {
          firstname: userFirstname || 'Client',
          lastname: userLastname || 'CVAfrik',
          email: userEmail,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de la transaction');
    }

    // 2. Générer le lien de paiement
    const tokenResponse = await fetch(`${apiUrl}/${data.v1_transaction.id}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const tokenData = await tokenResponse.json();

    return NextResponse.json({ url: tokenData.v1_token.url });
  } catch (error: any) {
    console.error('FedaPay Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
