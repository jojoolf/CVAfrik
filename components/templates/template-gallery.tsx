'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TEMPLATE_CATALOG, getPlanLabel, hasTemplateAccess } from '@/lib/template-access'
import type { CVDonnees, Plan } from '@/lib/types'
import { ArrowRight, Eye, Lock, Sparkles } from 'lucide-react'
import { CVPreviewClassique } from '@/components/cv-builder/templates/cv-preview-classique'
import { CVPreviewModerne } from '@/components/cv-builder/templates/cv-preview-moderne'
import { CVPreviewCreatif } from '@/components/cv-builder/templates/cv-preview-creatif'
import { CVPreviewExecutif } from '@/components/cv-builder/templates/cv-preview-executif'
import { CVPreviewTech } from '@/components/cv-builder/templates/cv-preview-tech'
import { CVPreviewMinimaliste } from '@/components/cv-builder/templates/cv-preview-minimaliste'
import { CVPreviewStartup } from '@/components/cv-builder/templates/cv-preview-startup'
import { CVPreviewLuxe } from '@/components/cv-builder/templates/cv-preview-luxe'
import { CVPreviewElite } from '@/components/cv-builder/templates/cv-preview-elite'
import { CVPreviewDesign } from '@/components/cv-builder/templates/cv-preview-design'

interface TemplateGalleryProps {
  currentPlan: Plan | null
}

const mockData: CVDonnees = {
  informations_personnelles: {
    nom: 'Coulibaly',
    prenom: 'Amina',
    email: 'amina.coulibaly@email.com',
    telephone: '+228 90 00 00 00',
    adresse: 'Lome, Togo',
    linkedin: 'linkedin.com/in/amina-coulibaly',
  },
  titre_professionnel: 'Juriste d\'Affaires Senior',
  resume:
    'Juriste passionnee avec plus de 8 ans d\'experience en droit OHADA, contrats commerciaux et conformite reglementaire.',
  formations: [
    {
      id: 'formation-1',
      diplome: 'Master 2 en Droit des Affaires',
      etablissement: 'Universite de Lome',
      ville: 'Lome',
      pays: 'Togo',
      date_debut: '2013-09',
      date_fin: '2015-07',
      en_cours: false,
      description: 'Specialisation en droit des affaires et droit communautaire.',
    },
  ],
  experiences: [
    {
      id: 'experience-1',
      poste: 'Responsable Juridique',
      entreprise: 'Cabinet Juridique & Co',
      ville: 'Lome',
      pays: 'Togo',
      date_debut: '2019-01',
      date_fin: '',
      en_cours: true,
      description:
        'Supervision de la conformite legale, redaction de contrats complexes et gestion des litiges commerciaux.',
      realisations: [
        'Accompagnement de plus de 50 clients corporatifs.',
        'Negociation de contrats internationaux.',
      ],
    },
  ],
  competences: [
    { id: 'comp-1', nom: 'Droit OHADA', niveau: 'expert', categorie: 'technique' },
    { id: 'comp-2', nom: 'Negociation', niveau: 'avance', categorie: 'soft_skill' },
    { id: 'comp-3', nom: 'Anglais juridique', niveau: 'courant', categorie: 'langue' },
  ],
  langues: [
    { id: 'lang-1', nom: 'Francais', niveau: 'natif' },
    { id: 'lang-2', nom: 'Anglais', niveau: 'courant' },
  ],
  certifications: [],
  centres_interet: ['Lecture', 'Mentorat', 'Voyages'],
}

