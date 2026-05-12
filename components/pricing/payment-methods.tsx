import { Shield, Lock, CreditCard } from 'lucide-react'

const mobileMoneyOperators = [
  { name: 'Orange Money', color: 'bg-orange-500', countries: 'CI, SN, ML, BF, GN, CM' },
  { name: 'Wave', color: 'bg-blue-500', countries: 'SN, CI, ML, BF' },
  { name: 'MTN Mobile Money', color: 'bg-yellow-500', countries: 'CI, BJ, CM, CG, GN' },
  { name: 'Moov Money', color: 'bg-blue-600', countries: 'CI, BJ, TG, NE, BF' },
  { name: 'Flooz', color: 'bg-green-500', countries: 'TG, BJ' },
]

const securityFeatures = [
  {
    icon: Shield,
    title: 'Paiement securise',
    description: 'Transactions protegees par CinetPay, leader du paiement en Afrique',
  },
  {
    icon: Lock,
    title: 'Donnees cryptees',
    description: 'Toutes vos informations sont chiffrees et securisees',
  },
  {
    icon: CreditCard,
    title: 'Cartes acceptees',
    description: 'Visa, Mastercard et cartes bancaires africaines',
  },
]

export function PaymentMethods() {
  return (
    <section className="bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Moyens de paiement acceptes
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Payez facilement avec votre operateur Mobile Money prefere ou par carte bancaire
        </p>

        {/* Mobile Money Operators */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {mobileMoneyOperators.map((operator) => (
            <div
              key={operator.name}
              className="flex flex-col items-center rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
            >
              <div className={`h-12 w-12 rounded-full ${operator.color}`} />
              <p className="mt-3 font-medium text-foreground">{operator.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{operator.countries}</p>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CinetPay Badge */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Paiement securise par
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 font-semibold shadow-sm ring-1 ring-border">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
            CinetPay
          </div>
        </div>
      </div>
    </section>
  )
}
