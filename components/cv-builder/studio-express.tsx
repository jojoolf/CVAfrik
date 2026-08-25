'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, FileArchive, FileText, Lock, PencilLine, Sparkles, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { renderCvTemplate, templateCatalog } from './templates/cv-preview-collection'

interface StudioExpressProps {
  data: CVDonnees
  template: string
  plan: PlanConfig
  onTemplateChange: (template: string) => void
  onUseProfile: () => void
  onImport: (mode: 'pdf' | 'linkedin') => void
  onManualStart: () => void
}

const A4_WIDTH = 794
const A4_HEIGHT = 1123
const featuredTemplateIds = ['classique', 'moderne', 'tech']

const previewData: CVDonnees = {
  informations_personnelles: {
    prenom: 'Aïcha', nom: 'Kouassi', email: 'aicha.kouassi@email.com', telephone: '+229 01 00 00 00', adresse: 'Cotonou, Bénin', linkedin: 'linkedin.com/in/aicha-kouassi',
  },
  titre_professionnel: 'Chargée de projet digital',
  resume: 'Professionnelle organisée, orientée résultats et passionnée par la création de solutions utiles.',
  experiences: [{ id: 'studio-exp', poste: 'Chargée de projet', entreprise: 'Horizon Group', ville: 'Cotonou', pays: 'Bénin', date_debut: '2022-01', date_fin: '', en_cours: true, description: 'Coordination de projets digitaux, suivi des équipes et amélioration des processus.', realisations: ['Coordination de projets', 'Suivi des résultats'] }],
  formations: [{ id: 'studio-edu', diplome: 'Master en management', etablissement: 'Université Exemple', ville: 'Cotonou', pays: 'Bénin', date_debut: '2018-01', date_fin: '2021-01', en_cours: false }],
  competences: [{ id: 'studio-skill-a', nom: 'Gestion de projet', niveau: 'avance', categorie: 'technique' }, { id: 'studio-skill-b', nom: 'Communication', niveau: 'avance', categorie: 'soft_skill' }],
  langues: [{ id: 'studio-lang-a', nom: 'Français', niveau: 'natif' }, { id: 'studio-lang-b', nom: 'Anglais', niveau: 'courant' }],
  certifications: [],
  centres_interet: [],
}

function dataForPreview(data: CVDonnees): CVDonnees {
  return {
    ...previewData,
    ...data,
    informations_personnelles: { ...previewData.informations_personnelles, ...data.informations_personnelles },
    titre_professionnel: data.titre_professionnel || previewData.titre_professionnel,
    resume: data.resume || previewData.resume,
    experiences: data.experiences.length ? data.experiences : previewData.experiences,
    formations: data.formations.length ? data.formations : previewData.formations,
    competences: data.competences.length ? data.competences : previewData.competences,
    langues: data.langues.length ? data.langues : previewData.langues,
  }
}

