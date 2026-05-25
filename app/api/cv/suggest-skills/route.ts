import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { jobTitle, sector } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ success: false, error: "Titre du poste requis" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Tu es un expert en recrutement en Afrique. Pour le poste "${jobTitle}"${sector ? ` dans le secteur "${sector}"` : ""}, suggère UNIQUEMENT un tableau JSON valide avec 15 compétences les plus pertinentes pour le marché africain.

Format de réponse EXACT:
{ "competences": ["compétence 1", "compétence 2", ...], "langues": ["langue 1", "langue 2", ...], "certifications": ["certification 1", ...] }

Réponds UNIQUEMENT avec le JSON, sans texte avant ni après.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { competences: [], langues: [], certifications: [] };

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Suggest skills error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
