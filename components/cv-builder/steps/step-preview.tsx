'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, FileText, Loader2, Lock, Maximize2, Sparkles, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { downloadCvPdf } from '@/lib/cv-pdf-export'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { renderCvTemplate, templateCatalog, type TemplateCatalogItem } from '../templates/cv-preview-collection'

interface StepPreviewProps {
  data: CVDonnees
  template: string
  onTemplateChange: (template: string) => void
  plan: PlanConfig
}

const A4_W = 794
const A4_H = 1123

const previewFallback: CVDonnees = {
  informations_personnelles: { nom: 'Kouassi', prenom: 'Aïcha', email: 'aicha@email.com', telephone: '+229 01 00 00 00', adresse: 'Cotonou, Bénin', linkedin: 'linkedin.com/in/aicha-kouassi' },
  titre_professionnel: 'Chargée de projet digital',
  resume: 'Professionnelle organisée, orientée résultats et passionnée par la création de solutions utiles.',
  experiences: [{ id: 'demo-experience', poste: 'Chargée de projet', entreprise: 'Entreprise Exemple', ville: 'Cotonou', pays: 'Bénin', date_debut: '2022-01', date_fin: '', en_cours: true, description: 'Coordination de projets, suivi des équipes et amélioration des processus.', realisations: ['Coordination de projets', 'Suivi des résultats'] }],
  formations: [{ id: 'demo-formation', diplome: 'Master en management', etablissement: 'Université Exemple', ville: 'Cotonou', pays: 'Bénin', date_debut: '2018-01', date_fin: '2021-01', en_cours: false }],
  competences: [{ id: 'demo-skill-1', nom: 'Gestion de projet', niveau: 'avance', categorie: 'technique' }, { id: 'demo-skill-2', nom: 'Communication', niveau: 'avance', categorie: 'soft_skill' }],
  langues: [{ id: 'demo-language', nom: 'Français', niveau: 'natif' }, { id: 'demo-language-2', nom: 'Anglais', niveau: 'courant' }],
}

function isTemplateAvailable(templateItem: TemplateCatalogItem, plan: PlanConfig) {
  return plan.id !== 'gratuit' || templateItem.plans.includes('gratuit')
}

function withPreviewFallback(data: CVDonnees): CVDonnees {
  return {
    ...previewFallback,
    ...data,
    informations_personnelles: { ...previewFallback.informations_personnelles, ...data.informations_personnelles },
    titre_professionnel: data.titre_professionnel || previewFallback.titre_professionnel,
    resume: data.resume || previewFallback.resume,
    experiences: data.experiences?.length ? data.experiences : previewFallback.experiences,
    formations: data.formations?.length ? data.formations : previewFallback.formations,
    competences: data.competences?.length ? data.competences : previewFallback.competences,
    langues: data.langues?.length ? data.langues : previewFallback.langues,
  }
}

