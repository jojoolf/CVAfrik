import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, planId, userEmail, userFirstname, userLastname } = await req.json();

    const FEDAPAY_API_KEY = process.env.FEDAPAY_SECRET_KEY;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

    if (!FEDAPAY_API_KEY) {
      throw new Error('Clé API manquante.');
    }

    const isLive = FEDAPAY_API_KEY.startsWith('sk_live');
    const apiUrl = isLive 
      ? 'https://api.fedapay.com/v1/transactions' 
      : 'https://sandbox-api.fedapay.com/v1/transactions';

    // 1. Création de la transaction
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `CVAfrik - Plan ${planId}`,
        amount: amount,
        currency: { iso: 'XOF' },
        callback_url: `${APP_URL}/dashboard?payment=success`,
        customer: {
          firstname: userFirstname || 'Client',
          lastname: userLastname || 'CVAfrik',
          email: userEmail,
        }
      }),
    });

    const data = await response.json();
    console.log('FedaPay Create Response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API FedaPay');
    }

    // Récupération ID (FedaPay enveloppe souvent dans v1_transaction)
    const transactionId = data.v1_transaction?.id || data.id || (data.transaction ? data.transaction.id : null);

    if (!transactionId) {
       throw new Error('ID de transaction non trouvé dans la réponse.');
    }

    // 2. Générer le lien de paiement (Token)
    const tokenResponse = await fetch(`${apiUrl}/${transactionId}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const tokenData = await tokenResponse.json();
    console.log('FedaPay Token Response:', JSON.stringify(tokenData));

    if (!tokenResponse.ok) {
       throw new Error(tokenData.message || 'Erreur Token');
    }

    const url = tokenData.v1_token?.url || tokenData.url || (tokenData.token ? tokenData.token.url : null);

    if (!url) {
       throw new Error('URL de paiement non trouvée.');
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('FedaPay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
