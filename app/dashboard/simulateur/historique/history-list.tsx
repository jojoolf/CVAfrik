'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquareCode, Bot, User, AlertCircle, FileDown } from 'lucide-react'
import Link from 'next/link'
import { getUserSimulations } from '../actions'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Simulation {
  id: string
  poste: string | null
  score: number | null
  nombre_questions: number | null
  created_at: string
}

export function HistoryList() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const result = await getUserSimulations()
      if (result.success) {
        setSimulations(result.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (simulations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquareCode className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucune simulation</h3>
          <p className="text-sm text-muted-foreground/70 mb-6 max-w-sm">
            Vous n&apos;avez pas encore effectué de simulation d&apos;entretien. Lancez-vous !
          </p>
          <Button asChild>
            <Link href="/dashboard/simulateur">Commencer une simulation</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground'
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number | null) => {
    if (score === null) return 'bg-muted'
    if (score >= 80) return 'bg-green-100 dark:bg-green-950/30'
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-950/30'
    return 'bg-red-100 dark:bg-red-950/30'
  }

  return (
    <div className="space-y-4">
      {simulations.map((sim) => (
        <Link key={sim.id} href={`/dashboard/simulateur/historique/${sim.id}`}>
          <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${getScoreBg(sim.score)}`}>
                  <span className={`text-lg font-black ${getScoreColor(sim.score)}`}>
                    {sim.score ?? '-'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {sim.poste || 'Poste non renseigné'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      {sim.nombre_questions ?? '-'} questions
                    </span>
                    <span>
                      {sim.created_at
                        ? format(new Date(sim.created_at), 'dd MMM yyyy', { locale: fr })
                        : '-'}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Voir →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
