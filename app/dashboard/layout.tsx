import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, ArrowUpRight } from 'lucide-react'
import { PLANS } from '@/lib/types'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom, email, plan')
    .eq('id', user.id)
    .maybeSingle()

  const planId = profile?.plan ?? 'gratuit'
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]
  const isFreePlan = planId === 'gratuit'
  const isProPlan = planId === 'pro'
  const planNom = plan.nom

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />

      {/* Plan strip */}
      <div className="border-b border-border/40 bg-gradient-to-r from-primary/[0.04] to-background">
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
                Plan actuel
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isFreePlan && (
              <Button size="sm" asChild className="h-7 rounded-full text-xs shadow-sm">
                <Link href="/tarifs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Passer à Pro
                </Link>
              </Button>
            )}
            {isProPlan && (
              <Button size="sm" variant="outline" asChild className="h-7 rounded-full text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                <Link href="/tarifs">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Passer au Business
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
