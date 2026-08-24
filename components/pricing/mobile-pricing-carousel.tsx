import Link from 'next/link'
import { Check, ChevronRight, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    eyebrow: 'POUR COMMENCER',
    price: 'Gratuit',
    description: 'Les essentiels pour créer vos premières candidatures.',
    features: ['3 CV par mois', '3 lettres par mois', '3 modèles gratuits', 'Export PDF avec filigrane'],
    href: '/dashboard',
    cta: 'Formule actuelle',
    featured: false,
  },
  {
    name: 'Career Pro',
    eyebrow: 'LE PLUS POPULAIRE',
    price: '2 600 FCFA',
    suffix: '/ mois',
    description: 'Pour accélérer votre recherche d’emploi.',
    features: ['CV et lettres illimités', '12 modèles Pro', 'PDF sans filigrane', 'Analyse ATS détaillée'],
    href: '/paiement/abonnement',
    cta: 'Passer Pro',
    featured: true,
  },
]

export function MobilePricingCarousel() {
  return (
    <section className="native-mobile-only px-4 pb-8 pt-5">
      <div className="mx-auto max-w-lg">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Abonnement</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Choisissez votre formule</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Faites glisser les cartes pour comparer les offres.</p>
      </div>

      <div className="native-snap-row -mr-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-4">
        {plans.map((plan) => (
          <article key={plan.name} className={`w-[82vw] max-w-[340px] shrink-0 snap-center rounded-3xl border p-5 shadow-lg ${plan.featured ? 'border-orange-500/40 bg-gradient-to-br from-stone-950 via-amber-950 to-orange-900 text-white shadow-orange-900/20' : 'border-border bg-card text-foreground'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-xs font-black tracking-[0.12em] ${plan.featured ? 'text-amber-200' : 'text-primary'}`}>{plan.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{plan.name}</h2>
              </div>
              {plan.featured && <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-300/15 text-amber-200"><Crown className="h-5 w-5" /></span>}
            </div>
            <p className={`mt-3 min-h-10 text-sm leading-5 ${plan.featured ? 'text-amber-50/75' : 'text-muted-foreground'}`}>{plan.description}</p>
            <p className="mt-5 text-3xl font-black">{plan.price}<span className={`ml-1 text-xs font-semibold ${plan.featured ? 'text-amber-50/70' : 'text-muted-foreground'}`}>{plan.suffix}</span></p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => <li key={feature} className={`flex items-start gap-2 text-sm font-medium ${plan.featured ? 'text-amber-50' : 'text-foreground'}`}><Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-amber-200' : 'text-primary'}`} />{feature}</li>)}
            </ul>
            <Button asChild variant={plan.featured ? 'default' : 'outline'} className={`mt-7 h-12 w-full rounded-2xl font-black ${plan.featured ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary/30 bg-background text-primary hover:bg-primary/10'}`}>
              <Link href={plan.href}>{plan.cta}<ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-1 flex max-w-lg items-center justify-center gap-2 text-xs font-semibold text-muted-foreground"><span>←</span> Faites glisser pour voir Pro <span>→</span></div>
      <div className="mt-2 flex justify-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /><span className="h-2 w-2 rounded-full bg-primary/30" /></div>
      <div className="mx-auto mt-6 flex max-w-lg items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">✓</span><p className="text-sm leading-5 text-muted-foreground"><span className="font-bold text-foreground">Paiement simple et sécurisé.</span><br />Mobile Money et cartes disponibles.</p></div>
    </section>
  )
}
