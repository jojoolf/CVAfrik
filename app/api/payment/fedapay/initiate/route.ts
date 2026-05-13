import { NextResponse } from "next/server";
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

    // Get user profile for more info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const amount = plan.prix_fcfa;

    // FedaPay API Request
    const response = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `Abonnement CVAfrik - Plan ${plan.nom}`,
        amount: amount,
        currency: { iso: "XOF" },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        customer: {
          firstname: profile?.prenom || user.user_metadata?.first_name || "Client",
          lastname: profile?.nom || user.user_metadata?.last_name || "CVAfrik",
          email: user.email,
          phone_number: {
            number: profile?.telephone || "",
            country: profile?.pays?.toLowerCase() || "tg"
          }
        },
        metadata: {
          userId: user.id,
          planId: plan.id
        }
      }),
    });

    const data = await response.json();

    if (data.v1 && data.v1.transaction) {
      // Create a token for the transaction to get the redirect URL
      const tokenResponse = await fetch(`https://api.fedapay.com/v1/transactions/${data.v1.transaction.id}/token`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
          "Content-Type": "application/json",
        }
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.v1 && tokenData.v1.token) {
        return NextResponse.json({ url: tokenData.v1.url });
      }
    }

    console.error("FedaPay Error:", data);
    return NextResponse.json({ error: "Erreur lors de la création de la transaction FedaPay" }, { status: 500 });
    
  } catch (error: any) {
    console.error("FedaPay Initiation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
