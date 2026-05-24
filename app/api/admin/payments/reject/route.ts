import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { paymentId } = await req.json();

    const { error } = await supabase
      .from("manual_payments")
      .update({ statut: "rejete" })
      .eq("id", paymentId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin payment reject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
