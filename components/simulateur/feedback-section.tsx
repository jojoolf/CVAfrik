'use client'

import { Target, TrendingUp, Lightbulb, Star } from 'lucide-react'

export function FeedbackSection({ feedback }: { feedback: string }) {
  const pointsForts: string[] = []
  const axesAmelioration: string[] = []
  const conseils: string[] = []
  let currentSection = ''

  const lines = feedback.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const lower = trimmed.toLowerCase()
    if (lower.includes('point fort') || lower.includes('points forts')) {
      currentSection = 'forts'
      continue
    }
    if (lower.includes("axe d'am") || lower.includes("axes d'am") || lower.includes('amelioration')) {
      currentSection = 'amelioration'
      continue
    }
    if (lower.includes('conseil')) {
      currentSection = 'conseils'
      continue
    }

    const bullet = trimmed.replace(/^[\s•\-*]+/, '')
    if (!bullet) continue

    if (currentSection === 'forts') pointsForts.push(bullet)
    else if (currentSection === 'amelioration') axesAmelioration.push(bullet)
    else if (currentSection === 'conseils') conseils.push(bullet)
  }

  if (pointsForts.length === 0 && axesAmelioration.length === 0 && conseils.length === 0) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {feedback}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pointsForts.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20 p-5">
          <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-3">
            <TrendingUp className="h-5 w-5" />
            Points forts
          </h4>
          <ul className="space-y-2">
            {pointsForts.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-green-800 dark:text-green-300">
                <Star className="h-4 w-4 mt-0.5 shrink-0 fill-green-500 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {axesAmelioration.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20 p-5">
          <h4 className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-3">
            <Target className="h-5 w-5" />
            Axes d&apos;amélioration
          </h4>
          <ul className="space-y-2">
            {axesAmelioration.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800 dark:text-amber-300">
                <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full border-2 border-amber-400 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-500">!</span>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {conseils.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20 p-5">
          <h4 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400 mb-3">
            <Lightbulb className="h-5 w-5" />
            Conseils pratiques
          </h4>
          <ul className="space-y-2">
            {conseils.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-blue-800 dark:text-blue-300">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
