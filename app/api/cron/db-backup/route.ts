import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    if (process.env.CRON_SECRET && request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const date = new Date().toISOString().split("T")[0];
    const backup: Record<string, unknown> = { date, tables: {} };

    const tables = ["profiles", "cvs", "payments", "manual_payments", "blog_posts", "newsletter_subscribers", "support_tickets", "simulations_entretien", "lettres_motivation", "suivi_candidatures", "admin_logs"];

    for (const table of tables) {
      const { data } = await supabase.from(table).select("*").limit(1000);
      backup.tables[table] = data || [];
    }

    // Store backup in Supabase Storage (bucket "backups" must be created)
    const fileName = `backup-${date}.json`;
    const { error: uploadError } = await supabase.storage
      .from("backups")
      .upload(fileName, JSON.stringify(backup, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Send notification email to admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "CVAfrik <onboarding@resend.dev>",
        to: "nokejoel@gmail.com",
        subject: `Sauvegarde BD - ${date}`,
        html: `<p>Sauvegarde de la base de données terminée avec succès pour le ${date}.</p><p>${tables.length} tables sauvegardées.</p><p>Fichier: ${fileName}</p>`,
      });
    } catch {}

    return NextResponse.json({ success: true, date, tables: tables.length });
  } catch (error: any) {
    console.error("Backup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
