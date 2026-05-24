import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentReceipt } from "@/lib/email";
import { PLANS } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const transactionId = formData.get("cpm_trans_id");
    const siteId = formData.get("cpm_site_id");

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
      const { userId, planId, billing } = metadata;

      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: planId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Webhook update error:", updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      await supabaseAdmin.from("payments").insert({
        user_id: userId,
        cinetpay_transaction_id: transactionId,
        montant_fcfa: checkData.data.amount,
        plan_achete: planId,
        statut: "accepte",
        created_at: new Date().toISOString(),
      });

      // Send email receipt
      try {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
        const userEmail = user?.user?.email;
        const userName = user?.user?.user_metadata?.full_name || userEmail?.split('@')[0] || 'Utilisateur';
        const planInfo = PLANS.find(p => p.id === planId);
        const planName = planInfo?.nom || planId;
        const isAnnual = billing === 'annual';
        const amount = isAnnual
          ? `${(planInfo?.prix_annuel_fcfa || 0).toLocaleString()} FCFA`
          : `${(planInfo?.prix_fcfa || 0).toLocaleString()} FCFA /mois`;

        if (userEmail) {
          await sendPaymentReceipt({
            to: userEmail,
            userName,
            planName,
            amount,
            billing: isAnnual ? 'annual' : 'monthly',
            transactionId: transactionId as string,
            paymentMethod: 'Mobile Money (CinetPay)',
          });
        }
      } catch (emailError) {
        console.error("Failed to send receipt email:", emailError);
      }

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
