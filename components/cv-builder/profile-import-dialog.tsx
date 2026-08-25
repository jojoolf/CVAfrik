'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ClipboardPaste, FileArchive, FileText, Linkedin, Loader2, ShieldCheck, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { parseLinkedInExport, parsePdfProfile, parseProfileText, type LinkedInImportResult } from '@/lib/linkedin-import'
import type { CVDonnees } from '@/lib/types'

interface ProfileImportDialogProps {
  currentData: CVDonnees
  onApply: (data: CVDonnees) => void
  disabled?: boolean
  open?: boolean
  initialMode?: ImportMode
  hideTrigger?: boolean
  onOpenChange?: (open: boolean) => void
}

type ImportMode = 'linkedin' | 'pdf' | 'text'

function hasText(value?: string) {
  return Boolean(value?.trim())
}

function mergeImport(current: CVDonnees, imported: Partial<CVDonnees>): CVDonnees {
  const importedInfo = imported.informations_personnelles
  return {
    ...current,
    ...imported,
    informations_personnelles: {
      ...current.informations_personnelles,
      ...importedInfo,
      prenom: hasText(importedInfo?.prenom) ? importedInfo!.prenom : current.informations_personnelles.prenom,
      nom: hasText(importedInfo?.nom) ? importedInfo!.nom : current.informations_personnelles.nom,
      email: hasText(importedInfo?.email) ? importedInfo!.email : current.informations_personnelles.email,
      telephone: hasText(importedInfo?.telephone) ? importedInfo!.telephone : current.informations_personnelles.telephone,
      adresse: hasText(importedInfo?.adresse) ? importedInfo!.adresse : current.informations_personnelles.adresse,
      linkedin: hasText(importedInfo?.linkedin) ? importedInfo!.linkedin : current.informations_personnelles.linkedin,
      photo: current.informations_personnelles.photo,
    },
    titre_professionnel: hasText(imported.titre_professionnel) ? imported.titre_professionnel! : current.titre_professionnel,
    resume: hasText(imported.resume) ? imported.resume : current.resume,
    experiences: imported.experiences?.length ? imported.experiences : current.experiences,
    formations: imported.formations?.length ? imported.formations : current.formations,
    competences: imported.competences?.length ? imported.competences : current.competences,
    langues: imported.langues?.length ? imported.langues : current.langues,
    certifications: imported.certifications?.length ? imported.certifications : current.certifications,
  }
}

