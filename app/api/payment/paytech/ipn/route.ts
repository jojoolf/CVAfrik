import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendPaymentReceipt } from "@/lib/email";
import { PLANS } from "@/lib/types";

export async function POST(req: Request) {
  try {
    let bodyData: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      bodyData = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      bodyData = Object.fromEntries(formData.entries());
    } else {
      const text = await req.text();
      try {
        bodyData = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        bodyData = Object.fromEntries(params.entries());
      }
    }

    console.log("PayTech IPN Received:", bodyData);

    const apiKey = (process.env.PAYTECH_API_KEY || "").trim();
    const apiSecret = (process.env.PAYTECH_API_SECRET || "").trim();

    // Verify sha256 hashes if provided by PayTech
    if (bodyData.api_key_sha256 && apiKey) {
      const expectedKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
      if (bodyData.api_key_sha256 !== expectedKeyHash) {
        console.error("PayTech IPN Key Hash Mismatch");
        return NextResponse.json({ error: "Invalid API Key signature" }, { status: 400 });
      }
    }

    if (bodyData.api_secret_sha256 && apiSecret) {
      const expectedSecretHash = crypto.createHash("sha256").update(apiSecret).digest("hex");
      if (bodyData.api_secret_sha256 !== expectedSecretHash) {
        console.error("PayTech IPN Secret Hash Mismatch");
        return NextResponse.json({ error: "Invalid API Secret signature" }, { status: 400 });
      }
    }

    // Parse custom_field
    let customField: any = {};
    if (bodyData.custom_field) {
      try {
        customField = typeof bodyData.custom_field === "string"
          ? JSON.parse(bodyData.custom_field)
          : bodyData.custom_field;
      } catch (e) {
        console.error("Error parsing custom_field:", e);
      }
    }

    const userId = customField.userId || bodyData.client_phone;
    const planId = customField.planId || "pro";
    const durationId = customField.durationId || "1m";
    const amount = Number(bodyData.item_price || customField.amount || 2600);
    const refCommand = bodyData.ref_command || bodyData.token || `paytech_${Date.now()}`;

    if (!userId) {
      console.error("PayTech IPN Missing userId");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate plan_expiry
    const now = new Date();
    let daysToAdd = 30;
    if (durationId === "15j") daysToAdd = 15;
    else if (durationId === "1m") daysToAdd = 30;
    else if (durationId === "3m") daysToAdd = 90;
    else if (durationId === "6m") daysToAdd = 180;
    else if (durationId === "1y" || durationId === "annual") daysToAdd = 365;

    const expiryDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    // Update profile
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: planId,
        plan_expiry: expiryDate.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("PayTech IPN Profile Update Error:", updateError);
      return NextResponse.json({ error: "Database profile update failed" }, { status: 500 });
    }

    // Insert payment record
    await supabaseAdmin.from("payments").insert({
      user_id: userId,
      cinetpay_transaction_id: refCommand,
      montant_fcfa: amount,
      plan_achete: planId,
      statut: "accepte",
      created_at: now.toISOString(),
    });

    // Send confirmation email
    try {
      const { data: userObj } = await supabaseAdmin.auth.admin.getUserById(userId);
      const userEmail = userObj?.user?.email || customField.userEmail;

      if (userEmail) {
        const userName = userObj?.user?.user_metadata?.full_name || userEmail.split("@")[0];
        const planInfo = PLANS.find((p) => p.id === planId);
        const planName = planInfo?.nom || "Career Pro";

        await sendPaymentReceipt({
          to: userEmail,
          userName,
          planName,
          amount: `${amount.toLocaleString()} FCFA (${durationId})`,
          billing: durationId,
          transactionId: refCommand,
          paymentMethod: "PayTech (Mobile Money / Carte)",
        });
      }
    } catch (emailErr) {
      console.error("PayTech IPN Receipt Email Error:", emailErr);
    }

    return NextResponse.json({ status: "success", message: "Abonnement activé avec succès" });
  } catch (error: any) {
    console.error("PayTech IPN Exception:", error);
    return NextResponse.json({ error: error.message || "IPN Error" }, { status: 500 });
  }
}
