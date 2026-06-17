'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { format, addDays } from 'date-fns'
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
    const gray = [120, 120, 120] as const

    // Logo
    try {
      const imgData = await fetch('/logo-cvafrik.jpeg').then(r => r.blob()).then(b => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(b)
        })
      })
      pdf.addImage(imgData, 'JPEG', margin, y, 40, 40)
    } catch {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(26)
      pdf.setTextColor(...primary)
      pdf.text('CVAfrik', margin, y + 20)
    }

    // Invoice title
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(28)
    pdf.setTextColor(50, 50, 50)
    pdf.text('FACTURE', pageW - margin, y + 16, { align: 'right' })
    const invoiceNum = `FACT-${payment.id.slice(0, 8).toUpperCase()}`
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(...gray)
    pdf.text(`N° ${invoiceNum}`, pageW - margin, y + 28, { align: 'right' })

    y += 50

    // Separator line
    pdf.setDrawColor(220, 220, 220)
    pdf.line(margin, y, pageW - margin, y)
    y += 10

    // From / To
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...gray)
    pdf.text('ÉMETTEUR', margin, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(50, 50, 50)
    pdf.text('CVAfrik', margin, y + 6)
    pdf.text('contact@cvafrik.com', margin, y + 12)
    pdf.text('Cotonou, Bénin', margin, y + 18)

    const toX = margin + 90
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...gray)
    pdf.text('CLIENT', toX, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(50, 50, 50)
    pdf.text(userName || 'Client', toX, y + 6)
    if (userEmail) pdf.text(userEmail, toX, y + 12)

    const infoX = toX + 70
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...gray)
    pdf.text('DATE', infoX, y)
    pdf.text('ÉCHÉANCE', infoX + 40, y)

    const d = new Date(payment.created_at)
    const endDate = addDays(d, 30)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(50, 50, 50)
    pdf.text(format(d, 'dd/MM/yyyy', { locale: fr }), infoX, y + 6)
    pdf.text(format(d, 'HH:mm', { locale: fr }), infoX, y + 12)
    pdf.text(format(endDate, 'dd/MM/yyyy', { locale: fr }), infoX + 40, y + 6)

    // Status badge
    if (payment.statut === 'accepte') {
      pdf.setFillColor(22, 163, 74)
    } else {
      pdf.setFillColor(245, 158, 11)
    }
    pdf.roundedRect(infoX + 40, y + 14, 24, 6, 1, 1, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.text(payment.statut === 'accepte' ? 'PAYÉ' : 'EN ATTENTE', infoX + 40 + 12, y + 18.5, { align: 'center' })

    y += 34

    // ---- Table ----
    const colDefs = [
      { x: margin, w: bodyW - 100 },
      { x: margin + (bodyW - 100), w: 45 },
      { x: pageW - margin - 45, w: 45 },
    ]

    // Table header
    pdf.setFillColor(50, 50, 50)
    pdf.rect(margin, y, bodyW, 9, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('DESCRIPTION', colDefs[0].x + 4, y + 6)
    pdf.text('PÉRIODE', colDefs[1].x + 4, y + 6)
    pdf.text('PRIX', colDefs[2].x + 4, y + 6, { align: 'right' })
    y += 9

    // Table row
    pdf.setFillColor(248, 248, 248)
    pdf.rect(margin, y, bodyW, 12, 'F')
    pdf.line(margin, y, pageW - margin, y)

    pdf.setTextColor(50, 50, 50)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.text(`Abonnement ${getPlanName(payment.plan_achete)}`, colDefs[0].x + 4, y + 8)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.text(format(d, 'MMM yyyy', { locale: fr }), colDefs[1].x + 4, y + 8)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.text(`${payment.montant_fcfa.toLocaleString()} FCFA`, colDefs[2].x + colDefs[2].w - 4, y + 8, { align: 'right' })

    y += 12

    // Bottom border
    pdf.line(margin, y, pageW - margin, y)
    y += 2

    // Total row
    const totalX = colDefs[1].x
    pdf.setFillColor(50, 50, 50)
    pdf.rect(totalX, y, colDefs[1].w + colDefs[2].w, 9, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('TOTAL', totalX + 4, y + 6)
    pdf.text(`${payment.montant_fcfa.toLocaleString()} FCFA`, pageW - margin - 4, y + 6, { align: 'right' })

    y += 18

    // ---- Infos de paiement ----
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...gray)
    pdf.text('INFORMATIONS DE PAIEMENT', margin, y)
    y += 5
    pdf.line(margin, y, pageW - margin, y)
    y += 6

    const payDetails: [string, string][] = [
      ['Mode de paiement', payment.methode === 'Manuel' ? 'Mobile Money' : payment.methode],
      ['Référence transaction', payment.transaction_id],
      ['Opérateur', payment.operateur || '—'],
      ['Date de souscription', format(d, 'dd MMMM yyyy à HH:mm', { locale: fr })],
      ['Fin d\'abonnement', format(endDate, 'dd MMMM yyyy', { locale: fr })],
    ]

    payDetails.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(...gray)
      pdf.text(label, margin, y + 4)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(50, 50, 50)
      pdf.text(value, margin + 55, y + 4)
      y += 7
    })

    // ---- Footer ----
    const footerY = 275
    pdf.line(margin, footerY, pageW - margin, footerY)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(160, 160, 160)
    pdf.text('CVAfrik — Création de CV professionnels pour l\'Afrique', margin, footerY + 5)
    pdf.text('contact@cvafrik.com', pageW - margin, footerY + 5, { align: 'right' })

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
