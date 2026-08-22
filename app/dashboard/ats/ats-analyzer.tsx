'use client'

import { useState } from 'react'
import { CheckCircle2, CircleAlert, FileSearch, Lightbulb, Loader2, Sparkles, Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type AtsResult = {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  breakdown: { keywords: number; experience: number; structure: number; impact: number }
}

export function AtsAnalyzer({ cvs }: { cvs: { id: string; titre: string | null; updated_at: string }[] }) {
  const [cvId, setCvId] = useState(cvs[0]?.id || '')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AtsResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runAnalysis = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!cvId || jobDescription.trim().length < 40) {
      toast.error('Sélectionnez un CV et ajoutez une description d’offre d’au moins quelques lignes.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ats/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cvId, jobDescription }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setResult(payload.result)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'L’analyse ATS a échoué.')
    } finally { setLoading(false) }
  }

  const scoreTone = !result ? 'text-primary' : result.score >= 75 ? 'text-emerald-600 dark:text-emerald-400' : result.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-destructive'

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-6 lg:p-8"><div className="relative"><p className="flex items-center gap-1.5 text-sm font-semibold text-primary"><Target className="h-4 w-4" />Adaptation à une offre</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">Vérifiez l’adéquation de votre CV</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Comparez vos informations à une offre pour identifier les mots-clés couverts et les éléments à renforcer. Cette première analyse est déterministe : aucune donnée n’est envoyée à un modèle IA.</p></div></div>

        {!cvs.length ? <Card className="border-dashed"><CardContent className="py-14 text-center"><FileSearch className="mx-auto mb-4 h-8 w-8 text-primary" /><h2 className="text-xl font-bold">Créez d’abord un CV</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">L’analyse utilise vos expériences et compétences enregistrées dans un CV.</p><Button asChild className="mt-5"><a href="/cv-builder">Créer mon CV</a></Button></CardContent></Card> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><Card><CardHeader><CardTitle>Analyser une offre</CardTitle><CardDescription>Copiez-collez la description complète de l’offre ou ses critères principaux.</CardDescription></CardHeader><CardContent><form onSubmit={runAnalysis} className="space-y-5"><div className="space-y-2"><Label>CV à analyser</Label><Select value={cvId} onValueChange={setCvId}><SelectTrigger><SelectValue placeholder="Choisir un CV" /></SelectTrigger><SelectContent>{cvs.map((cv) => <SelectItem key={cv.id} value={cv.id}>{cv.titre || 'CV sans titre'}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Description de l’offre</Label><Textarea className="min-h-72" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Collez ici les missions, compétences, exigences et critères mentionnés dans l’offre..." /></div><Button type="submit" disabled={loading} className="w-full">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Analyser mon adéquation</Button></form></CardContent></Card>
          <div className="space-y-4">{result ? <><Card className="border-primary/20 bg-primary/5"><CardHeader className="pb-2"><CardDescription>Score d’adéquation indicatif</CardDescription><CardTitle className={`text-5xl ${scoreTone}`}>{result.score}<span className="text-xl">/100</span></CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg bg-background/70 p-3"><p className="text-muted-foreground">Mots-clés</p><p className="mt-1 text-lg font-bold">{result.breakdown.keywords}/45</p></div><div className="rounded-lg bg-background/70 p-3"><p className="text-muted-foreground">Expérience</p><p className="mt-1 text-lg font-bold">{result.breakdown.experience}/25</p></div><div className="rounded-lg bg-background/70 p-3"><p className="text-muted-foreground">Structure</p><p className="mt-1 text-lg font-bold">{result.breakdown.structure}/15</p></div><div className="rounded-lg bg-background/70 p-3"><p className="text-muted-foreground">Impact</p><p className="mt-1 text-lg font-bold">{result.breakdown.impact}/15</p></div></div></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-4 w-4 text-amber-500" />Recommandations</CardTitle></CardHeader><CardContent className="space-y-3">{result.suggestions.map((suggestion) => <p className="flex gap-2 text-sm leading-relaxed text-muted-foreground" key={suggestion}><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{suggestion}</p>)}</CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-base">Mots-clés trouvés</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{result.matchedKeywords.length ? result.matchedKeywords.map((word) => <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300" key={word}>{word}</span>) : <p className="text-sm text-muted-foreground">Aucun mot-clé clairement identifié.</p>}</CardContent></Card>{result.missingKeywords.length ? <Card><CardHeader className="pb-3"><CardTitle className="text-base">À vérifier dans votre parcours</CardTitle><CardDescription>N’ajoutez ces mots que s’ils correspondent réellement à vos compétences.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{result.missingKeywords.map((word) => <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300" key={word}>{word}</span>)}</CardContent></Card> : null}</> : <Card className="border-dashed"><CardContent className="flex flex-col items-center px-6 py-16 text-center"><CheckCircle2 className="mb-4 h-8 w-8 text-primary" /><h2 className="font-bold">Résultat après analyse</h2><p className="mt-2 text-sm text-muted-foreground">Votre score, les mots-clés et des recommandations ciblées apparaîtront ici.</p></CardContent></Card>}</div></div>}
      </div>
    </div>
  )
}
