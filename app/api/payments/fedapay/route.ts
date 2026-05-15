import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, planId, userEmail, userFirstname, userLastname } = await req.json();

    const FEDAPAY_API_KEY = process.env.FEDAPAY_SECRET_KEY;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

    if (!FEDAPAY_API_KEY) {
      throw new Error('La clé API FedaPay est manquante dans la configuration.');
    }

    if (!APP_URL) {
      throw new Error('L\'URL de l\'application est manquante dans la configuration.');
    }

    const isLive = FEDAPAY_API_KEY.startsWith('sk_live');
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
      console.error('FedaPay API Error Response:', data);
      throw new Error(data.message || 'Erreur lors de la création de la transaction');
    }

    // FedaPay renvoie parfois l'id directement ou dans v1_transaction
    const transactionId = data.v1_transaction?.id || data.id;

    if (!transactionId) {
      console.error('No transaction ID found in response:', data);
      throw new Error('Identifiant de transaction introuvable dans la réponse de FedaPay');
    }

    // 2. Générer le lien de paiement
    const tokenResponse = await fetch(`${apiUrl}/${transactionId}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
       throw new Error(tokenData.message || 'Erreur lors de la génération du token');
    }

    // Même chose pour le token, on vérifie la structure
    const tokenUrl = tokenData.v1_token?.url || tokenData.url;

    return NextResponse.json({ url: tokenUrl });
  } catch (error: any) {
    console.error('FedaPay Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
