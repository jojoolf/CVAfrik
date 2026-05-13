import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { plan, userEmail, userId, userName } = await req.json();

    const montants: Record<string, { fcfa: number; usd: number }> = {
      pro: { fcfa: 1200, usd: 2 },
      premium: { fcfa: 3000, usd: 5 },
    };

    if (!montants[plan]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const transaction_id = `cvafrik_${Date.now()}_${uuidv4().substring(0, 8)}`;

    const payload = {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transaction_id,
      amount: montants[plan].fcfa,
      currency: "XOF",
      description: `CVAfrik Plan ${plan.toUpperCase()}`,
      customer_email: userEmail,
      customer_name: userName || "Utilisateur CVAfrik",
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&transaction_id=${transaction_id}`,
      channels: "ALL",
      metadata: JSON.stringify({ userId, plan }),
    };

    const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.code === "201" || data.status === "CREATED") {
      return NextResponse.json({ payment_url: data.data.payment_url });
    } else {
      console.error("CinetPay Error:", data);
      return NextResponse.json(
        { error: data.message || "Erreur lors de l'initialisation du paiement" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
