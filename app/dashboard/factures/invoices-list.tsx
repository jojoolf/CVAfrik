'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Download, FileText, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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

interface Plan { id: string; nom: string; prix_fcfa: number; prix_usd: number }

export function InvoicesList({ payments, plans }: { payments: Payment[]; plans: Plan[]; userName: string; userEmail: string }) {
  const getPlanName = (planId: string) => plans.find((plan) => plan.id === planId)?.nom || planId
  const getStatus = (status: string) => {
    if (status === 'accepte') return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20', label: 'Payée' }
    if (status === 'rejete') return { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-950/20', label: 'Rejetée' }
    return { icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20', label: 'En attente' }
  }

  if (!payments.length) return <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center py-16 text-center"><FileText className="mb-4 h-12 w-12 text-muted-foreground/50" /><h3 className="mb-2 text-lg font-medium text-muted-foreground">Aucune facture</h3><p className="max-w-sm text-sm text-muted-foreground/70">Vos factures apparaîtront ici après confirmation d’un paiement.</p></CardContent></Card>

  return <div className="space-y-4">{payments.map((payment) => {
    const status = getStatus(payment.statut)
    const StatusIcon = status.icon
    const approved = payment.statut === 'accepte'
    return <Card key={payment.id} className="transition-all hover:border-primary/30"><CardContent className="p-5"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10"><FileText className="h-6 w-6 text-primary" /></div><div className="min-w-0"><h3 className="truncate font-semibold text-foreground">Abonnement {getPlanName(payment.plan_achete)}</h3><div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"><span className="font-medium">{Number(payment.montant_fcfa || 0).toLocaleString('fr-FR')} FCFA</span><span>•</span><span>{payment.methode === 'Manuel' ? 'Mobile Money' : payment.methode}</span><span>•</span><span>{format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}</span><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}><StatusIcon size={12} />{status.label}</span></div></div></div>{approved ? <Button variant="outline" size="sm" className="shrink-0 rounded-full" asChild><a href={`/api/invoices/${payment.id}`}><Download className="mr-1 h-4 w-4" />PDF</a></Button> : <Button variant="outline" size="sm" disabled className="shrink-0 rounded-full">En attente</Button>}</div></CardContent></Card>
  })}</div>
}
