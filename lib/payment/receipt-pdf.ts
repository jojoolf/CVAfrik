import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { jsPDF } from 'jspdf'

export type ReceiptPdfData = {
  paymentId: string
  transactionId: string
  customerName: string
  customerEmail: string
  planName: string
  amountFcfa: number
  paymentMethod: string
  issuedAt: string | Date
  expiryAt: string | Date | null
  durationLabel: string | null
}

const orange = [235, 118, 0] as const
const navy = [12, 35, 72] as const
const muted = [104, 112, 125] as const
const pale = [247, 249, 252] as const

const asDate = (value: string | Date) => value instanceof Date ? value : new Date(value)
const formatDate = (value: string | Date) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(asDate(value))
const formatDateTime = (value: string | Date) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(asDate(value))
const amount = (value: number) => `${Number(value || 0).toLocaleString('fr-FR')} FCFA`

function invoiceNumber(paymentId: string, issuedAt: string | Date) {
  const year = asDate(issuedAt).getFullYear()
  return `CVA-${year}-${paymentId.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

async function officialLogoDataUrl() {
  const buffer = await readFile(path.join(process.cwd(), 'public', 'brand', 'cvafrik-invoice-wordmark.jpg'))
  return `data:image/jpeg;base64,${buffer.toString('base64')}`
}

function text(pdf: jsPDF, content: string, x: number, y: number, options?: Parameters<jsPDF['text']>[3]) {
  pdf.text(content, x, y, options)
}

export async function createPaymentReceiptPdf(data: ReceiptPdfData): Promise<Buffer> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const margin = 16
  const bodyWidth = pageWidth - margin * 2
  const issuedAt = asDate(data.issuedAt)
  const invoice = invoiceNumber(data.paymentId, issuedAt)

  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, 210, 297, 'F')

  try {
    pdf.addImage(await officialLogoDataUrl(), 'JPEG', margin, 16, 48, 17)
  } catch {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.setTextColor(...navy)
    text(pdf, 'CVAfrik', margin, 28)
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(25)
  pdf.setTextColor(...navy)
  text(pdf, 'FACTURE', pageWidth - margin, 25, { align: 'right' })
  pdf.setFillColor(22, 163, 74)
  pdf.roundedRect(pageWidth - margin - 32, 30, 32, 8, 2, 2, 'F')
  pdf.setFontSize(9)
  pdf.setTextColor(255, 255, 255)
  text(pdf, 'PAYÉE', pageWidth - margin - 16, 35.2, { align: 'center' })

  pdf.setDrawColor(...orange)
  pdf.setLineWidth(0.8)
  pdf.line(margin, 42, pageWidth - margin, 42)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(...navy)
  text(pdf, `N° ${invoice}`, pageWidth - margin, 51, { align: 'right' })

  const cardY = 61
  const cardHeight = 32
  const cardGap = 6
  const cardWidth = (bodyWidth - cardGap) / 2
  pdf.setDrawColor(224, 228, 234)
  pdf.setLineWidth(0.35)
  pdf.roundedRect(margin, cardY, cardWidth, cardHeight, 2, 2, 'S')
  pdf.roundedRect(margin + cardWidth + cardGap, cardY, cardWidth, cardHeight, 2, 2, 'S')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(...orange)
  text(pdf, 'ÉMETTEUR', margin + 6, cardY + 8)
  text(pdf, 'CLIENT', margin + cardWidth + cardGap + 6, cardY + 8)
  pdf.setTextColor(...navy)
  pdf.setFontSize(13)
  text(pdf, 'CVAfrik', margin + 6, cardY + 17)
  text(pdf, data.customerName || 'Client', margin + cardWidth + cardGap + 6, cardY + 17)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(...muted)
  text(pdf, 'Plateforme de carrière', margin + 6, cardY + 24)
  const emailLines = pdf.splitTextToSize(data.customerEmail || '—', cardWidth - 12)
  text(pdf, emailLines, margin + cardWidth + cardGap + 6, cardY + 24)

  const tableY = 106
  const colOne = 77
  const colTwo = 47
  const colThree = bodyWidth - colOne - colTwo
  pdf.setFillColor(...navy)
  pdf.roundedRect(margin, tableY, bodyWidth, 10, 1.5, 1.5, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(255, 255, 255)
  text(pdf, 'DESCRIPTION', margin + 5, tableY + 6.5)
  text(pdf, 'PÉRIODE', margin + colOne + 5, tableY + 6.5)
  text(pdf, 'MONTANT', pageWidth - margin - 5, tableY + 6.5, { align: 'right' })

  pdf.setFillColor(...pale)
  pdf.roundedRect(margin, tableY + 10, bodyWidth, 17, 0, 0, 'F')
  pdf.setDrawColor(224, 228, 234)
  pdf.line(margin + colOne, tableY + 10, margin + colOne, tableY + 27)
  pdf.line(margin + colOne + colTwo, tableY + 10, margin + colOne + colTwo, tableY + 27)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...navy)
  text(pdf, `Abonnement ${data.planName}`, margin + 5, tableY + 20)
  const period = data.expiryAt ? `${formatDate(issuedAt)} – ${formatDate(data.expiryAt)}` : data.durationLabel || 'Abonnement actif'
  text(pdf, pdf.splitTextToSize(period, colTwo - 8), margin + colOne + 5, tableY + 18)
  pdf.setFont('helvetica', 'bold')
  text(pdf, amount(data.amountFcfa), pageWidth - margin - 5, tableY + 20, { align: 'right' })

  const totalY = tableY + 35
  pdf.setFillColor(...navy)
  pdf.roundedRect(margin, totalY, bodyWidth, 19, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(255, 255, 255)
  text(pdf, 'TOTAL PAYÉ', margin + 8, totalY + 12.2)
  pdf.setFontSize(20)
  text(pdf, amount(data.amountFcfa), pageWidth - margin - 8, totalY + 13, { align: 'right' })

  const paymentY = totalY + 29
  pdf.setDrawColor(159, 205, 177)
  pdf.roundedRect(margin, paymentY, bodyWidth, 44, 2, 2, 'S')
  pdf.setFillColor(239, 250, 243)
  pdf.roundedRect(margin + 5, paymentY + 6, 23, 23, 11, 11, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(15)
  pdf.setTextColor(22, 163, 74)
  text(pdf, '✓', margin + 16.5, paymentY + 22, { align: 'center' })
  pdf.setFontSize(13)
  pdf.setTextColor(...navy)
  text(pdf, 'Paiement sécurisé', margin + 36, paymentY + 12)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  text(pdf, data.paymentMethod || 'FedaPay', margin + 36, paymentY + 20)
  pdf.setDrawColor(224, 228, 234)
  pdf.line(margin + 36, paymentY + 24, pageWidth - margin - 6, paymentY + 24)
  pdf.setFontSize(9)
  pdf.setTextColor(...muted)
  text(pdf, 'Référence :', margin + 36, paymentY + 31)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...navy)
  text(pdf, data.transactionId, margin + 57, paymentY + 31)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...muted)
  text(pdf, `Paiement effectué le ${formatDateTime(issuedAt)}`, margin + 36, paymentY + 38)

  pdf.setDrawColor(...orange)
  pdf.line(margin, 275, pageWidth - margin, 275)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...navy)
  text(pdf, 'Merci de faire confiance à CVAfrik.', pageWidth / 2, 283, { align: 'center' })
  pdf.setTextColor(...muted)
  pdf.setFontSize(7.5)
  text(pdf, 'Reçu d’abonnement — à conserver pour vos dossiers.', pageWidth / 2, 289, { align: 'center' })

  return Buffer.from(pdf.output('arraybuffer'))
}

export function receiptFileName(data: Pick<ReceiptPdfData, 'paymentId' | 'issuedAt' | 'planName'>) {
  const date = asDate(data.issuedAt).toISOString().slice(0, 10)
  const slug = data.planName.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')
  return `facture-${slug || 'abonnement'}-${date}-${data.paymentId.slice(0, 8)}.pdf`
}
