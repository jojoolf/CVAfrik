'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Download, Loader2, Sparkles, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
import html2canvas from 'html2canvas'
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

interface StepPreviewProps {
  data: CVDonnees
  template: string
  onTemplateChange: (template: string) => void
  plan: PlanConfig
}

const templates = [
  { id: 'classique', name: 'Classique', description: 'Design intemporel', plans: ['gratuit', 'pro', 'premium'] },
  { id: 'moderne', name: 'Moderne', description: 'Design contemporain', plans: ['gratuit', 'pro', 'premium'] },
  { id: 'creatif', name: 'Creatif', description: 'Design original', plans: ['pro', 'premium'] },
  { id: 'executif', name: 'Executif', description: 'Design sobre', plans: ['pro', 'premium'] },
  { id: 'tech', name: 'Tech', description: 'Pour developpeurs', plans: ['pro', 'premium'] },
  { id: 'minimaliste', name: 'Minimaliste', description: 'L\'essentiel', plans: ['pro', 'premium'] },
  { id: 'startup', name: 'Startup', description: 'Dynamique', plans: ['premium'] },
  { id: 'luxe', name: 'Luxe', description: 'Elegant', plans: ['premium'] },
]

function CVTemplateRenderer({ template, data, showWatermark }: { template: string; data: CVDonnees; showWatermark: boolean }) {
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
    default:
      return <CVPreviewModerne data={data} showWatermark={showWatermark} />
  }
}

export function StepPreview({ data, template, onTemplateChange, plan }: StepPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const isTemplateAvailable = (templateId: string) => {
    const t = templates.find(t => t.id === templateId)
    return t?.plans.includes(plan.id) || false
  }

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return
    setIsExporting(true)
    
    try {
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await html2canvas(cvRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // Handle different module resolution in Next.js/Turbopack
      const JSPDFClass = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF || (jsPDF as any).default;
      
      if (!JSPDFClass) {
        throw new Error("Impossible de charger le module PDF.")
      }

      const pdf = new JSPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
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
        <div>
          <h2 className="text-2xl font-bold text-foreground">Apercu et template</h2>
          <p className="text-muted-foreground">
            Choisissez votre template et telechargez votre CV
          </p>
        </div>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isExporting}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full px-6"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generation...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Telecharger PDF
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Template Selection */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Templates
            </CardTitle>
            <CardDescription>Style de votre CV</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={template} onValueChange={onTemplateChange} className="space-y-2">
              {templates.map((t) => {
                const available = isTemplateAvailable(t.id)
                return (
                  <div key={t.id}>
                    <RadioGroupItem
                      value={t.id}
                      id={t.id}
                      disabled={!available}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={t.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-xl border-2 border-muted bg-popover p-3 transition-all hover:border-primary/50',
                        'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary',
                        !available && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.description}</p>
                      </div>
                      {!available && (
                        <Badge variant="secondary" className="gap-1 text-[10px] py-0">
                          <Lock className="h-2.5 w-2.5" />
                          {t.plans.includes('pro') ? 'Pro' : 'Premium'}
                        </Badge>
                      )}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* CV Preview */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-none bg-transparent">
          <div className="relative group">
            <div className="overflow-auto rounded-xl border border-border bg-gray-100 shadow-inner p-4 md:p-8 flex justify-center custom-scrollbar">
              <div 
                ref={cvRef}
                className="bg-white shadow-2xl shrink-0"
                style={{ 
                  width: '210mm',
                  minHeight: '297mm',
                  // Ensure it renders exactly as A4 for PDF export
                }}
              >
                <CVTemplateRenderer
                  template={template}
                  data={data}
                  showWatermark={plan.limites.filigrane}
                />
              </div>
            </div>
            
            {/* Hover indication */}
            <div className="absolute top-4 right-4 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl">
              <p className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
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
