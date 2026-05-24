'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import jsPDF from 'jspdf'

interface Payment {
  id: string
  transaction_id: string
  montant_fcfa: number
  montant_usd: number | null
  plan_achete: string
  operateur: string | null
  methode: string
  statut: string
  created_at: string
}

interface Plan {
  id: string
  nom: string
  prix_fcfa: number
  prix_usd: number
}

export function InvoicesList({ payments, plans, userName, userEmail }: { payments: Payment[]; plans: Plan[]; userName: string; userEmail: string }) {
  const getPlanName = (planId: string) => {
    return plans.find(p => p.id === planId)?.nom || planId
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'accepte':
        return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20', label: 'Paye' }
      case 'rejete':
        return { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-950/20', label: 'Rejete' }
      default:
        return { icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20', label: 'En attente' }
    }
  }

  const generatePDF = async (payment: Payment) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageW = 210
    const margin = 20
    const bodyW = pageW - margin * 2
    let y = margin

    const primary = [200, 80, 50] as const
    const gray = [100, 100, 100] as const
    const lightGray = [240, 240, 240] as const
    const dark = [40, 40, 40] as const

    // ---- Header bar ----
    pdf.setFillColor(248, 248, 248)
    pdf.rect(margin, y, bodyW, 36, 'F')
    pdf.setDrawColor(220, 220, 220)
    pdf.rect(margin, y, bodyW, 36, 'S')

    // Try to add logo, if not available use text
    try {
      const imgData = await fetch('/logo-cvafrik.jpeg').then(r => r.blob()).then(b => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(b)
        })
      })
      pdf.addImage(imgData, 'JPEG', margin + 6, y + 4, 28, 28)
    } catch {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.setTextColor(...primary)
      pdf.text('CVAfrik', margin + 6, y + 22)
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    pdf.setTextColor(...dark)
    pdf.text('FACTURE', pageW - margin - 6, y + 14, { align: 'right' })
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...gray)
    const invoiceNum = `FACT-${payment.id.slice(0, 8).toUpperCase()}`
    pdf.text(`N° ${invoiceNum}`, pageW - margin - 6, y + 22, { align: 'right' })
    y += 44

    // ---- From / To section ----
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...gray)
    pdf.text('FACTURE DE', margin, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(...dark)
    const fromLines = ['CVAfrik', 'contact@cvafrik.com', 'Cotonou, Benin']
    fromLines.forEach((line, i) => {
      pdf.text(line, margin, y + 4 + i * 4.5)
    })

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...gray)
    pdf.text('FACTURE POUR', margin + 80, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(...dark)
    const toLines = [userName || 'Client', userEmail || '']
    toLines.forEach((line, i) => {
      if (line) pdf.text(line, margin + 80, y + 4 + i * 4.5)
    })

    // Invoice info on the right
    const infoX = margin + 120
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...gray)
    pdf.text('DATE', infoX, y)
    pdf.text('STATUT', infoX + 44, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...dark)
    const d = new Date(payment.created_at)
    pdf.text(format(d, 'dd MMMM yyyy', { locale: fr }), infoX, y + 4)
    pdf.text(format(d, 'HH:mm', { locale: fr }), infoX, y + 9)
    pdf.setTextColor(...primary)
    pdf.setFont('helvetica', 'bold')
    pdf.text(payment.statut === 'accepte' ? 'PAYE' : payment.statut.toUpperCase(), infoX + 44, y + 4)

    y += 22

    // ---- Table header ----
    const colX = [margin, margin + 90, margin + 135, pageW - margin - 30]
    const colW = [colX[1] - colX[0], colX[2] - colX[1], colX[3] - colX[2], 30]

    pdf.setFillColor(...primary)
    pdf.rect(margin, y, bodyW, 8, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    const headers = ['DESCRIPTION', 'ABONNEMENT', 'MONTANT', 'TOTAL']
    headers.forEach((h, i) => {
      pdf.text(h, colX[i] + 3, y + 5.5)
    })
    y += 8

    // ---- Table row ----
    pdf.setFillColor(250, 250, 250)
    pdf.rect(margin, y, bodyW, 10, 'F')
    pdf.setDrawColor(235, 235, 235)
    pdf.line(margin, y, pageW - margin, y)

    pdf.setTextColor(...dark)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`Abonnement ${getPlanName(payment.plan_achete)}`, colX[0] + 3, y + 6.5)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`${format(d, 'MMM yyyy', { locale: fr })}`, colX[1] + 3, y + 6.5)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`${payment.montant_fcfa.toLocaleString()} FCFA`, colX[2] + 3, y + 6.5)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text(`${payment.montant_fcfa.toLocaleString()} FCFA`, colX[3] + 3, y + 6.5)
    y += 10

    // ---- Bottom border ----
    pdf.setDrawColor(235, 235, 235)
    pdf.line(margin, y, pageW - margin, y)
    y += 3

    // ---- Total row ----
    pdf.setFillColor(...primary)
    pdf.rect(colX[2], y, colX[3] + colW[3] - colX[2], 8, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('TOTAL', colX[2] + 3, y + 5.5)
    pdf.text(`${payment.montant_fcfa.toLocaleString()} FCFA`, colX[3] + 3, y + 5.5)
    y += 14

    // ---- Payment details ----
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...gray)
    pdf.text('INFORMATIONS DE PAIEMENT', margin, y)
    y += 4

    pdf.setDrawColor(235, 235, 235)
    pdf.line(margin, y, pageW - margin, y)
    y += 4

    const payDetails: [string, string][] = [
      ['Mode de paiement', payment.methode === 'Manuel' ? 'Mobile Money' : payment.methode],
      ['Transaction', payment.transaction_id],
      ['Operateur', payment.operateur || 'N/A'],
    ]

    payDetails.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.setTextColor(...gray)
      pdf.text(label, margin, y + 4)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...dark)
      pdf.text(value, margin + 50, y + 4)
      y += 6
    })

    y += 6

    // ---- Footer ----
    pdf.setDrawColor(235, 235, 235)
    pdf.line(margin, y, pageW - margin, y)
    y += 4
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(...gray)
    pdf.text('CVAfrik - Creation de CV professionnels pour l Afrique', margin, y)
    pdf.text('contact@cvafrik.com', pageW - margin, y, { align: 'right' })

    pdf.save(`facture-${payment.plan_achete}-${format(d, 'yyyy-MM-dd')}.pdf`)
  }

  if (payments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucune facture</h3>
          <p className="text-sm text-muted-foreground/70 max-w-sm">
            Vous n&apos;avez pas encore effectue de paiement. Vos factures apparaitront ici.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => {
        const badge = getStatutBadge(payment.statut)
        return (
          <Card key={payment.id} className="hover:border-primary/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      Plan {getPlanName(payment.plan_achete)}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="font-medium">
                        {payment.montant_fcfa.toLocaleString()} FCFA
                      </span>
                      <span>•</span>
                      <span className="capitalize">{payment.methode === 'Manuel' ? 'Mobile Money' : payment.methode}</span>
                      <span>•</span>
                      <span>{format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                      <span>•</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                        <badge.icon size={12} />
                        {badge.label}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full shrink-0"
                  onClick={() => generatePDF(payment)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
