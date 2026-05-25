import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("cvs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfWeek.toISOString());

    const { count: totalCount } = await supabase
      .from("cvs")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      thisWeek: count || 0,
      total: totalCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
