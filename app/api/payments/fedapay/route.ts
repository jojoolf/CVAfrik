import { NextResponse } from 'next/server';
const FedaPay = require('fedapay');

export async function POST(req: Request) {
  try {
    const { amount, planId, userEmail, userFirstname, userLastname } = await req.json();

    /* 
      Configuration de FedaPay avec ta clé secrète. 
      On utilise la variable d'environnement pour la sécurité.
    */
    FedaPay.FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
    FedaPay.FedaPay.setEnvironment('live'); // Mode réel

    const transaction = await FedaPay.Transaction.create({
      description: `Abonnement CVAfrik - Plan ${planId}`,
      amount: amount,
      currency: { iso: 'XOF' },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      customer: {
        firstname: userFirstname || 'Client',
        lastname: userLastname || 'CVAfrik',
        email: userEmail,
      }
    });

    const token = await transaction.generateToken();

    return NextResponse.json({ url: token.url });
  } catch (error: any) {
    console.error('FedaPay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
