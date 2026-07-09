'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Lock, Download, Loader2, Sparkles, FileText, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import { TEMPLATE_CATALOG, getPlanLabel, hasTemplateAccess } from '@/lib/template-access'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'

import { CVPreviewClassique } from '../templates/cv-preview-classique'
import { CVPreviewModerne } from '../templates/cv-preview-moderne'
import { CVPreviewCreatif } from '../templates/cv-preview-creatif'
import { CVPreviewExecutif } from '../templates/cv-preview-executif'
import { CVPreviewTech } from '../templates/cv-preview-tech'
import { CVPreviewMinimaliste } from '../templates/cv-preview-minimaliste'
import { CVPreviewStartup } from '../templates/cv-preview-startup'
import { CVPreviewLuxe } from '../templates/cv-preview-luxe'
import { CVPreviewElite } from '../templates/cv-preview-elite'
import { CVPreviewDesign } from '../templates/cv-preview-design'

interface StepPreviewProps {
  data: CVDonnees
  template: string
  onTemplateChange: (template: string) => void
  plan: PlanConfig
}

function CVTemplateRenderer({
  template,
  data,
  showWatermark,
}: {
  template: string
  data: CVDonnees
  showWatermark: boolean
}) {
  switch (template) {
    case 'classique':
      return <CVPreviewClassique data={data} showWatermark={showWatermark} />
    case 'moderne':
      return <CVPreviewModerne data={data} showWatermark={showWatermark} />
    case 'creatif':
      return <CVPreviewCreatif data={data} showWatermark={showWatermark} />
    case 'executif':
      return <CVPreviewExecutif data={data} showWatermark={showWatermark} />
    case 'tech':
      return <CVPreviewTech data={data} showWatermark={showWatermark} />
    case 'minimaliste':
      return <CVPreviewMinimaliste data={data} showWatermark={showWatermark} />
    case 'startup':
      return <CVPreviewStartup data={data} showWatermark={showWatermark} />
    case 'luxe':
      return <CVPreviewLuxe data={data} showWatermark={showWatermark} />
    case 'elite':
      return <CVPreviewElite data={data} showWatermark={showWatermark} />
    case 'design':
      return <CVPreviewDesign data={data} showWatermark={showWatermark} />
    default:
      return <CVPreviewModerne data={data} showWatermark={showWatermark} />
  }
}

export function StepPreview({ data, template, onTemplateChange, plan }: StepPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const isTemplateAvailable = (templateId: string) => hasTemplateAccess(plan.id, templateId)

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

      const JSPDFClass =
        typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF || (jsPDF as any).default

      if (!JSPDFClass) {
        throw new Error('Impossible de charger le module PDF.')
      }

      const pdf = new JSPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210
      const imgHeight = (cvRef.current.offsetHeight * imgWidth) / cvRef.current.offsetWidth

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`CV_${data.informations_personnelles.nom || 'CVAfrik'}.pdf`)
      toast.success('CV telecharge avec succes !')
    } catch (error: any) {
      console.error('PDF Error:', error)
      toast.error(`Erreur: ${error.message || 'Generation du PDF impossible'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-foreground">Apercu et template</h2>
          <p className="text-muted-foreground">Choisissez votre template et telechargez votre CV</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 gap-2 rounded-full border-primary/20 hover:bg-primary/5 lg:hidden">
                <Maximize2 className="h-4 w-4 text-primary" />
                Plein ecran
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[95vh] w-full max-w-[100vw] flex-col items-center overflow-auto border-none bg-slate-100/80 p-2 backdrop-blur-sm md:p-6">
              <DialogHeader className="mb-2 flex w-full justify-between">
                <DialogTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Apercu du CV
                </DialogTitle>
              </DialogHeader>

              <div className="custom-scrollbar flex w-full justify-center overflow-auto">
                <div
                  className="mb-10 shrink-0 bg-white shadow-2xl"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    transform: 'scale(0.85)',
                    transformOrigin: 'top center',
                  }}
                >
                  <CVTemplateRenderer
                    template={template}
                    data={data}
                    showWatermark={plan.limites.filigrane}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-1 flex-col gap-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="w-full gap-2 rounded-full bg-primary px-6 shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Telecharger PDF
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => toast.info('L\'export Word (DOCX) sera disponible dans la prochaine mise a jour !')}
              className="w-full gap-2 rounded-full border-dashed px-6"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Telecharger Word</span>
              <Badge variant="secondary" className="ml-auto py-0 text-[9px]">
                Bientot
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              Templates
            </CardTitle>
            <CardDescription>Choisissez le style de votre CV</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={template} onValueChange={onTemplateChange} className="grid grid-cols-2 gap-2">
              {TEMPLATE_CATALOG.map((item) => {
                const available = isTemplateAvailable(item.id)
                const isSelected = template === item.id

                return (
                  <div key={item.id}>
                    <RadioGroupItem
                      value={item.id}
                      id={item.id}
                      disabled={!available}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={item.id}
                      className={cn(
                        'flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-muted bg-popover transition-all hover:border-primary/50 hover:shadow-md',
                        isSelected && 'border-primary shadow-md ring-2 ring-primary/20',
                        !available && 'cursor-not-allowed opacity-60',
                      )}
                    >
                      <div className={`relative flex h-12 w-full items-center justify-center ${item.color}`}>
                        <div className="flex gap-1 opacity-60">
                          <div className="h-6 w-3 rounded-sm bg-white/30" />
                          <div className="space-y-0.5">
                            <div className="h-1 w-5 rounded-full bg-white/40" />
                            <div className="h-1 w-4 rounded-full bg-white/30" />
                            <div className="h-1 w-6 rounded-full bg-white/20" />
                          </div>
                        </div>

                        {!available && (
                          <div className="absolute right-1 top-1">
                            <span className="flex items-center gap-0.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[8px] font-bold text-white">
                              <Lock className="h-2 w-2" />
                              {getPlanLabel(item.requiredPlan)}
                            </span>
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute left-1 top-1">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="px-2 py-1.5">
                        <p className="truncate text-[11px] font-semibold text-foreground">{item.name}</p>
                        <p className="truncate text-[9px] text-muted-foreground">{item.description}</p>
                      </div>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-transparent shadow-none lg:col-span-2">
          <div className="group relative">
            <div className="custom-scrollbar flex justify-center overflow-auto rounded-xl border border-border bg-gray-100 p-4 shadow-inner md:p-8">
              <div
                ref={cvRef}
                className="shrink-0 bg-white shadow-2xl"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                }}
              >
                <CVTemplateRenderer
                  template={template}
                  data={data}
                  showWatermark={plan.limites.filigrane}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute right-4 top-4 flex items-center justify-center rounded-xl bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold shadow-lg">
                <FileText className="h-3 w-3" />
                Format A4
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
