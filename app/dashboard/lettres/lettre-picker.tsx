'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react'
import type { GeneratedLetter } from './actions'

interface LettrePickerProps {
  letters: GeneratedLetter[]
  savingStyleId: string | null
  onChoose: (letter: GeneratedLetter) => Promise<void>
}

const STYLE_BADGE_CLASS: Record<string, string> = {
  classique: 'bg-slate-100 text-slate-800 border-slate-300',
  dynamique: 'bg-orange-100 text-orange-800 border-orange-300',
  moderne: 'bg-cyan-100 text-cyan-800 border-cyan-300',
}

function getPreview(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join('\n')
}

export function LettrePicker({ letters, savingStyleId, onChoose }: LettrePickerProps) {
  const [expandedStyles, setExpandedStyles] = useState<Record<string, boolean>>({})

  const defaultStyle = useMemo(() => letters[0]?.styleId ?? 'classique', [letters])

  const toggleExpanded = (styleId: string) => {
    setExpandedStyles((prev) => ({ ...prev, [styleId]: !prev[styleId] }))
  }

  const renderLetterCard = (letter: GeneratedLetter) => {
    const isExpanded = !!expandedStyles[letter.styleId]
    const isSaving = savingStyleId === letter.styleId
    const preview = getPreview(letter.content)

    return (
      <Card key={letter.styleId} className="h-full border-primary/20 shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{letter.styleLabel}</CardTitle>
            <Badge
              variant="outline"
              className={STYLE_BADGE_CLASS[letter.styleId] || 'bg-muted text-foreground border-border'}
            >
              {letter.styleId === 'classique' ? 'Classique' : letter.styleId === 'dynamique' ? 'Dynamique' : 'Moderne'}
            </Badge>
          </div>
          <CardDescription>{letter.styleDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {isExpanded ? letter.content : preview || letter.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleExpanded(letter.styleId)}
              className="flex-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Masquer
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Voir la lettre complete
                </>
              )}
            </Button>

            <Button type="button" onClick={() => onChoose(letter)} disabled={isSaving} className="flex-1 bg-primary">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Choisir cette lettre
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          3 versions ont ete generees. Comparez puis choisissez celle qui vous ressemble le plus.
        </p>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-3">{letters.map(renderLetterCard)}</div>

      <div className="md:hidden">
        <Tabs defaultValue={defaultStyle} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {letters.map((letter) => (
              <TabsTrigger key={letter.styleId} value={letter.styleId}>
                {letter.styleId === 'classique' ? 'Classique' : letter.styleId === 'dynamique' ? 'Dynamique' : 'Moderne'}
              </TabsTrigger>
            ))}
          </TabsList>
          {letters.map((letter) => (
            <TabsContent key={letter.styleId} value={letter.styleId}>
              {renderLetterCard(letter)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
