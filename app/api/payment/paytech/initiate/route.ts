import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé, veuillez vous connecter." }, { status: 401 });
    }

    const { amount, planId, durationId, durationLabel } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    const apiKey = (process.env.PAYTECH_API_KEY || "").trim();
    const apiSecret = (process.env.PAYTECH_API_SECRET || "").trim();
    const env = (process.env.PAYTECH_ENV || "prod").trim();

    if (!apiKey || !apiSecret) {
      console.error("PAYTECH_API_KEY or PAYTECH_API_SECRET is missing");
      return NextResponse.json(
        { error: "Configuration PayTech manquante sur le serveur." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cv-afrik.vercel.app";
    const refCommand = `cmd_${Date.now()}_${user.id.substring(0, 8)}`;

    const paytechBody = {
      item_name: `CVAfrik Pro - ${durationLabel || "Abonnement"}`,
      item_price: String(amount),
      currency: "XOF",
      ref_command: refCommand,
      command_name: `Abonnement CVAfrik Pro (${durationLabel || "1 Mois"})`,
      env: env,
      ipn_url: `${appUrl}/api/payment/paytech/ipn`,
      success_url: `${appUrl}/dashboard?payment=success`,
      cancel_url: `${appUrl}/paiement/abonnement?canceled=true`,
      custom_field: JSON.stringify({
        userId: user.id,
        userEmail: user.email,
        planId: planId || "pro",
        durationId: durationId || "1m",
        amount: amount,
      }),
    };

    const response = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "API_KEY": apiKey,
        "API_SECRET": apiSecret,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(paytechBody),
    });

    const data = await response.json();

    if (data.success === 1 || data.redirect_url) {
      return NextResponse.json({ url: data.redirect_url, token: data.token });
    } else {
      console.error("PayTech API Error:", data);
      return NextResponse.json(
        { error: data.errors?.[0] || data.message || "Erreur d'initialisation PayTech" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("PayTech Initiate Exception:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
