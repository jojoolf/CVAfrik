import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, CalendarDays, GraduationCap, MapPin, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getOpportunityType, type Opportunity } from '@/lib/opportunities'

function deadline(value: string | null) {
  if (!value) return 'Date non précisée'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(`${value}T12:00:00`))
}

export function MobileOpportunitiesList({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <div className="native-mobile-only mx-auto max-w-lg px-4 pb-7 pt-5">
      <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Découvrir</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Opportunités</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Emplois, stages et bourses sélectionnés pour vous.</p>

      <form action="/opportunites" className="relative mt-5"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input name="q" placeholder="Métier, organisation..." className="h-12 rounded-2xl bg-card pl-10" /></form>
      <div className="native-snap-row -mr-4 mt-4 flex gap-2 overflow-x-auto pr-4"><Link href="/opportunites" className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground">Toutes</Link><Link href="/opportunites?type=emploi" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground">Emplois</Link><Link href="/opportunites?type=stage" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground">Stages</Link><Link href="/opportunites?type=bourse" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground">Bourses</Link></div>

      <div className="mt-6 flex items-center justify-between"><h2 className="text-lg font-black text-foreground">À découvrir</h2><Link href="/dashboard/candidatures" className="text-xs font-bold text-primary">Mes candidatures</Link></div>
      <div className="mt-3 space-y-3">
        {opportunities.length ? opportunities.map((opportunity) => {
          const type = getOpportunityType(opportunity.type)
          return <Link key={opportunity.id} href={`/opportunites/${opportunity.slug}`} className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition active:scale-[0.99]">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">{opportunity.type === 'bourse' ? <GraduationCap className="h-5 w-5" /> : <BriefcaseBusiness className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black text-primary">{type.singular}</span><span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" />{deadline(opportunity.date_limite)}</span></div><h3 className="mt-2 line-clamp-2 text-sm font-black leading-5 text-foreground">{opportunity.titre}</h3><p className="mt-1 text-xs font-medium text-muted-foreground">{opportunity.organisation}</p><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{opportunity.remote ? 'À distance' : [opportunity.ville, opportunity.pays].filter(Boolean).join(', ') || 'Localisation non précisée'}</p></div><ArrowRight className="mt-7 h-4 w-4 shrink-0 text-primary" /></div>
          </Link>
        }) : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"><BriefcaseBusiness className="mx-auto h-7 w-7 text-primary" /><p className="mt-3 text-sm font-bold text-foreground">Aucune opportunité pour le moment</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Revenez bientôt pour découvrir les prochaines publications.</p></div>}
      </div>
      <Button asChild variant="outline" className="mt-5 h-12 w-full rounded-2xl border-primary/25 bg-card text-primary"><Link href="/dashboard/candidatures">Suivre mes candidatures <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
    </div>
  )
}
