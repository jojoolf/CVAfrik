import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["nokejoel@gmail.com", "jojoolf@gmail.com"];

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if table exists first
    const { error: tableCheckError } = await supabase
      .from("manual_payments")
      .select("id", { count: "exact", head: true });

    if (tableCheckError) {
      console.error("Table manual_payments access error:", tableCheckError);
      return NextResponse.json({
        success: false,
        error: `Table 'manual_payments' inaccessible: ${tableCheckError.message}. Cree la table dans Supabase.`
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("manual_payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error("Admin payments list error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
