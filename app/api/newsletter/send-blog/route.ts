import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { title, slug, category } = await req.json();

    // Get all subscribers
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email, prenom");

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    const blogUrl = `https://cv-afrik.vercel.app/blog/${slug}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const categoryLabels: Record<string, string> = {
      "offres-emploi": "Offre d'emploi",
      stages: "Stage",
      conseils: "Conseils & Carrière",
    };
    const catLabel = categoryLabels[category] || "Article";

    let sent = 0;
    for (const sub of subscribers) {
      try {
        const prenom = sub.prenom || "Cher abonné";
        await resend.emails.send({
          from: "CVAfrik <onboarding@resend.dev>",
          to: sub.email,
          subject: `Nouveau : ${title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="background:#c85032;padding:30px;text-align:center;">
                          <h1 style="color:#fff;margin:0;font-size:28px;">CVAfrik</h1>
                          <p style="color:rgba(255,255,255,0.8);margin:5px 0 0;font-size:14px;">Actualités & Opportunités</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:30px;">
                          <p style="color:#888;font-size:13px;margin:0 0 5px;">${catLabel}</p>
                          <h2 style="color:#222;font-size:22px;margin:0 0 15px;">${title}</h2>
                          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 25px;">Bonjour ${prenom},</p>
                          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 25px;">Un nouvel article vient d'être publié sur CVAfrik. Cliquez sur le bouton ci-dessous pour le lire.</p>
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:#c85032;border-radius:8px;padding:12px 30px;">
                                <a href="${blogUrl}" style="color:#fff;text-decoration:none;font-size:15px;font-weight:bold;display:inline-block;">Lire l'article →</a>
                              </td>
                            </tr>
                          </table>
                          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
                          <p style="color:#999;font-size:12px;margin:0;">Vous recevez cet email car vous êtes abonné à la newsletter CVAfrik.</p>
                          <p style="color:#999;font-size:12px;margin:5px 0 0;">CVAfrik — Création de CV professionnels pour l'Afrique</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error: any) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
