import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      { count: totalUsers },
      { count: newUsersMonth },
      { count: totalCVs },
      { count: cvsMonth },
      { count: paidUsers },
      { count: paymentsMonth },
      { count: pendingPayments },
      { count: approvedPayments },
      { count: lettreCount },
      { count: simuCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
      supabase.from("cvs").select("*", { count: "exact", head: true }),
      supabase.from("cvs").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
      supabase.from("profiles").select("*", { count: "exact", head: true }).neq("plan", "gratuit"),
      supabase.from("payments").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
      supabase.from("manual_payments").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
      supabase.from("manual_payments").select("*", { count: "exact", head: true }).eq("statut", "valide"),
      supabase.from("lettres_motivation").select("*", { count: "exact", head: true }),
      supabase.from("simulations_entretien").select("*", { count: "exact", head: true }),
    ]);

    // Calculate revenue from manual payments this month
    const { data: manualPayments } = await supabase
      .from("manual_payments")
      .select("montant")
      .gte("created_at", startOfMonth.toISOString())
      .eq("statut", "valide");

    const { data: autoPayments } = await supabase
      .from("payments")
      .select("montant_fcfa")
      .gte("created_at", startOfMonth.toISOString())
      .eq("statut", "accepte");

    const manualRevenue = manualPayments?.reduce((sum, p) => sum + (p.montant || 0), 0) || 0;
    const autoRevenue = autoPayments?.reduce((sum, p) => sum + Number(p.montant_fcfa || 0), 0) || 0;
    const totalRevenue = manualRevenue + autoRevenue;
    const approvalRate = (approvedPayments || 0) / Math.max((approvedPayments || 0) + (pendingPayments || 0), 1) * 100;

    return NextResponse.json({
      success: true,
      users: { total: totalUsers || 0, newThisMonth: newUsersMonth || 0 },
      cvs: { total: totalCVs || 0, thisMonth: cvsMonth || 0 },
      paidUsers: paidUsers || 0,
      payments: { thisMonth: paymentsMonth || 0, pending: pendingPayments || 0, approved: approvedPayments || 0 },
      revenue: { total: totalRevenue, manual: manualRevenue, auto: autoRevenue },
      approvalRate: Math.round(approvalRate),
      lettres: lettreCount || 0,
      simulations: simuCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
