import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("manual_payments")
      .select(`
        *,
        profiles (
          email,
          nom,
          prenom
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error("Admin payments list error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
