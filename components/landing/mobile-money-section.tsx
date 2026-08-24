import { PaymentOperatorMarquee } from '@/components/payments/payment-operator-marquee'

export function MobileMoneySection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/30 py-6 backdrop-blur sm:py-8">
      <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <PaymentOperatorMarquee />
      </div>
    </section>
  )
}
