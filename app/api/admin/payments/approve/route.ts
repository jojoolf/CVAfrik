import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendPaymentReceipt } from "@/lib/email";
import { PLANS } from "@/lib/types";

const ADMIN_EMAILS = ["nokejoel@gmail.com", "jojoolf@gmail.com"];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { paymentId, userId, planId, billing } = await req.json();

    // Use service-role client to bypass RLS
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Update the manual payment status
    const { error: payError } = await supabaseAdmin
      .from("manual_payments")
      .update({ statut: "valide" })
      .eq("id", paymentId);

    if (payError) throw payError;

    // 2. Get current profile to check existing expiry
    const { data: currentProfile } = await supabaseAdmin
      .from("profiles")
      .select("plan_expiry")
      .eq("id", userId)
      .maybeSingle();

    // Calculate new expiry: extend from now or from remaining days
    const now = new Date();
    const currentExpiry = currentProfile?.plan_expiry ? new Date(currentProfile.plan_expiry) : null;
    const baseDate = (currentExpiry && currentExpiry > now) ? currentExpiry : now;
    const expiryDate = new Date(baseDate);
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        plan: planId,
        plan_expiry: expiryDate.toISOString(),
        updated_at: now.toISOString()
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // 3. Send email receipt
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const userEmail = userData?.user?.email;
      const userName = userData?.user?.user_metadata?.full_name || userEmail?.split('@')[0] || 'Utilisateur';
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
          transactionId: `MANUAL-${paymentId}`,
          paymentMethod: 'Transfert manuel',
        });
      }
    } catch (emailError) {
      console.error("Failed to send receipt email:", emailError);
    }

    // Log admin action
    await supabaseAdmin.from("admin_logs").insert({
      admin_email: user.email,
      action: "approve_payment",
      details: { paymentId, userId, planId, amount: billing }
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Approval Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
