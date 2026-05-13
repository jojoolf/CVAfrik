import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = PLANS.find((p) => p.id === planId);

    if (!plan || plan.id === "gratuit") {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const transactionId = uuidv4();
    const amount = plan.prix_fcfa;

    // Prepare CinetPay payment data
    const paymentData = {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: amount,
      currency: "XOF",
      alternative_currency: "USD",
      description: `Abonnement CVAfrik - Plan ${plan.nom}`,
      customer_id: user.id,
      customer_email: user.email,
      customer_name: user.user_metadata?.full_name || user.email?.split("@")[0],
      customer_surname: "",
      customer_phone_number: "",
      customer_address: "",
      customer_city: "",
      customer_country: "CI",
      customer_state: "",
      customer_zip_code: "",
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      channels: "ALL",
      metadata: JSON.stringify({ userId: user.id, planId: plan.id }),
      lang: "fr",
    };

    const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (data.code === "201") {
      return NextResponse.json({ url: data.data.payment_url });
    } else {
      console.error("CinetPay Error:", data);
      return NextResponse.json({ error: data.message || "Erreur CinetPay" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
