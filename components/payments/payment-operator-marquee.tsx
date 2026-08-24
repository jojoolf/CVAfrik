import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaymentOperator = {
  name: string
  image: string
}

// Liste confirmée par l’administrateur à partir des moyens disponibles dans son compte FedaPay.
const operators: PaymentOperator[] = [
  { name: 'MTN Bénin', image: '/payment-operators/01_mtn_benin.png' },
  { name: 'Moov Money Bénin', image: '/payment-operators/02_moov_benin_moov_money.png' },
  { name: 'Celtiis Cash', image: '/payment-operators/03_celtiis_cash.png' },
  { name: 'Coris Money', image: '/payment-operators/04_coris_money.png' },
  { name: 'BEST CASH Money', image: '/payment-operators/05_bestcash_money.png' },
  { name: 'Moov Money Togo', image: '/payment-operators/06_moov_togo_moov_money.png' },
  { name: 'Mixx by Yas Togo', image: '/payment-operators/07_mixx_by_yas_togo.png' },
  { name: "Wave Côte d’Ivoire", image: '/payment-operators/08_wave_cote_divoire.png' },
  { name: "MTN Côte d’Ivoire", image: '/payment-operators/09_mtn_cote_divoire.png' },
  { name: 'Free Sénégal', image: '/payment-operators/10_free_senegal.png' },
  { name: 'Airtel Niger', image: '/payment-operators/11_airtel_niger.png' },
]

export function PaymentOperatorMarquee({ className }: { className?: string }) {
  const loop = [...operators, ...operators]

  return (
    <section className={cn('overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm', className)} aria-labelledby="payment-operators-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 id="payment-operators-title" className="text-sm font-black text-foreground">Paiement 100 % sécurisé</h2>
            <p className="mt-0.5 max-w-sm text-xs leading-5 text-muted-foreground">Paiement traité de façon sécurisée par FedaPay. Les opérateurs acceptés défilent automatiquement.</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Sécurisé</span>
      </div>

      <div className="payment-marquee mt-4" aria-label="Opérateurs de paiement acceptés">
        <div className="payment-marquee-track" role="list">
          {loop.map((operator, index) => {
            const duplicate = index >= operators.length
            return (
              <div key={`${operator.name}-${index}`} role="listitem" aria-hidden={duplicate || undefined} className="payment-operator-logo-card">
                <img src={operator.image} alt={duplicate ? '' : `Logo ${operator.name}`} className="payment-operator-logo" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
