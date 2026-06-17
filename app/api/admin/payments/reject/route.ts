import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["nokejoel@gmail.com", "jojoolf@gmail.com"];

export async function POST(req: Request) {
  try {
    const auth = await createClient();
    const { data: { user } } = await auth.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { paymentId } = await req.json();

    const { error } = await supabase
      .from("manual_payments")
      .update({ statut: "rejete" })
      .eq("id", paymentId);

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_email: user.email,
      action: "reject_payment",
      details: { paymentId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin payment reject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