function TemplatePreview({ templateId }: { templateId: string }) {
  switch (templateId) {
    case 'classique':
      return <CVPreviewClassique data={mockData} showWatermark={false} />
    case 'moderne':
      return <CVPreviewModerne data={mockData} showWatermark={false} />
    case 'creatif':
      return <CVPreviewCreatif data={mockData} showWatermark={false} />
    case 'executif':
      return <CVPreviewExecutif data={mockData} showWatermark={false} />
    case 'tech':
      return <CVPreviewTech data={mockData} showWatermark={false} />
    case 'minimaliste':
      return <CVPreviewMinimaliste data={mockData} showWatermark={false} />
    case 'startup':
      return <CVPreviewStartup data={mockData} showWatermark={false} />
    case 'luxe':
      return <CVPreviewLuxe data={mockData} showWatermark={false} />
    case 'elite':
      return <CVPreviewElite data={mockData} showWatermark={false} />
    case 'design':
      return <CVPreviewDesign data={mockData} showWatermark={false} />
    default:
      return <CVPreviewClassique data={mockData} showWatermark={false} />
  }
}

export function TemplateGallery({ currentPlan }: TemplateGalleryProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATE_CATALOG[0]?.id ?? 'classique')

  const selectedTemplate = useMemo(
    () => TEMPLATE_CATALOG.find((template) => template.id === selectedTemplateId) ?? TEMPLATE_CATALOG[0],
    [selectedTemplateId],
  )

  const isAvailableInCurrentPlan = currentPlan
    ? hasTemplateAccess(currentPlan, selectedTemplate.id)
    : selectedTemplate.requiredPlan === 'gratuit'

  return (
    <div className="container mx-auto px-4">
      <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" />
            Nos templates
          </div>
          <h1 className="text-4xl font-black text-foreground md:text-5xl">Choisissez votre style</h1>
          <p className="mt-4 text-muted-foreground">
            Retrouvez maintenant 10 templates CVAfrik, du plus classique au plus premium.
            Si un template depasse votre abonnement, nous vous ramenons vers la page des tarifs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentPlan ? (
            <Badge className="px-4 py-2">Plan {getPlanLabel(currentPlan)}</Badge>
          ) : (
            <Badge variant="secondary" className="px-4 py-2">
              Connectez-vous pour debloquer vos templates
            </Badge>
          )}
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <Card className="rounded-3xl border-border/60">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Catalogue</h2>
                <Badge variant="outline">{TEMPLATE_CATALOG.length} templates</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TEMPLATE_CATALOG.map((template) => {
                  const available = currentPlan
                    ? hasTemplateAccess(currentPlan, template.id)
                    : template.requiredPlan === 'gratuit'
                  const selected = selectedTemplate.id === template.id

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={cn(
                        'overflow-hidden rounded-2xl border text-left transition-all',
                        selected
                          ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:shadow-sm',
                        !available && 'opacity-80',
                      )}
                    >
                      <div className={cn('relative h-20 w-full', template.color)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
                        {!available && (
                          <div className="absolute right-2 top-2">
                            <Badge className="gap-1 bg-black/55 text-white hover:bg-black/55">
                              <Lock className="h-3 w-3" />
                              {getPlanLabel(template.requiredPlan)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-semibold text-foreground">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">{selectedTemplate.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{selectedTemplate.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{getPlanLabel(selectedTemplate.requiredPlan)}</Badge>
                {isAvailableInCurrentPlan ? (
                  <Badge variant="outline">Disponible dans votre plan</Badge>
                ) : (
                  <Badge variant="outline">Mise a niveau requise</Badge>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <Link href={`/cv-builder?template=${selectedTemplate.id}`}>
                    {isAvailableInCurrentPlan ? 'Utiliser ce template' : 'Voir ce template'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Si votre abonnement ne couvre pas ce template, vous serez redirige vers les tarifs.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Eye className="h-4 w-4" />
            Apercu du template {selectedTemplate.name}
          </div>
          <div className="overflow-auto rounded-[2rem] border border-border bg-muted/20 p-4 md:p-8 shadow-inner">
            <div className="mx-auto w-full max-w-[820px]">
              <div className="origin-top scale-[0.58] md:scale-[0.82] xl:scale-100">
                <TemplatePreview templateId={selectedTemplate.id} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
