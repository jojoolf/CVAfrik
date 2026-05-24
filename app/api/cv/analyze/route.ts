import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { cvData, userEmail, userName } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0,
        topP: 1,
        responseMimeType: "application/json",
      },
    });

    const prompt = `Tu es un expert en recrutement en Afrique. Analyse ce CV et retourne UNIQUEMENT un objet JSON valide avec cette structure exacte :
{
  "score": <nombre entier 0-100>,
  "details": {
    "clarte": <nombre 0-20>,
    "impact": <nombre 0-20>,
    "motsCles": <nombre 0-20>,
    "structure": <nombre 0-20>,
    "experience": <nombre 0-20>
  }
}

Grille de notation:
- clarte (0-20): Mise en page propre, sections bien definies, police lisible, informations faciles a trouver
- impact (0-20): Realisations chiffrees, verbes d'action, resultats concrets, propositions de valeur fortes
- motsCles (0-20): Mots-cles du secteur presents, competences techniques listees, certifications, langues
- structure (0-20): Ordre logique, sections appropriees, longueur adaptee, pas de fautes d'orthographe
- experience (0-20): Experience pertinente, progression de carriere, dates coherentes, descriptions detaillees

Le score TOTAL est la SOMME des 5 categories. Sois TRES strict et professionnel dans ta notation.

CV A ANALYSER:
${JSON.stringify(cvData, null, 2)}

REPONDS UNIQUEMENT AVEC LE JSON, rien d'autre.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { score: 50, details: { clarte: 10, impact: 10, motsCles: 10, structure: 10, experience: 10 } };
    }

    const finalScore = Math.min(100, Math.max(0, parsed.score || 50));

    if (finalScore >= 85 && userEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "CVAfrik <onboarding@resend.dev>",
          to: userEmail,
          subject: "Félicitations ! Votre CV est excellent !",
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
                        <td style="background:linear-gradient(135deg,#c85032,#e8783a);padding:30px;text-align:center;">
                          <h1 style="color:#fff;margin:0;font-size:28px;">Bravo ${userName || ""} !</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:30px;text-align:center;">
                          <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                            <span style="color:#fff;font-size:36px;font-weight:bold;">${finalScore}</span>
                          </div>
                          <h2 style="color:#222;font-size:22px;margin:0 0 10px;">Excellent CV !</h2>
                          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 25px;">Votre CV a obtenu un score de <strong>${finalScore}/100</strong>. C'est un excellent resultat ! Les recruteurs vont l'apprecier.</p>
                          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 25px;">Continuez a mettre a jour votre CV regulierement pour maximiser vos chances.</p>
                          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                            <tr>
                              <td style="background:#c85032;border-radius:8px;padding:12px 30px;">
                                <a href="https://cv-afrik.vercel.app/dashboard" style="color:#fff;text-decoration:none;font-size:15px;font-weight:bold;">Voir mon dashboard</a>
                              </td>
                            </tr>
                          </table>
                          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
                          <p style="color:#999;font-size:12px;margin:0;">CVAfrik — Creation de CV professionnels pour l'Afrique</p>
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
      } catch (emailErr) {
        console.error("Failed to send score notification:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      score: finalScore,
      details: parsed?.details || null,
      notified: finalScore >= 85,
    });
  } catch (error: any) {
    console.error("CV analyze error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
