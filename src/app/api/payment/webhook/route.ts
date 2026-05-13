import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // CinetPay sends notifications as form-data or JSON depending on configuration
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      body = await req.json();
    }

    const { cpm_trans_id, cpm_result, cpm_error_message, cpm_amount, cpm_currency, cpm_custom } = body;

    // cpm_custom is often where metadata is passed if sent as a string
    const metadata = cpm_custom ? JSON.parse(cpm_custom) : {};
    const { userId, plan } = metadata;

    if (cpm_result === "00") { // 00 usually means success in CinetPay
      // Update user plan in Supabase
      const planExpiry = new Date();
      planExpiry.setDate(planExpiry.getDate() + 30);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          plan: plan,
          plan_expiry: planExpiry.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Record payment
      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: userId,
        cinetpay_transaction_id: cpm_trans_id,
        montant_fcfa: parseInt(cpm_amount),
        plan_achete: plan,
        statut: "accepté",
        created_at: new Date().toISOString(),
      });

      if (paymentError) throw paymentError;

      // Logic for sending confirmation email could go here
      // await envoyerEmailConfirmation(userId, plan);

      return NextResponse.json({ success: true });
    } else {
      // Record failed payment
      if (userId) {
        await supabase.from("payments").insert({
          user_id: userId,
          cinetpay_transaction_id: cpm_trans_id,
          montant_fcfa: parseInt(cpm_amount),
          plan_achete: plan,
          statut: "échoué",
          created_at: new Date().toISOString(),
        });
      }
      return NextResponse.json({ success: false, message: cpm_error_message });
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
