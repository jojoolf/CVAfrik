'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS, type Plan } from '@/lib/types'

interface PricingCardsProps {
  currentPlan: Plan | null
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: 'pro' | 'premium') => {
    setLoadingPlan(planId)
    // Redirect to payment page
    window.location.href = `/paiement?plan=${planId}`
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isPopular = plan.id === 'pro'
          const isCurrent = currentPlan === plan.id
          const isLoading = loadingPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col transition-all',
                isPopular && 'border-primary shadow-lg ring-1 ring-primary',
                isCurrent && 'bg-primary/5'
              )}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 px-3">
                  <Sparkles className="h-3 w-3" />
                  Plus populaire
                </Badge>
              )}

              {isCurrent && (
                <Badge variant="secondary" className="absolute -top-3 right-4">
                  Plan actuel
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
                {plan.id === 'gratuit' ? (
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/auth/inscription">
                      {isCurrent ? 'Plan actuel' : 'Commencer gratuitement'}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    disabled={isCurrent || isLoading}
                    onClick={() => handleSubscribe(plan.id as 'pro' | 'premium')}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                      </>
                    ) : isCurrent ? (
                      'Plan actuel'
                    ) : (
                      'Choisir ce plan'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Comparison Table */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
          Comparaison detaillee
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 text-left font-medium text-foreground">Fonctionnalite</th>
                <th className="py-4 text-center font-medium text-foreground">Starter</th>
                <th className="py-4 text-center font-medium text-primary">Career Pro</th>
                <th className="py-4 text-center font-medium text-accent">Business</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'CV par mois', starter: '2', pro: 'Illimite', business: 'Illimite' },
                { name: 'Templates', starter: '3 basiques', pro: '15+ premium', business: 'Premium + Custom' },
                { name: 'Export PDF', starter: 'Avec filigrane', pro: 'Sans filigrane', business: 'Sans filigrane' },
                { name: 'Score ATS', starter: 'Basique', pro: 'Detaille', business: 'Detaille' },
                { name: 'Simulation entretien', starter: '3/mois', pro: 'Illimite', business: 'Illimite' },
                { name: 'Matching offres', starter: '-', pro: 'Oui', business: 'Oui' },
                { name: 'Traduction', starter: '-', pro: 'Oui', business: 'Oui' },
                { name: 'Multi-profils', starter: '-', pro: '-', business: 'Oui' },
                { name: 'Support', starter: 'Standard', pro: 'Standard', business: 'Prioritaire WhatsApp' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-border/50">
                  <td className="py-3 text-muted-foreground">{row.name}</td>
                  <td className="py-3 text-center text-muted-foreground">{row.starter}</td>
                  <td className="py-3 text-center font-medium text-foreground">{row.pro}</td>
                  <td className="py-3 text-center font-medium text-foreground">{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