export function StudioExpress({ data, template, plan, onTemplateChange, onUseProfile, onImport, onManualStart }: StudioExpressProps) {
  const [showAllTemplates, setShowAllTemplates] = useState(false)
  const visibleTemplates = useMemo(() => showAllTemplates ? templateCatalog : templateCatalog.filter((item) => featuredTemplateIds.includes(item.id)), [showAllTemplates])
  const preview = useMemo(() => dataForPreview(data), [data])
  const selectedTemplate = templateCatalog.find((item) => item.id === template) || templateCatalog[1]

  const selectTemplate = (templateId: string) => {
    const item = templateCatalog.find((candidate) => candidate.id === templateId)
    if (!item) return
    if (plan.id === 'gratuit' && !item.plans.includes('gratuit')) {
      toast.error('Ce modèle est réservé au plan Pro.')
      return
    }
    onTemplateChange(templateId)
  }

  const sourceCards = [
    { id: 'profile', title: 'Utiliser mon profil', description: 'Je pars de mes informations CVAfrik.', icon: UserRound, action: onUseProfile },
    { id: 'pdf', title: 'Importer mon CV PDF', description: 'Nous récupérons les rubriques de votre CV texte.', icon: FileText, action: () => onImport('pdf') },
    { id: 'linkedin', title: 'Archive LinkedIn ZIP', description: 'Importez votre archive personnelle LinkedIn.', icon: FileArchive, action: () => onImport('linkedin') },
  ] as const

  return (
    <main className="min-h-screen bg-[#fffcf8] text-foreground">
      <header className="border-b border-orange-100 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Button variant="ghost" asChild className="rounded-xl px-2 text-muted-foreground hover:text-foreground">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Tableau de bord</Link>
          </Button>
          <div className="hidden items-center gap-3 text-sm font-semibold text-muted-foreground md:flex" aria-label="Progression de création">
            <ProgressStep index="1" label="Modèle" active />
            <span className="h-px w-10 bg-border" />
            <ProgressStep index="2" label="Informations" />
            <span className="h-px w-10 bg-border" />
            <ProgressStep index="3" label="Finaliser" />
          </div>
          <Badge variant="secondary" className="shrink-0 border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">Studio Express</Badge>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)] lg:items-start lg:py-10">
        <section className="min-w-0">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" />CV en quelques minutes</div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Votre CV professionnel,<br /><span className="text-primary">simplement.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Choisissez votre modèle, puis partez de votre profil, de votre CV ou de votre archive LinkedIn. Vous pourrez tout modifier après.</p>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-lg font-black">1. Choisissez votre modèle</h2><p className="mt-1 text-sm text-muted-foreground">L’aperçu, l’éditeur et le PDF garderont exactement ce style.</p></div><button onClick={() => setShowAllTemplates((value) => !value)} className="shrink-0 text-sm font-bold text-primary hover:underline">{showAllTemplates ? 'Voir moins' : 'Voir tous les modèles'}</button></div>
            <div className={cn('grid gap-3 sm:grid-cols-3', showAllTemplates && 'max-h-[440px] overflow-y-auto pr-1 sm:grid-cols-4')}>
              {visibleTemplates.map((item) => {
                const isSelected = item.id === selectedTemplate.id
                const isLocked = plan.id === 'gratuit' && !item.plans.includes('gratuit')
                return <button key={item.id} type="button" onClick={() => selectTemplate(item.id)} className={cn('group relative overflow-hidden rounded-2xl border-2 bg-card text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]', isSelected ? 'border-primary ring-4 ring-primary/10' : 'border-border/70', isLocked && 'opacity-60')}>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <div className="absolute left-1/2 top-0 h-[250px] w-[177px] -translate-x-1/2 overflow-hidden bg-white shadow-sm"><div className="pointer-events-none" style={{ width: A4_WIDTH, minHeight: A4_HEIGHT, transform: 'scale(0.223)', transformOrigin: 'top left' }}>{renderCvTemplate(item.id, { data: preview, showWatermark: false })}</div></div>
                    {isSelected && <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow"><CheckCircle2 className="h-4 w-4" /></span>}
                    {isLocked && <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-slate-950/90 px-2 py-1 text-[9px] font-bold uppercase text-white"><Lock className="h-3 w-3" />Pro</span>}
                  </div>
                  <div className="p-3"><p className="text-sm font-black">{item.name}</p><p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{item.description}</p></div>
                </button>
              })}
            </div>
          </div>

          <div className="mt-8"><div className="mb-3"><h2 className="text-lg font-black">2. Comment souhaitez-vous commencer ?</h2><p className="mt-1 text-sm text-muted-foreground">Choisissez la méthode la plus rapide pour vous.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {sourceCards.map(({ id, title, description, icon: Icon, action }) => <button key={id} type="button" onClick={action} className="group rounded-2xl border border-border/80 bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md active:scale-[0.98]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-primary"><Icon className="h-5 w-5" /></span><p className="mt-4 text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></button>)}
            </div>
            <button type="button" onClick={onManualStart} className="mt-4 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-orange-50 hover:text-primary"><PencilLine className="h-4 w-4" />Je préfère remplir moi-même</button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-6">
          <Card className="overflow-hidden rounded-3xl border-orange-100 bg-card p-3 shadow-[0_18px_60px_rgba(73,38,12,0.12)]">
            <div className="flex items-center justify-between px-2 pb-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Votre aperçu</p><p className="mt-1 text-sm font-black">{selectedTemplate.name}</p></div><Badge variant="secondary" className="bg-emerald-50 text-[10px] text-emerald-700">A4 fidèle</Badge></div>
            <div className="max-h-[640px] overflow-auto rounded-2xl bg-[#f3ede6] p-3"><div className="mx-auto h-[562px] w-[397px] overflow-hidden bg-white shadow-2xl sm:h-[675px] sm:w-[477px]"><div style={{ width: A4_WIDTH, minHeight: A4_HEIGHT, transform: 'scale(0.6)', transformOrigin: 'top left' }}>{renderCvTemplate(selectedTemplate.id, { data: preview, showWatermark: plan.limites.filigrane })}</div></div></div>
            <p className="px-2 pt-3 text-center text-xs leading-5 text-muted-foreground">Même modèle à l’écran, dans l’éditeur et dans votre PDF.</p>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function ProgressStep({ index, label, active = false }: { index: string; label: string; active?: boolean }) {
  return <span className={cn('flex items-center gap-2', active ? 'text-foreground' : 'text-muted-foreground')}><span className={cn('grid h-6 w-6 place-items-center rounded-full border text-[11px] font-black', active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted')}>{index}</span>{label}</span>
}
