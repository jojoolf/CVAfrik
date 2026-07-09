import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSubscriptionExpiryDate } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const event = payload.event;
    const transaction = payload.entity;

    if (event === "transaction.approved") {
      const { userId, planId } = transaction.metadata;
      const expiryDate = getSubscriptionExpiryDate(
        planId,
        Number(transaction.amount || 0),
      );

      // Initialize Supabase admin client
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );

      // Update user profile
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: planId,
          plan_expiry: expiryDate.toISOString(),
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
        cinetpay_transaction_id: transaction.reference, // Using reference as transaction ID
        montant_fcfa: transaction.amount,
        plan_achete: planId,
        statut: "accepte",
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error: any) {
    console.error("FedaPay Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
