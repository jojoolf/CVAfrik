'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import jsPDF from 'jspdf'

interface Payment {
  id: string
  cinetpay_transaction_id: string
  montant_fcfa: number
  montant_usd: number | null
  plan_achete: string
  operateur: string | null
  statut: string
  created_at: string
}

interface Plan {
  id: string
  nom: string
  prix_fcfa: number
  prix_usd: number
}

export function InvoicesList({ payments, plans }: { payments: Payment[]; plans: Plan[] }) {
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
    const margin = 20
    let y = margin

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.setTextColor(200, 80, 50)
    pdf.text('CVAfrik', margin, y)
    y += 6
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Facture de paiement', margin, y)
    y += 14

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)

    const lines = [
      ['Facture N°', `FACT-${payment.id.slice(0, 8).toUpperCase()}`],
      ['Date', format(new Date(payment.created_at), 'dd MMMM yyyy', { locale: fr })],
      ['Plan', getPlanName(payment.plan_achete)],
      ['Montant', `${payment.montant_fcfa.toLocaleString()} FCFA`],
      ['Transaction', payment.cinetpay_transaction_id],
      ['Statut', payment.statut === 'accepte' ? 'Paye' : payment.statut],
    ]

    for (const [label, value] of lines) {
      if (y > 270) {
        pdf.addPage()
        y = margin
      }
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, margin, y)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, margin + 50, y)
      y += 8
    }

    y += 10
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Realise avec CVAfrik', margin, y)

    pdf.save(`facture-${payment.plan_achete}-${format(new Date(payment.created_at), 'yyyy-MM-dd')}.pdf`)
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
