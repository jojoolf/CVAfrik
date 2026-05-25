import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentReceipt } from "@/lib/email";
import { PLANS } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const event = payload.event;
    const transaction = payload.entity;

    if (event === "transaction.approved") {
      const { userId, planId, billing } = transaction.metadata;

      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Update user profile
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: planId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("FedaPay Webhook Update Error:", updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      // Log transaction
      await supabaseAdmin.from("payments").insert({
        user_id: userId,
        cinetpay_transaction_id: transaction.reference,
        montant_fcfa: transaction.amount,
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
            transactionId: transaction.reference,
            paymentMethod: 'Carte bancaire (FedaPay)',
          });
        }
      } catch (emailError) {
        console.error("Failed to send receipt email:", emailError);
      }

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error: any) {
    console.error("FedaPay Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
