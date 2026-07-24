'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Type, 
  MousePointerClick, 
  Sparkles, 
  Check, 
  AArrowUp, 
  AArrowDown 
} from 'lucide-react'

export interface CanvaCustomization {
  primaryColor: string
  fontFamily: string
  fontSizePt: number
  isCanvaDirectEditMode: boolean
}

interface CanvaToolbarProps {
  customization: CanvaCustomization
  onChange: (updates: Partial<CanvaCustomization>) => void
}

export const CANVA_COLORS = [
  { id: 'amber', name: 'Ambre Or', value: '#d97706', bgClass: 'bg-amber-600' },
  { id: 'royal', name: 'Bleu Royal', value: '#2563eb', bgClass: 'bg-blue-600' },
  { id: 'emerald', name: 'Émeraude', value: '#059669', bgClass: 'bg-emerald-600' },
  { id: 'crimson', name: 'Rouge Carmin', value: '#dc2626', bgClass: 'bg-red-600' },
  { id: 'purple', name: 'Violet Exécutif', value: '#7c3aed', bgClass: 'bg-purple-600' },
  { id: 'slate', name: 'Anthracite', value: '#334155', bgClass: 'bg-slate-700' },
]

export const CANVA_FONTS = [
  { id: 'sans', name: 'Inter (Moderne)', value: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
  { id: 'serif', name: 'Playfair (Élégant)', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'mono', name: 'Monospace (Tech)', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
]

export function CanvaToolbar({ customization, onChange }: CanvaToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card/90 border border-border/80 shadow-lg backdrop-blur-xl transition-all">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-primary/10 text-primary border-primary/20 font-bold text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          Studio Canva
        </Badge>

        {/* Toggle Direct Canva Click-to-edit Mode */}
        <button
          type="button"
          onClick={() => onChange({ isCanvaDirectEditMode: !customization.isCanvaDirectEditMode })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            customization.isCanvaDirectEditMode
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <MousePointerClick className="h-3.5 w-3.5" />
          <span>Édition sur Canvas : {customization.isCanvaDirectEditMode ? 'ACTIVÉE' : 'DÉSACTIVÉE'}</span>
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* Colors Palette Picker */}
        <div className="flex items-center gap-1.5 border-r border-border/60 pr-3">
          <Palette className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {CANVA_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => onChange({ primaryColor: color.value })}
              className={`h-6 w-6 rounded-full ${color.bgClass} flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                customization.primaryColor === color.value ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
              }`}
              title={color.name}
            >
              {customization.primaryColor === color.value && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Font Family Picker */}
        <div className="flex items-center gap-1.5 border-r border-border/60 pr-3">
          <Type className="h-3.5 w-3.5 text-muted-foreground" />
          <Select
            value={customization.fontFamily}
            onValueChange={(val) => onChange({ fontFamily: val })}
          >
            <SelectTrigger className="h-8 text-xs font-semibold rounded-xl w-[140px] border-border/60">
              <SelectValue placeholder="Police" />
            </SelectTrigger>
            <SelectContent>
              {CANVA_FONTS.map((font) => (
                <SelectItem key={font.id} value={font.value} className="text-xs">
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size Adjusters */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ fontSizePt: Math.max(8.5, customization.fontSizePt - 0.5) })}
            className="h-8 w-8 p-0 rounded-lg"
            title="Réduire la taille du texte"
          >
            <AArrowDown className="h-3.5 w-3.5" />
          </Button>

          <span className="text-xs font-mono font-bold px-1.5 text-foreground">
            {customization.fontSizePt}pt
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ fontSizePt: Math.min(12, customization.fontSizePt + 0.5) })}
            className="h-8 w-8 p-0 rounded-lg"
            title="Agrandir la taille du texte"
          >
            <AArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
