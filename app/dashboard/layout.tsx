import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, ArrowUpRight, Clock } from 'lucide-react'
import { PLANS } from '@/lib/types'
import { getEffectivePlan, formatDaysRemaining } from '@/lib/subscription'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  // Check subscription status (auto-downgrades if expired)
  const subscription = await getEffectivePlan(supabase, user.id)
  const planId = subscription.planId
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]
  const isFreePlan = planId === 'gratuit'
  const isProPlan = planId === 'pro'
  const planNom = plan.nom
  const daysLabel = formatDaysRemaining(subscription.daysRemaining)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />

      {/* Expired banner */}
      {subscription.isExpired && (
        <div className="native-web-hidden bg-red-500/10 border-b border-red-500/30 py-2.5">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Votre abonnement Pro a expiré. Renouvelez pour continuer à profiter des fonctionnalités premium.</span>
            <Button size="sm" asChild className="ml-2 h-7 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white">
              <Link href="/paiement/abonnement">Renouveler</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Warning banner when expiry is close (7 days or less) */}
      {!subscription.isExpired && subscription.daysRemaining !== null && subscription.daysRemaining <= 7 && (
        <div className="native-web-hidden bg-amber-500/10 border-b border-amber-500/30 py-2.5">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Votre abonnement expire dans {subscription.daysRemaining} jour{subscription.daysRemaining > 1 ? 's' : ''}. Renouvelez maintenant pour ne pas perdre l'accès.</span>
            <Button size="sm" variant="outline" asChild className="ml-2 h-7 rounded-full text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
              <Link href="/paiement/abonnement">Renouveler</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Plan strip */}
      <div className="native-web-hidden border-b border-border/40 bg-gradient-to-r from-primary/[0.04] to-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {isFreePlan ? (
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Crown className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span className="text-xs sm:text-sm text-muted-foreground">
              {isFreePlan ? 'Plan Gratuit' : (
                <>Plan <span className="font-semibold text-foreground">{planNom}</span></>
              )}
            </span>
            {!isFreePlan && (
              <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 bg-primary/5 text-primary border-primary/20 text-xs">
                {daysLabel || 'Actif'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isFreePlan && (
              <Button size="sm" asChild className="h-7 rounded-full text-xs shadow-sm">
                <Link href="/paiement/abonnement">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Passer à Pro
                </Link>
              </Button>
            )}
            {isProPlan && (
              <Button size="sm" variant="outline" asChild className="h-7 rounded-full text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                <Link href="/paiement/abonnement">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Prolonger
                </Link>
              </Button>
            )}
            <Button size="sm" variant="ghost" asChild className="h-7 rounded-full text-xs">
              <Link href="/dashboard/factures">Gérer</Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
