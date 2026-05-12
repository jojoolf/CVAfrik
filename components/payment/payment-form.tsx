'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Check, Loader2, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { type PlanConfig, PAYS_AFRIQUE_OUEST, OPERATEURS_MOBILE_MONEY } from '@/lib/types'
import Link from 'next/link'

interface PaymentFormProps {
  plan: PlanConfig
  userEmail: string
  userId: string
}

type PaymentMethod = 'mobile_money' | 'card'

export function PaymentForm({ plan, userEmail, userId }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const availableOperators = selectedCountry
    ? OPERATEURS_MOBILE_MONEY.filter(op => op.pays.includes(selectedCountry))
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.id,
          payment_method: paymentMethod,
          country: selectedCountry,
          operator: selectedOperator,
          phone_number: phoneNumber,
          user_id: userId,
          email: userEmail,
        }),
      })

      const data = await response.json()

      if (data.success && data.payment_url) {
        // Redirect to CinetPay payment page
        window.location.href = data.payment_url
      } else {
        toast.error(data.message || 'Erreur lors de l\'initialisation du paiement')
      }
    } catch {
      toast.error('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recapitulatif de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Plan {plan.nom}</span>
            <span className="font-semibold">{plan.prix_fcfa.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duree</span>
            <span>1 mois</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{plan.prix_fcfa.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ce qui est inclus</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.fonctionnalites.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mode de paiement</CardTitle>
          <CardDescription>Choisissez votre methode de paiement preferee</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div>
              <RadioGroupItem
                value="mobile_money"
                id="mobile_money"
                className="peer sr-only"
              />
              <Label
                htmlFor="mobile_money"
                className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-lg">📱</span>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-semibold">Mobile Money</p>
                  <p className="text-xs text-muted-foreground">Orange, Wave, MTN, Moov</p>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="card"
                id="card"
                className="peer sr-only"
              />
              <Label
                htmlFor="card"
                className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-lg">💳</span>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-semibold">Carte bancaire</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'mobile_money' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={selectedCountry} onValueChange={(v) => {
                  setSelectedCountry(v)
                  setSelectedOperator('')
                }}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Selectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYS_AFRIQUE_OUEST.map((pays) => (
                      <SelectItem key={pays.code} value={pays.code}>
                        {pays.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry && (
                <div className="space-y-2">
                  <Label htmlFor="operator">Operateur</Label>
                  <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                    <SelectTrigger id="operator">
                      <SelectValue placeholder="Selectionnez votre operateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOperators.map((op) => (
                        <SelectItem key={op.id} value={op.id}>
                          {op.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedOperator && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Numero de telephone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 0700000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Vous recevrez une demande de paiement sur ce numero
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || (paymentMethod === 'mobile_money' && (!selectedOperator || !phoneNumber))}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>Payer {plan.prix_fcfa.toLocaleString('fr-FR')} FCFA</>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            Paiement securise par CinetPay
          </div>

          <Button variant="ghost" asChild className="w-full">
            <Link href="/tarifs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux tarifs
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
