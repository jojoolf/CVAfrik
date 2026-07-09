import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSubscriptionExpiryDate } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const transactionId = formData.get("cpm_trans_id");
    const siteId = formData.get("cpm_site_id");

    // Verification with CinetPay
    const checkResponse = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: siteId,
        transaction_id: transactionId,
      }),
    });

    const checkData = await checkResponse.json();

    if (checkData.code === "00" && checkData.data.status === "ACCEPTED") {
      const metadata = JSON.parse(checkData.data.metadata);
      const { userId, planId } = metadata;
      const expiryDate = getSubscriptionExpiryDate(
        planId,
        Number(checkData.data.amount || 0),
      );

      // Initialize Supabase admin client to bypass RLS
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );

      // Update user profile plan
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: planId,
          plan_expiry: expiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Webhook update error:", updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      // Log transaction
      await supabaseAdmin.from("payments").insert({
        user_id: userId,
        cinetpay_transaction_id: transactionId,
        montant_fcfa: checkData.data.amount,
        plan_achete: planId,
        statut: "accepte",
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
