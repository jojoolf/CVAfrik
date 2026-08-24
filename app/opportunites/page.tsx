import Link from 'next/link'
import { BriefcaseBusiness, CalendarDays, CheckCircle2, ChevronRight, ExternalLink, Filter, GraduationCap, MapPin, Search, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOpportunityType, isOpportunityOpen, OPPORTUNITY_TYPES, type Opportunity, type OpportunityType } from '@/lib/opportunities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { MobileOpportunitiesList } from '@/components/opportunities/mobile-opportunities-list'

interface OpportunitiesPageProps {
  searchParams: Promise<{ type?: string; pays?: string; q?: string }>
}

function formatDeadline(value: string | null) {
  if (!value) return 'Date limite non précisée'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams
  const selectedType = OPPORTUNITY_TYPES.some((item) => item.id === params.type) ? params.type as OpportunityType : undefined
  const query = params.q?.trim() || ''
  const country = params.pays?.trim() || ''
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let request = supabase
    .from('opportunites')
    .select('*')
    .eq('publie', true)
    .order('date_limite', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (selectedType) request = request.eq('type', selectedType)
  if (country) request = request.ilike('pays', `%${country}%`)
  if (query) request = request.or(`titre.ilike.%${query}%,organisation.ilike.%${query}%,secteur.ilike.%${query}%`)

  const { data } = await request
  const opportunities = ((data || []) as Opportunity[]).filter((item) => isOpportunityOpen(item.date_limite))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <MobileOpportunitiesList opportunities={opportunities} />
      <div className="native-web-hidden">
      <section className="border-b border-border/70 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Badge className="mb-4 rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10" variant="outline">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Carrière en Afrique
          </Badge>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Opportunités pour accélérer votre carrière</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Des emplois, stages, bourses et programmes sélectionnés pour les talents africains. Trouvez une opportunité, adaptez votre CV et préparez votre candidature au même endroit.</p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Publications vérifiées par CVAfrik</div>
              <Button asChild variant="outline" className="rounded-xl border-primary/25 bg-background/70 text-primary hover:bg-primary/10">
                <Link href="/dashboard/candidatures">Suivre mes candidatures <ChevronRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form className="mb-8 grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm lg:grid-cols-[1fr_220px_auto]" action="/opportunites">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="Métier, organisation, secteur..." className="h-11 pl-9" />
          </div>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="pays" defaultValue={country} placeholder="Pays" className="h-11 pl-9" />
          </div>
          <Button type="submit" className="h-11"><Filter className="mr-2 h-4 w-4" />Filtrer</Button>
        </form>

        <div className="mb-7 flex flex-wrap gap-2">
          <Button asChild size="sm" variant={!selectedType ? 'default' : 'outline'} className="rounded-full"><Link href="/opportunites">Toutes</Link></Button>
          {OPPORTUNITY_TYPES.map((type) => <Button asChild key={type.id} size="sm" variant={selectedType === type.id ? 'default' : 'outline'} className="rounded-full"><Link href={`/opportunites?type=${type.id}`}>{type.label}</Link></Button>)}
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{opportunities.length} opportunité{opportunities.length > 1 ? 's' : ''} disponible{opportunities.length > 1 ? 's' : ''}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Les offres expirées sont automatiquement masquées.</p>
          </div>
        </div>

        {opportunities.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => {
              const type = getOpportunityType(opportunity.type)
              return (
                <Card key={opportunity.id} className="group flex h-full flex-col border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-elegant">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{type.singular}</Badge>
                      {opportunity.date_limite && <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{formatDeadline(opportunity.date_limite)}</span>}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">{opportunity.titre}</CardTitle>
                    <CardDescription className="pt-1 font-medium text-foreground/75">{opportunity.organisation}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {(opportunity.ville || opportunity.pays || opportunity.remote) && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{opportunity.remote ? 'À distance' : [opportunity.ville, opportunity.pays].filter(Boolean).join(', ')}</span>}
                      {opportunity.niveau && <span>• {opportunity.niveau}</span>}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild size="sm" className="flex-1"><Link href={`/opportunites/${opportunity.slug}`}>Voir l&apos;opportunité <ChevronRight className="ml-1 h-4 w-4" /></Link></Button>
                      {opportunity.lien_candidature && <Button asChild size="sm" variant="outline"><a href={opportunity.lien_candidature} target="_blank" rel="noreferrer" aria-label="Postuler"><ExternalLink className="h-4 w-4" /></a></Button>}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center px-4 py-16 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><BriefcaseBusiness className="h-8 w-8" /></div>
              <h2 className="text-xl font-bold">Aucune opportunité ne correspond à ces filtres</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Essayez une autre recherche ou revenez bientôt : de nouvelles publications sont ajoutées après vérification.</p>
              <Button asChild variant="outline" className="mt-5"><Link href="/opportunites">Réinitialiser les filtres</Link></Button>
            </CardContent>
          </Card>
        )}
      </main>
      </div>
    </div>
  )
}
