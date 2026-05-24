import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { InvoicesList } from './invoices-list'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PLANS } from '@/lib/types'

export default async function FacturesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/connexion')

  const [paymentsRes, manualRes] = await Promise.all([
    supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('manual_payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  const autoPayments = (paymentsRes.data || []).map(p => ({
    id: p.id,
    transaction_id: p.cinetpay_transaction_id,
    montant_fcfa: p.montant_fcfa,
    montant_usd: p.montant_usd,
    plan_achete: p.plan_achete,
    operateur: p.operateur,
    statut: p.statut,
    created_at: p.created_at,
    methode: 'CinetPay',
  }))

  const manualPayments = (manualRes.data || []).map(p => ({
    id: p.id,
    transaction_id: p.transaction_id,
    montant_fcfa: p.montant,
    montant_usd: null,
    plan_achete: p.plan_id,
    operateur: p.methode,
    statut: p.statut === 'valide' ? 'accepte' : p.statut,
    created_at: p.created_at,
    methode: 'Manuel',
  }))

  const allPayments = [...autoPayments, ...manualPayments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/30 pb-20 pt-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-2">
              <FileText className="h-8 w-8 text-primary" />
              Mes factures
            </h1>
            <p className="text-muted-foreground mt-2">
              Historique de vos paiements et abonnements.
            </p>
          </div>

          <InvoicesList payments={allPayments} plans={PLANS} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