export function StepPreview({ data, template, onTemplateChange, plan }: StepPreviewProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [zoomLevel, setZoomLevel] = useState(0.75)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const measure = () => {
      if (!previewContainerRef.current) return
      const width = previewContainerRef.current.clientWidth - 48
      setZoomLevel(Number(Math.min(0.9, Math.max(0.35, width / A4_W)).toFixed(2)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (previewContainerRef.current) observer.observe(previewContainerRef.current)
    return () => observer.disconnect()
  }, [])

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'free') return templateCatalog.filter((item) => item.category === 'Gratuit')
    if (activeCategory === 'pro') return templateCatalog.filter((item) => item.category === 'Pro')
    return templateCatalog
  }, [activeCategory])

  const currentTemplate = useMemo(() => templateCatalog.find((item) => item.id === template) || templateCatalog[0], [template])
  const previewData = useMemo(() => withPreviewFallback(data), [data])
  const scaledWidth = Math.round(A4_W * zoomLevel)
  const scaledHeight = Math.round(A4_H * zoomLevel)

  const downloadPdf = async () => {
    if (!exportRef.current) return
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 250))
      await downloadCvPdf(
        exportRef.current,
        `CV_${data.informations_personnelles.prenom || 'CVAfrik'}_${data.informations_personnelles.nom || 'CV'}`,
      )
      toast.success('CV téléchargé.')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error(error instanceof Error ? `Erreur export PDF : ${error.message}` : 'L’export PDF a échoué.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {mounted && createPortal(
        <div aria-hidden="true" data-cv-pdf-render="true" ref={exportRef} style={{ position: 'fixed', top: 0, left: 0, width: A4_W, minHeight: A4_H, overflow: 'visible', visibility: 'hidden', background: '#fff', pointerEvents: 'none', zIndex: -1 }}>
          {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
        </div>,
        document.body,
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2"><h2 className="text-xl font-bold">Choisissez votre modèle</h2><Badge variant="secondary" className="text-[10px] uppercase">Étape finale</Badge></div>
          <p className="mt-1 text-sm text-muted-foreground">L’aperçu, l’éditeur et le PDF utilisent exactement le même modèle.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" className="rounded-xl"><Maximize2 className="mr-2 h-4 w-4 text-primary" />Voir en grand</Button></DialogTrigger>
            <DialogContent className="flex h-[95vh] max-w-[100vw] flex-col overflow-auto border-none bg-slate-950/90 p-4 backdrop-blur-md">
              <DialogHeader><DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-200"><FileText className="h-4 w-4 text-primary" />Aperçu {currentTemplate.name}</DialogTitle></DialogHeader>
              <div className="flex flex-1 justify-center overflow-auto py-4"><div className="shrink-0 overflow-hidden bg-white shadow-2xl" style={{ width: A4_W, minHeight: A4_H }}>{renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}</div></div>
            </DialogContent>
          </Dialog>
          <Button onClick={downloadPdf} disabled={isExporting} className="rounded-xl px-5">
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}<span className="ml-2">Télécharger PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="border-border/80 shadow-sm lg:col-span-5">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />Modèles</CardTitle><Badge variant="secondary" className="max-w-28 truncate text-[10px]">{currentTemplate.name}</Badge></div>
            <CardDescription className="text-xs">Sélectionnez uniquement le style qui vous convient. Vous pourrez le modifier plus tard de manière explicite.</CardDescription>
            <div className="flex gap-1.5 overflow-x-auto pt-2">
              {[{ id: 'all', label: 'Tous' }, { id: 'free', label: 'Gratuits' }, { id: 'pro', label: 'Pro' }].map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={cn('shrink-0 rounded-lg px-3 py-1 text-[11px] font-semibold transition-colors', activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground hover:bg-muted')}>{category.label}</button>)}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid max-h-[560px] grid-cols-2 gap-3 overflow-y-auto pr-1" role="radiogroup">
              {filteredTemplates.map((item) => {
                const available = isTemplateAvailable(item, plan)
                const selected = item.id === template
                return (
                  <button key={item.id} role="radio" aria-checked={selected} disabled={!available} onClick={() => available && onTemplateChange(item.id)} className={cn('group relative overflow-hidden rounded-2xl border-2 bg-card text-left transition-all hover:border-primary/60 hover:shadow-md', selected ? 'border-primary ring-2 ring-primary/20' : 'border-border/60', !available && 'cursor-not-allowed opacity-50')}>
                    <div className="relative h-40 overflow-hidden bg-slate-200/80">
                      <div className="absolute left-1/2 top-0 h-[230px] w-[163px] -translate-x-1/2 overflow-hidden bg-white shadow-sm">
                        <div className="pointer-events-none" style={{ width: A4_W, minHeight: A4_H, transform: 'scale(0.205)', transformOrigin: 'top left' }}>{renderCvTemplate(item.id, { data: previewData, showWatermark: false })}</div>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/65 to-transparent" />
                      <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">{item.category}</span>
                      {!available && <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-md bg-slate-900/90 px-2 py-1 text-[9px] font-bold text-white"><Lock className="h-2.5 w-2.5" />PRO</span>}
                      {selected && <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary shadow"><CheckCircle className="h-4 w-4" /></span>}
                    </div>
                    <div className="space-y-0.5 p-2.5"><p className="truncate text-xs font-bold">{item.name}</p><p className="truncate text-[10px] text-muted-foreground">{item.description}</p></div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card ref={previewContainerRef} className="flex min-h-[620px] flex-col overflow-hidden border-border/80 bg-slate-100/80 shadow-inner dark:bg-slate-950/50 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-border/50 bg-card/70 px-4 py-3"><span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><FileText className="h-3.5 w-3.5 text-primary" />Aperçu A4 fidèle · lecture seule</span><div className="flex items-center gap-1 rounded-xl border border-border/80 bg-background px-2 py-1"><button onClick={() => setZoomLevel((value) => Math.max(0.35, Number((value - 0.05).toFixed(2))))} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Dézoomer"><ZoomOut className="h-3.5 w-3.5" /></button><span className="min-w-10 px-1 text-center text-xs font-mono font-semibold">{Math.round(zoomLevel * 100)}%</span><button onClick={() => setZoomLevel((value) => Math.min(1, Number((value + 0.05).toFixed(2))))} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Zoomer"><ZoomIn className="h-3.5 w-3.5" /></button></div></div>
          <div className="flex flex-1 justify-center overflow-auto p-4"><div style={{ width: scaledWidth, height: scaledHeight, flexShrink: 0, position: 'relative' }}><div className="absolute left-0 top-0 overflow-hidden bg-white shadow-2xl" style={{ width: A4_W, minHeight: A4_H, transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>{renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}</div></div></div>
          <div className="border-t border-border/40 bg-card/50 px-4 py-2 text-center text-[11px] text-muted-foreground">Pour modifier vos informations après création, ouvrez le nouvel éditeur de document.</div>
        </Card>
      </div>
    </div>
  )
}
