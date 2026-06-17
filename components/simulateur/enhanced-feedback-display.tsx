'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, AlertTriangle, Lightbulb, Compass, Milestone, CheckCircle2 } from 'lucide-react'
import type { InterviewFeedback } from '@/lib/types'

interface EnhancedFeedbackDisplayProps {
  feedback: InterviewFeedback
}

export function EnhancedFeedbackDisplay({ feedback }: EnhancedFeedbackDisplayProps) {
  const { scoreDetails, strengths, improvements, practicalAdvice, sectorSpecificFeedback, nextSteps } = feedback

  const categories = [
    { label: 'Communication', value: scoreDetails.communication, color: 'bg-blue-500' },
    { label: 'Connaissances Techniques', value: scoreDetails.technicalKnowledge, color: 'bg-emerald-500' },
    { label: 'Soft Skills', value: scoreDetails.softSkills, color: 'bg-purple-500' },
    { label: 'Pertinence des Réponses', value: scoreDetails.relevance, color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Score details grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Card key={cat.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted-foreground">{cat.label}</span>
                <span className="font-bold text-foreground">{cat.value}/100</span>
              </div>
              <Progress value={cat.value} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h4 className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-4 text-sm uppercase tracking-wider">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Points Forts
            </h4>
            <ul className="space-y-3">
              {strengths.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 leading-normal">
                  <Star className="h-4 w-4 mt-0.5 shrink-0 fill-emerald-500 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements && improvements.length > 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h4 className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-4 text-sm uppercase tracking-wider">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Axes d&apos;Amélioration
            </h4>
            <ul className="space-y-3">
              {improvements.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-amber-800 dark:text-amber-300 leading-normal">
                  <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-600">!</span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Practical Advice */}
      {practicalAdvice && practicalAdvice.length > 0 && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h4 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400 mb-4 text-sm uppercase tracking-wider">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            Conseils du Coach
          </h4>
          <ul className="space-y-3">
            {practicalAdvice.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-blue-800 dark:text-blue-300 leading-normal">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-blue-500 fill-blue-500/10" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sector Specific Feedback */}
      {sectorSpecificFeedback && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
          <h4 className="flex items-center gap-2 font-bold text-violet-700 dark:text-violet-400 mb-3 text-sm uppercase tracking-wider">
            <Compass className="h-5 w-5 text-violet-500" />
            Analyse Spécifique du Secteur
          </h4>
          <p className="text-xs text-violet-800 dark:text-violet-300 leading-relaxed">
            {sectorSpecificFeedback}
          </p>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="rounded-2xl border border-slate-500/20 bg-slate-500/5 p-5">
          <h4 className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-400 mb-4 text-sm uppercase tracking-wider">
            <Milestone className="h-5 w-5 text-slate-500" />
            Prochaines Étapes Recommandées
          </h4>
          <ul className="space-y-3">
            {nextSteps.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                <span className="font-bold text-slate-500">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
