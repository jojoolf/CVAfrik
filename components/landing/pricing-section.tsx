import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS } from '@/lib/types'

export function PricingSection() {
  return (
    <section id="tarifs" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Des tarifs
            <span className="text-primary"> adaptes a l&apos;Afrique</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Commencez gratuitement, puis passez a un plan superieur quand vous en avez besoin.
            Paiement Mobile Money accepte.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const isPopular = plan.id === 'pro'
            
            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col',
                  isPopular && 'border-primary shadow-lg ring-1 ring-primary'
                )}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 px-3">
                    <Sparkles className="h-3 w-3" />
                    Plus populaire
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.nom}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.prix_fcfa.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-muted-foreground"> FCFA</span>
                    {plan.prix_fcfa > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        ~{plan.prix_usd}€ / mois
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.fonctionnalites.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={plan.id === 'gratuit' ? '/auth/inscription' : `/tarifs?plan=${plan.id}`}>
                      {plan.id === 'gratuit' ? 'Commencer gratuitement' : 'Choisir ce plan'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Paiement securise par CinetPay
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Orange Money', 'Wave', 'MTN Money', 'Moov Money', 'Flooz'].map((method) => (
              <div
                key={method}
                className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-border"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
