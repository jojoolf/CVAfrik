import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink, FileSignature, FileText, MapPin, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOpportunityType, type Opportunity } from '@/lib/opportunities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function formatDeadline(value: string | null) {
  if (!value) return 'Date limite non précisée'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('opportunites')
    .select('*')
    .eq('slug', slug)
    .eq('publie', true)
    .maybeSingle()

  const opportunity = data as Opportunity | null
  if (!opportunity) notFound()

  const type = getOpportunityType(opportunity.type)
  const location = opportunity.remote ? 'À distance' : [opportunity.ville, opportunity.pays].filter(Boolean).join(', ') || 'Localisation non précisée'
  const builderHref = `/cv-builder?opportunity=${encodeURIComponent(opportunity.id)}&template=moderne`
  const letterHref = `/dashboard/lettres?new=true&opportunity=${encodeURIComponent(opportunity.id)}&type=${opportunity.type}`

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6 -ml-3"><Link href="/opportunites"><ArrowLeft className="mr-2 h-4 w-4" />Retour aux opportunités</Link></Button>

        <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
          <article>
            <Card className="border-border/70 shadow-elegant">
              <CardHeader className="space-y-5 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{type.singular}</Badge>
                  {opportunity.date_limite && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />Clôture le {formatDeadline(opportunity.date_limite)}</span>}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{opportunity.titre}</h1>
                  <p className="mt-3 text-lg font-medium text-foreground/75">{opportunity.organisation}</p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{location}</span>
                  {opportunity.niveau && <span>{opportunity.niveau}</span>}
                  {opportunity.secteur && <span>{opportunity.secteur}</span>}
                </div>
              </CardHeader>
              <CardContent className="border-t border-border/70 p-6 sm:p-8">
                <h2 className="text-xl font-bold">À propos de cette opportunité</h2>
                <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{opportunity.description}</div>
                {opportunity.source_nom && <p className="mt-8 text-xs text-muted-foreground">Source : {opportunity.source_url ? <a className="underline hover:text-primary" href={opportunity.source_url} target="_blank" rel="noreferrer">{opportunity.source_nom}</a> : opportunity.source_nom}</p>}
              </CardContent>
            </Card>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Préparez une candidature forte</CardTitle><CardDescription>Utilisez cette opportunité comme contexte dans vos documents.</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full"><Link href={builderHref}><FileText className="mr-2 h-4 w-4" />Adapter mon CV</Link></Button>
                <Button asChild variant="outline" className="w-full bg-background"><Link href={letterHref}><FileSignature className="mr-2 h-4 w-4" />Créer ma lettre</Link></Button>
              </CardContent>
            </Card>

            {opportunity.lien_candidature && <Button asChild size="lg" className="w-full"><a href={opportunity.lien_candidature} target="_blank" rel="noreferrer">Postuler sur le site officiel <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
            <div className="flex gap-2 rounded-xl border border-border/70 bg-card p-3 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Les opportunités sont publiées après vérification éditoriale. Vérifiez toujours les conditions sur le site de l’organisation.</div>
          </aside>
        </div>
      </div>
    </main>
  )
}
