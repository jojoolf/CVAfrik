'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Lock, Download, Loader2, Sparkles, FileText,
  Maximize2, CheckCircle, ZoomIn, ZoomOut, MousePointerClick,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { renderCvTemplate, templateCatalog, type TemplateCatalogItem } from '../templates/cv-preview-collection'
import { CanvaToolbar, CanvaCustomization, CANVA_COLORS, CANVA_FONTS } from '../canva-toolbar'

interface StepPreviewProps {
  data: CVDonnees
  template: string
  onTemplateChange: (template: string) => void
  plan: PlanConfig
}

function getLockLabel(templatePlans: string[]) {
  if (templatePlans.length === 1 && templatePlans[0] === 'premium') return 'PREMIUM'
  if (templatePlans.includes('pro')) return 'PRO'
  return 'VERROUILLÉ'
}

// True A4 at 96 dpi — never change these, PDF depends on them
const A4_W = 794
const A4_H = 1123

export function StepPreview({ data, template, onTemplateChange, plan }: StepPreviewProps) {
  // Visible (scaled) preview ref
  const cvRef = useRef<HTMLDivElement>(null)
  // Hidden full-size export ref (off-screen, no transform)
  const exportRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const [isExporting, setIsExporting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [zoomLevel, setZoomLevel] = useState<number>(0.75)
  const [mounted, setMounted] = useState(false)

  const [canvaConfig, setCanvaConfig] = useState<CanvaCustomization>({
    primaryColor: CANVA_COLORS[0].value,
    fontFamily: CANVA_FONTS[0].value,
    fontSizePt: 10,
    isCanvaDirectEditMode: true,
  })

  // Need document to be available for portal
  useEffect(() => { setMounted(true) }, [])

  // Auto-fit zoom to container width
  useEffect(() => {
    const measure = () => {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth - 48
        const autoZoom = Math.min(0.9, Math.max(0.35, w / A4_W))
        setZoomLevel(parseFloat(autoZoom.toFixed(2)))
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (previewContainerRef.current) ro.observe(previewContainerRef.current)
    return () => ro.disconnect()
  }, [])

  const updateCanvaConfig = (updates: Partial<CanvaCustomization>) =>
    setCanvaConfig(prev => ({ ...prev, ...updates }))

  const templates = useMemo(() => templateCatalog, [])

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates
    if (activeCategory === 'free') return templates.filter(t => t.plans.includes('gratuit'))
    if (activeCategory === 'pro') return templates.filter(t => t.plans.includes('pro'))
    if (activeCategory === 'premium') return templates.filter(t => t.plans.includes('premium'))
    return templates
  }, [templates, activeCategory])

  const isTemplateAvailable = (t: TemplateCatalogItem) => t.plans.includes(plan.id)

  // ── PDF EXPORT ──────────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!exportRef.current) return
    setIsExporting(true)

    try {
      // Give browser time to fully render the hidden export div
      await new Promise(resolve => setTimeout(resolve, 600))

      // Capture from the HIDDEN full-size div (no transform, real pixel size)
      const dataUrl = await toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2,          // Retina-quality output
        backgroundColor: '#ffffff',
        width: A4_W,
        height: exportRef.current.scrollHeight,
        skipFonts: false,
      })

      const JSPDFClass =
        typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF ?? (jsPDF as any).default

      if (!JSPDFClass) throw new Error('Moteur PDF introuvable')

      const pdf = new JSPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const realHeight = exportRef.current.scrollHeight
      const pdfWidth = 210                                     // mm
      const pdfHeight = (realHeight * pdfWidth) / A4_W        // proportional

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(
        `CV_${data.informations_personnelles.prenom || 'CVAfrik'}_${
          data.informations_personnelles.nom || 'CV'
        }.pdf`
      )
      toast.success('CV téléchargé avec succès ! ✅')
    } catch (err: any) {
      console.error('PDF export error:', err)
      toast.error(`Erreur export PDF : ${err.message ?? 'Échec'}`)
    } finally {
      setIsExporting(false)
    }
  }

  // Wrapper dimensions = A4 × zoom (keeps layout clean, no overflow)
  const scaledW = Math.round(A4_W * zoomLevel)
  const scaledH = Math.round(A4_H * zoomLevel)

  return (
    <div className="space-y-4 max-w-7xl mx-auto">

      {/*
        ── HIDDEN EXPORT DIV (portal → body) ─────────────────────────────
        Rendered at TRUE A4 size, NO transform, off-screen.
        html-to-image captures this, not the scaled preview.
      */}
      {mounted && createPortal(
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: `${A4_W}px`,
            minHeight: `${A4_H}px`,
            background: '#ffffff',
            overflow: 'hidden',
            zIndex: -1,
            fontFamily: canvaConfig.fontFamily,
            fontSize: `${canvaConfig.fontSizePt}pt`,
            pointerEvents: 'none',
          }}
          ref={exportRef}
        >
          {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
        </div>,
        document.body
      )}

      {/* ── TOP BANNER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-5 rounded-2xl border border-border/80 shadow-sm">
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Studio Canva & Modèles</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase">
              Éditeur
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Personnalisez couleurs, polices et modifiez directement votre CV.</p>
        </div>

        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          {/* Fullscreen preview */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl border-border/80 font-medium">
                <Maximize2 className="h-4 w-4 text-primary" />
                Plein Écran
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[95vh] w-full max-w-[100vw] flex-col items-center overflow-auto border-none bg-slate-950/90 p-4 backdrop-blur-md">
              <DialogHeader className="mb-3 flex w-full items-center justify-between shrink-0">
                <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Aperçu Haute Définition (A4)
                </DialogTitle>
              </DialogHeader>
              <div className="custom-scrollbar flex w-full flex-1 justify-center overflow-auto py-4">
                <div
                  className="shrink-0 bg-white shadow-2xl rounded-sm overflow-hidden"
                  style={{
                    width: `${A4_W}px`,
                    minHeight: `${A4_H}px`,
                    fontFamily: canvaConfig.fontFamily,
                    fontSize: `${canvaConfig.fontSizePt}pt`,
                  }}
                >
                  {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Download PDF */}
          <Button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="gap-2 rounded-xl bg-primary px-6 shadow-lg shadow-primary/25 font-semibold text-white hover:bg-primary/90 transition-all active:scale-95"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── CANVA TOOLBAR ────────────────────────────────────────────────── */}
      <CanvaToolbar customization={canvaConfig} onChange={updateCanvaConfig} />

      {/* ── MAIN GRID ────────────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-12">

        {/* Template Catalog */}
        <Card className="lg:col-span-5 border-border/80 bg-card/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Modèles de CV ({filteredTemplates.length})
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-primary/10 text-primary border-primary/20">
                {template}
              </Badge>
            </div>
            <CardDescription className="text-xs">Choisissez un style visuel adapté à votre secteur</CardDescription>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 pt-2 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'free', label: 'Gratuits' },
                { id: 'pro', label: 'Pro' },
                { id: 'premium', label: 'Premium' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div
              className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1"
              role="radiogroup"
            >
              {filteredTemplates.map(tpl => {
                const available = isTemplateAvailable(tpl)
                const isSelected = template === tpl.id
                return (
                  <div
                    key={tpl.id}
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={!available}
                    onClick={e => {
                      e.preventDefault()
                      if (available) onTemplateChange(tpl.id)
                    }}
                    className={cn(
                      'flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-md relative select-none',
                      isSelected && 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10',
                      !available && 'cursor-not-allowed opacity-50 bg-muted/20 pointer-events-none',
                    )}
                  >
                    {/* Color swatch */}
                    <div className={`relative flex h-16 w-full items-center justify-center ${tpl.color}`}>
                      <div className="flex gap-1.5 opacity-60">
                        <div className="h-8 w-4 rounded-sm bg-white/30" />
                        <div className="space-y-1">
                          <div className="h-1.5 w-7 rounded-full bg-white/40" />
                          <div className="h-1.5 w-5 rounded-full bg-white/30" />
                          <div className="h-1.5 w-8 rounded-full bg-white/20" />
                        </div>
                      </div>

                      {!available && (
                        <div className="absolute right-1.5 top-1.5">
                          <span className="flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm border border-white/10">
                            <Lock className="h-2.5 w-2.5" />
                            {getLockLabel(tpl.plans)}
                          </span>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute left-1.5 top-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md text-primary">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 space-y-0.5">
                      <p className="truncate text-xs font-bold text-foreground">{tpl.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{tpl.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Live A4 Preview ─────────────────────────────────────────────── */}
        <Card
          ref={previewContainerRef}
          className="lg:col-span-7 border-border/80 bg-slate-900/5 dark:bg-slate-950/40 rounded-2xl shadow-inner flex flex-col overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MousePointerClick className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>
                Canvas A4 —{' '}
                {canvaConfig.isCanvaDirectEditMode ? (
                  <span className="text-emerald-500 font-bold">Édition Active</span>
                ) : (
                  <span>Lecture seule</span>
                )}
              </span>
            </span>

            <div className="flex items-center gap-1 bg-background border border-border/80 rounded-xl px-2 py-1 shadow-sm">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.35, parseFloat((z - 0.05).toFixed(2))))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Dézoomer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-mono font-semibold px-1.5 min-w-[38px] text-center text-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.0, parseFloat((z + 0.05).toFixed(2))))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Zoomer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable A4 canvas */}
          <div className="flex-1 overflow-auto custom-scrollbar p-4 flex justify-center items-start bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/10 via-transparent to-transparent dark:from-slate-700/20">
            {/* Wrapper = scaled dimensions → no overflow */}
            <div
              style={{
                width: `${scaledW}px`,
                height: `${scaledH}px`,
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <div
                ref={cvRef}
                contentEditable={canvaConfig.isCanvaDirectEditMode}
                suppressContentEditableWarning
                className={cn(
                  'absolute top-0 left-0 bg-white shadow-2xl overflow-hidden transition-shadow duration-200',
                  canvaConfig.isCanvaDirectEditMode
                    ? 'hover:ring-4 hover:ring-blue-500/30 focus:ring-4 focus:ring-blue-500/60 focus:outline-none cursor-text'
                    : 'cursor-default'
                )}
                style={{
                  width: `${A4_W}px`,
                  minHeight: `${A4_H}px`,
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  fontFamily: canvaConfig.fontFamily,
                  fontSize: `${canvaConfig.fontSizePt}pt`,
                }}
              >
                {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="shrink-0 px-4 py-2 border-t border-border/30 bg-card/30 backdrop-blur-sm">
            <p className="text-[10px] text-muted-foreground text-center">
              {canvaConfig.isCanvaDirectEditMode
                ? '✏️ Cliquez sur le texte du CV pour modifier directement'
                : '👁️ Mode lecture — activez "Édition sur Canvas" pour modifier'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
