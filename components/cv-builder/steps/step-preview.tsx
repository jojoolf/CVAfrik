'use client'

import { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Download, Loader2, Sparkles, FileText, Maximize2, CheckCircle, ZoomIn, ZoomOut, MousePointerClick } from 'lucide-react'
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

export function StepPreview({ data, template, onTemplateChange, plan }: StepPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [zoomLevel, setZoomLevel] = useState<number>(0.85)

  // Canva Customization State
  const [canvaConfig, setCanvaConfig] = useState<CanvaCustomization>({
    primaryColor: CANVA_COLORS[0].value,
    fontFamily: CANVA_FONTS[0].value,
    fontSizePt: 10,
    isCanvaDirectEditMode: true,
  })

  const updateCanvaConfig = (updates: Partial<CanvaCustomization>) => {
    setCanvaConfig(prev => ({ ...prev, ...updates }))
  }

  const templates = useMemo(() => templateCatalog, [])

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates
    if (activeCategory === 'free') return templates.filter(t => t.plans.includes('gratuit'))
    if (activeCategory === 'pro') return templates.filter(t => t.plans.includes('pro'))
    if (activeCategory === 'premium') return templates.filter(t => t.plans.includes('premium'))
    return templates
  }, [templates, activeCategory])

  const isTemplateAvailable = (templateConfig: TemplateCatalogItem) =>
    templateConfig.plans.includes(plan.id)

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return
    setIsExporting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const dataUrl = await toPng(cvRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      const JSPDFClass = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF || (jsPDF as any).default

      if (!JSPDFClass) {
        throw new Error('Impossible de charger le moteur d\'exportation PDF.')
      }

      const pdf = new JSPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210
      const imgHeight = (cvRef.current.offsetHeight * imgWidth) / cvRef.current.offsetWidth

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`CV_${data.informations_personnelles.prenom || 'CVAfrik'}_${data.informations_personnelles.nom || 'CV'}.pdf`)
      toast.success('Votre CV a été téléchargé au format PDF avec succès !')
    } catch (error: any) {
      console.error('PDF Error:', error)
      toast.error(`Erreur lors de la génération du PDF : ${error.message || 'Échec d\'export'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-6 rounded-3xl border border-border/80 shadow-sm">
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Studio Canva & Modèles</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase">
              Éditeur Canva
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Personnalisez les couleurs, polices, et modifiez directement le CV sur le canvas.</p>
        </div>

        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl border-border/80 font-medium">
                <Maximize2 className="h-4 w-4 text-primary" />
                Plein Écran
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[95vh] w-full max-w-[100vw] flex-col items-center overflow-auto border-none bg-slate-950/80 p-2 sm:p-6 backdrop-blur-md">
              <DialogHeader className="mb-2 flex w-full items-center justify-between">
                <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Aperçu Haute Définition (A4)
                </DialogTitle>
              </DialogHeader>

              <div className="custom-scrollbar flex w-full justify-center overflow-auto py-4">
                <div
                  className="shrink-0 bg-white shadow-2xl rounded-xs overflow-hidden"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    fontFamily: canvaConfig.fontFamily,
                    fontSize: `${canvaConfig.fontSizePt}pt`,
                  }}
                >
                  {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="gap-2 rounded-xl bg-primary px-6 shadow-lg shadow-primary/25 font-semibold text-white hover:bg-primary/90 transition-all active:scale-95"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération du PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger le CV (PDF)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canva Floating Studio Controls Toolbar */}
      <CanvaToolbar customization={canvaConfig} onChange={updateCanvaConfig} />

      {/* Grid Layout: Template Selector + A4 Sheet Preview */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Template Catalog Panel */}
        <Card className="lg:col-span-5 border-border/80 bg-card/80 backdrop-blur-sm shadow-sm h-fit">
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

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 pt-3 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'free', label: 'Gratuits' },
                { id: 'pro', label: 'Pro' },
                { id: 'premium', label: 'Premium' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <RadioGroup
              value={template}
              onValueChange={onTemplateChange}
              className="grid grid-cols-2 gap-3 max-h-[580px] overflow-y-auto custom-scrollbar pr-1"
            >
              {filteredTemplates.map((templateConfig) => {
                const available = isTemplateAvailable(templateConfig)
                const isSelected = template === templateConfig.id
                return (
                  <div key={templateConfig.id}>
                    <RadioGroupItem
                      value={templateConfig.id}
                      id={templateConfig.id}
                      disabled={!available}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={templateConfig.id}
                      className={cn(
                        'flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-md relative group',
                        isSelected && 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10',
                        !available && 'cursor-not-allowed opacity-50 bg-muted/20',
                      )}
                    >
                      {/* Color Preview Block */}
                      <div className={`relative flex h-16 w-full items-center justify-center ${templateConfig.color}`}>
                        <div className="flex gap-1.5 opacity-60">
                          <div className="h-8 w-4 rounded-xs bg-white/30" />
                          <div className="space-y-1">
                            <div className="h-1.5 w-7 rounded-full bg-white/40" />
                            <div className="h-1.5 w-5 rounded-full bg-white/30" />
                            <div className="h-1.5 w-8 rounded-full bg-white/20" />
                          </div>
                        </div>

                        {!available && (
                          <div className="absolute right-1.5 top-1.5">
                            <span className="flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs border border-white/10">
                              <Lock className="h-2.5 w-2.5" />
                              {getLockLabel(templateConfig.plans)}
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

                      {/* Info Block */}
                      <div className="p-2.5 space-y-0.5">
                        <p className="truncate text-xs font-bold text-foreground">{templateConfig.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{templateConfig.description}</p>
                      </div>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Live Interactive A4 Sheet Display (Canva Style) */}
        <Card className="lg:col-span-7 border-border/80 bg-slate-900/5 dark:bg-slate-950/40 p-4 sm:p-6 rounded-3xl overflow-hidden shadow-inner flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MousePointerClick className="h-4 w-4 text-primary animate-pulse" />
              <span>Canvas Canva A4 (Mode d'Édition Visuelle {canvaConfig.isCanvaDirectEditMode ? 'Actif' : 'Passif'})</span>
            </span>

            <div className="flex items-center gap-1 bg-card border border-border/80 rounded-xl px-2 py-1 shadow-xs">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.05))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Dézoomer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-mono font-semibold px-1 text-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.0, z + 0.05))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Zoomer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar flex w-full justify-center overflow-auto rounded-2xl py-2 min-h-[600px]">
            <div
              ref={cvRef}
              contentEditable={canvaConfig.isCanvaDirectEditMode}
              suppressContentEditableWarning
              className={`shrink-0 bg-white shadow-2xl rounded-xs overflow-hidden transition-all duration-200 ${
                canvaConfig.isCanvaDirectEditMode 
                  ? 'hover:ring-4 hover:ring-blue-500/40 focus:ring-4 focus:ring-blue-500 focus:outline-none cursor-text' 
                  : ''
              }`}
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                marginBottom: `-${(1 - zoomLevel) * 297 * 3.779}px`,
                fontFamily: canvaConfig.fontFamily,
                fontSize: `${canvaConfig.fontSizePt}pt`,
                // Custom accent color override
                borderColor: canvaConfig.primaryColor,
              }}
            >
              {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
