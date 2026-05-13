import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["nokejoel@gmail.com", "jojoolf@gmail.com"]; // Ajoutez vos emails admin ici

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { paymentId, userId, planId } = await req.json();

    // 1. Update the manual payment status
    const { error: payError } = await supabase
      .from("manual_payments")
      .update({ statut: "valide" })
      .eq("id", paymentId);

    if (payError) throw payError;

    // 2. Update the user profile plan and expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        plan: planId,
        plan_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Approval Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
