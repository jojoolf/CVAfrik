import 'server-only'

import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

interface SendReceiptParams {
  to: string
  userName: string
  planName: string
  amount: string
  billing: 'monthly' | 'annual'
  transactionId: string
  paymentMethod: string
  receiptPdf: Buffer
  receiptFileName: string
}

export async function sendPaymentReceipt({
  to,
  userName,
  planName,
  amount,
  billing,
  transactionId,
  paymentMethod,
  receiptPdf,
  receiptFileName,
}: SendReceiptParams) {
  const periodText = billing === 'annual' ? 'abonnement annuel' : 'abonnement mensuel'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'factures@cvafrik.com'
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://cv-afrik.vercel.app').replace(/\/$/, '')
  const logoUrl = `${appUrl}/brand/cvafrik-invoice-wordmark.jpg`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#0c2348;">
  <div style="max-width:620px;margin:0 auto;padding:28px 16px;">
    <div style="overflow:hidden;border-radius:20px;background:#ffffff;box-shadow:0 10px 30px rgba(12,35,72,.09);">
      <div style="padding:28px 30px 18px;border-bottom:3px solid #eb7600;">
        <img src="${logoUrl}" alt="CVAfrik" width="165" style="display:block;width:165px;height:auto;max-width:100%;" />
      </div>
      <div style="padding:30px;">
        <div style="display:inline-block;border-radius:999px;background:#eaf8ef;color:#16803c;padding:7px 12px;font-size:12px;font-weight:700;">✓ PAIEMENT CONFIRMÉ</div>
        <h1 style="margin:16px 0 8px;font-size:25px;line-height:1.2;color:#0c2348;">Merci pour votre abonnement, ${userName}.</h1>
        <p style="margin:0;color:#657084;font-size:15px;line-height:1.6;">Votre paiement est confirmé et votre plan <strong>${planName}</strong> est maintenant actif.</p>
        <div style="margin:24px 0;border:1px solid #e4e8ef;border-radius:14px;background:#f9fbfd;padding:18px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#657084;">Plan</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#0c2348;">${planName}</td></tr>
            <tr><td style="padding:7px 0;color:#657084;">Période</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#0c2348;">${periodText}</td></tr>
            <tr><td style="padding:7px 0;color:#657084;">Paiement</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#0c2348;">${paymentMethod}</td></tr>
            <tr><td style="padding:7px 0;color:#657084;">Référence</td><td style="padding:7px 0;text-align:right;font-family:monospace;font-size:12px;font-weight:700;color:#0c2348;">${transactionId}</td></tr>
            <tr><td style="border-top:2px solid #eb7600;padding:14px 0 2px;color:#0c2348;font-size:16px;font-weight:800;">TOTAL PAYÉ</td><td style="border-top:2px solid #eb7600;padding:14px 0 2px;text-align:right;color:#eb7600;font-size:19px;font-weight:800;">${amount}</td></tr>
          </table>
        </div>
        <p style="margin:0;color:#657084;font-size:14px;line-height:1.6;">Votre facture PDF officielle est jointe à cet e-mail. Vous pourrez aussi la télécharger à tout moment depuis <strong>Mon abonnement</strong> dans CVAfrik.</p>
        <div style="margin-top:25px;text-align:center;"><a href="${appUrl}/dashboard/factures" style="display:inline-block;border-radius:10px;background:#eb7600;color:#ffffff;padding:13px 22px;text-decoration:none;font-size:14px;font-weight:700;">Voir mes factures</a></div>
      </div>
      <div style="padding:19px 30px;background:#f8fafc;color:#8993a4;text-align:center;font-size:12px;">CVAfrik · Votre carrière mérite le meilleur.</div>
    </div>
  </div>
</body>
</html>`

  try {
    const resend = getResend()
    if (!resend) {
      console.log('RESEND_API_KEY not configured, skipping receipt email')
      return { success: false, error: 'Email service not configured' }
    }

    const result = await resend.emails.send({
      from: `CVAfrik <${fromEmail}>`,
      to,
      subject: `Votre facture CVAfrik — ${planName}`,
      html,
      attachments: [{ filename: receiptFileName, content: receiptPdf }],
    })

    console.log('Payment receipt email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Payment receipt email error:', error)
    return { success: false, error }
  }
}
