'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface CVAnalyzeButtonProps {
  cvId: string
  userEmail?: string
  userName?: string
}

export function CVAnalyzeButton({ cvId, userEmail, userName }: CVAnalyzeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setScore(null)

    try {
      const supabase = createClient()
      const { data: cvData, error: fetchError } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single()

      if (fetchError || !cvData) {
        toast.error('Erreur lors du chargement du CV')
        setLoading(false)
        return
      }

      const res = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, userEmail, userName }),
      })
      const data = await res.json()
      if (data.success) {
        setScore(data.score)
        const msg = data.score >= 85
          ? `Score: ${data.score}/100 - Excellent CV ! Un email de félicitations vous a été envoyé !`
          : `Score: ${data.score}/100. Continuez à améliorer votre CV !`
        toast[data.score >= 60 ? 'success' : 'info'](msg)
      } else {
        toast.error("Erreur lors de l'analyse")
      }
    } catch {
      toast.error('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full gap-1.5 text-xs h-7 px-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAnalyze(); }}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : score !== null ? (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      {loading ? 'Analyse...' : score !== null ? `${score}/100` : 'Analyser'}
    </Button>
  )
}