export function ProfileImportDialog({ currentData, onApply, disabled, open: controlledOpen, initialMode, hideTrigger = false, onOpenChange }: ProfileImportDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [mode, setMode] = useState<ImportMode>(initialMode || 'linkedin')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [result, setResult] = useState<LinkedInImportResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (open && initialMode) {
      setMode(initialMode)
      setFile(null)
      setResult(null)
      setError(null)
    }
  }, [open, initialMode])

  const importedName = useMemo(() => {
    const info = result?.data.informations_personnelles
    return [info?.prenom, info?.nom].filter(Boolean).join(' ') || 'Profil importé'
  }, [result])

  const resetResult = () => {
    setResult(null)
    setError(null)
  }

  const parseImport = async () => {
    setError(null)
    setIsLoading(true)
    try {
      if (mode === 'linkedin') {
        if (!file) throw new Error('Choisis d’abord ton export LinkedIn au format ZIP.')
        setResult(await parseLinkedInExport(file))
      } else if (mode === 'text') {
        if (text.trim().length < 40) throw new Error('Colle au moins quelques lignes de ton profil ou de ton CV.')
        const parsed = parseProfileText(text)
        if (linkedInUrl.trim()) {
          parsed.data.informations_personnelles = {
            ...parsed.data.informations_personnelles!,
            linkedin: linkedInUrl.trim(),
          }
        }
        setResult(parsed)
      } else {
        if (!file) throw new Error('Choisis d’abord ton CV au format PDF.')
        setResult(await parsePdfProfile(file))
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Impossible de lire ces informations.')
    } finally {
      setIsLoading(false)
    }
  }

  const applyImport = () => {
    if (!result) return
    onApply(mergeImport(currentData, result.data))
    setOpen(false)
    resetResult()
  }

  const modes: { id: ImportMode; label: string; icon: typeof Linkedin; note: string }[] = [
    { id: 'linkedin', label: 'Archive LinkedIn ZIP', icon: Linkedin, note: 'Importe ton archive personnelle LinkedIn (.zip).' },
    { id: 'text', label: 'Coller mon profil', icon: ClipboardPaste, note: 'Copie le texte de ton profil ou de ton CV.' },
    { id: 'pdf', label: 'PDF / CV', icon: FileText, note: 'Analyse un CV PDF texte et prépare ses rubriques.' },
  ]

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetResult() }}>
      {!hideTrigger && <DialogTrigger asChild>
        <Button type="button" disabled={disabled} variant="outline" className="h-10 rounded-xl border-primary/30 bg-primary/5 font-semibold text-primary hover:bg-primary/10">
          <Upload className="mr-2 h-4 w-4" /> Importer mon profil
        </Button>
      </DialogTrigger>}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-card to-blue-500/5 px-6 py-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><SparkleIcon /></div>
          <DialogTitle className="text-2xl font-black">Créer mon CV plus rapidement</DialogTitle>
          <DialogDescription className="max-w-xl leading-6">Importe tes propres données, vérifie-les, puis continue dans le formulaire CVAfrik. Aucune donnée LinkedIn n’est récupérée depuis une URL ni envoyée à un service tiers.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-6">
          {!result ? <>
            <div className="grid gap-2 sm:grid-cols-3">
              {modes.map((item) => {
                const Icon = item.icon
                const active = mode === item.id
                return <button key={item.id} type="button" onClick={() => { setMode(item.id); resetResult() }} className={cn('rounded-2xl border p-3 text-left transition', active ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-background hover:border-primary/40')}>
                  <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
                  <p className="mt-2 text-sm font-bold text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs leading-4 text-muted-foreground">{item.note}</p>
                </button>
              })}
            </div>

            {(mode === 'linkedin' || mode === 'pdf') && <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/[0.035] p-5">
              <div className="flex flex-col items-center justify-center text-center">{mode === 'linkedin' ? <FileArchive className="h-8 w-8 text-primary" /> : <FileText className="h-8 w-8 text-primary" />}<p className="mt-3 font-bold text-foreground">{mode === 'linkedin' ? 'Ton export de données LinkedIn' : 'Ton CV existant en PDF'}</p><p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">{mode === 'linkedin' ? 'Télécharge ton archive depuis les paramètres LinkedIn, puis choisis le fichier ZIP. Nous lirons les fichiers Profile, Positions, Education, Skills, Languages et Certifications présents dans l’archive.' : 'Choisis un PDF avec du texte sélectionnable, de 8 Mo maximum. Nous détecterons le profil, les expériences, les formations, les compétences et les langues, puis tu vérifieras tout avant de continuer. Les PDF scannés sont à coller en texte pour le moment.'}</p><input ref={inputRef} type="file" accept={mode === 'linkedin' ? '.zip,application/zip' : '.pdf,application/pdf'} className="hidden" onChange={(event) => { setFile(event.target.files?.[0] || null); resetResult() }} /><Button type="button" variant="secondary" className="mt-4 rounded-xl" onClick={() => inputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> {file ? 'Changer le fichier' : mode === 'linkedin' ? 'Choisir mon export ZIP' : 'Choisir mon PDF'}</Button>{file && <p className="mt-3 text-xs font-semibold text-primary">{file.name}</p>}{mode === 'linkedin' && <a href="https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data" target="_blank" rel="noreferrer" className="mt-4 text-xs font-semibold text-primary underline underline-offset-4">Comment télécharger mon archive LinkedIn ?</a>}</div>
            </div>}

            {mode === 'text' && <div className="space-y-3"><label className="text-sm font-bold text-foreground">Texte de ton profil ou CV</label><textarea value={text} onChange={(event) => { setText(event.target.value); resetResult() }} placeholder="Colle ici ton titre, ton résumé, tes expériences, tes formations et tes compétences…" className="min-h-44 w-full resize-y rounded-2xl border border-input bg-background p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10" /><input value={linkedInUrl} onChange={(event) => setLinkedInUrl(event.target.value)} placeholder="Lien LinkedIn facultatif — ajouté au CV, non analysé" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>}

            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
            <div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" /> Tu vérifies toujours les données avant de les utiliser.</span><Button type="button" onClick={parseImport} disabled={isLoading} className="rounded-xl">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lecture…</> : 'Analyser mes données'}</Button></div>
          </> : <div className="space-y-5"><div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /><div><p className="font-bold text-foreground">Données prêtes à vérifier pour {importedName}</p><p className="mt-1 text-sm text-muted-foreground">Tu peux maintenant continuer dans le formulaire et corriger chaque information avant de générer ton CV.</p></div></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{[['Expériences', result.summary.experiences], ['Formations', result.summary.formations], ['Compétences', result.summary.competences], ['Langues', result.summary.langues], ['Certificats', result.summary.certifications]].map(([label, count]) => <div key={String(label)} className="rounded-xl border border-border bg-background p-3 text-center"><p className="text-xl font-black text-primary">{count}</p><p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p></div>)}</div><div className="rounded-xl border border-border bg-muted/35 p-4 text-sm"><p className="font-bold text-foreground">Aperçu</p><p className="mt-2 text-muted-foreground">{result.data.titre_professionnel || 'Titre professionnel à compléter'}</p><p className="mt-1 line-clamp-3 text-muted-foreground">{result.data.resume || 'Le résumé pourra être complété dans le formulaire.'}</p></div><div className="flex justify-end gap-3"><Button type="button" variant="outline" className="rounded-xl" onClick={resetResult}>Recommencer</Button><Button type="button" className="rounded-xl" onClick={applyImport}>Utiliser ces données</Button></div></div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SparkleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2"><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></svg>
}
