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
}

export async function sendPaymentReceipt({
  to,
  userName,
  planName,
  amount,
  billing,
  transactionId,
  paymentMethod,
}: SendReceiptParams) {
  const periodText = billing === 'annual' ? 'abonnement annuel' : 'abonnement mensuel'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'factures@cvafrik.com' // Doit etre un domaine verifie dans Resend

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; opacity: 0.9; }
    .body { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .details { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .details table { width: 100%; }
    .details td { padding: 8px 0; font-size: 14px; }
    .details td:last-child { text-align: right; font-weight: 600; }
    .total td { border-top: 2px solid #d97706; padding-top: 12px; font-size: 16px; }
    .total td:last-child { color: #d97706; font-size: 20px; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
    .badge { display: inline-block; background: #d97706; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .status { text-align: center; margin: 20px 0; }
    .status .check { width: 60px; height: 60px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Paiement confirme !</h1>
      <p>Merci pour votre abonnement CVAfrik</p>
    </div>
    <div class="body">
      <div class="status">
        <div class="check">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <p style="text-align:center;font-size:16px;">Bonjour <strong>${userName}</strong>,</p>
      <p style="text-align:center;color:#6b7280;">Votre paiement a ete confirme avec succes. Voici les details de votre transaction :</p>

      <div class="details">
        <table>
          <tr><td>Plan</td><td><span class="badge">${planName}</span></td></tr>
          <tr><td>Type</td><td>${periodText}</td></tr>
          <tr><td>Montant</td><td>${amount}</td></tr>
          <tr><td>Mode de paiement</td><td>${paymentMethod}</td></tr>
          <tr><td>Transaction</td><td style="font-family:monospace;font-size:12px;">${transactionId}</td></tr>
          <tr class="total"><td><strong>Total paye</strong></td><td><strong>${amount}</strong></td></tr>
        </table>
      </div>

      <p style="color:#6b7280;font-size:14px;">
        Votre abonnement est maintenant actif. Vous pouvez des a present profiter de toutes les fonctionnalites de votre plan.
      </p>

      <div style="text-align:center;margin-top:24px;">
        <a href="https://cvafrik.com/dashboard" style="display:inline-block;background:#d97706;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Acceder au tableau de bord
        </a>
      </div>
    </div>
    <div class="footer">
      <p>CVAfrik - Creer des CV professionnels pour l'Afrique</p>
      <p>contact@cvafrik.com</p>
    </div>
  </div>
</body>
</html>`

  try {
    const resend = getResend()
    if (!resend) {
      console.log('RESEND_API_KEY not configured, skipping email')
      return { success: false, error: 'Email service not configured' }
    }

    const result = await resend.emails.send({
      from: `CVAfrik <${fromEmail}>`,
      to,
      subject: `Facture CVAfrik - Paiement confirme pour ${planName}`,
      html,
    })

    console.log('Email sent successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
