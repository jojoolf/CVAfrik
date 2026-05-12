'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CVDonnees, PlanConfig } from '@/lib/types'
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
  const isTemplateAvailable = (templateId: string) => {
    const t = templates.find(t => t.id === templateId)
    return t?.plans.includes(plan.id) || false
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Apercu et template</h2>
        <p className="mt-2 text-muted-foreground">
          Choisissez votre template et verifiez votre CV
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Template Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Template</CardTitle>
            <CardDescription>Choisissez le style de votre CV</CardDescription>
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
                        'flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 transition-colors',
                        'peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary',
                        !available && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div>
                        <p className="font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      {!available && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Lock className="h-3 w-3" />
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Apercu</CardTitle>
            <CardDescription>Voici a quoi ressemblera votre CV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-lg">
              <div className="aspect-[8.5/11] w-full overflow-y-auto">
                <CVTemplateRenderer
                  template={template}
                  data={data}
                  showWatermark={plan.limites.filigrane}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
