'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, BriefcaseBusiness, Check, ChevronDown, Download, FileText, GraduationCap,
  Languages, LayoutTemplate, Loader2, Plus, Save, Sparkles, Trash2, UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CV, CVDonnees, Competence, Experience, Formation, Langue, PlanConfig } from '@/lib/types'
import { renderCvTemplate, templateCatalog } from '@/components/cv-builder/templates/cv-preview-collection'
import { downloadCvPdf } from '@/lib/cv-pdf-export'

interface DocumentCvEditorProps {
  cv: CV
  plan: PlanConfig
}

type EditorSection = 'identity' | 'experience' | 'education' | 'skills' | 'languages'

const sectionItems: Array<{ id: EditorSection; label: string; icon: typeof UserRound }> = [
  { id: 'identity', label: 'Profil', icon: UserRound },
  { id: 'experience', label: 'Expériences', icon: BriefcaseBusiness },
  { id: 'education', label: 'Formations', icon: GraduationCap },
  { id: 'skills', label: 'Compétences', icon: Sparkles },
  { id: 'languages', label: 'Langues', icon: Languages },
]

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

function normalizeData(source: CVDonnees): CVDonnees {
  return {
    informations_personnelles: {
      nom: source?.informations_personnelles?.nom || '',
      prenom: source?.informations_personnelles?.prenom || '',
      email: source?.informations_personnelles?.email || '',
      telephone: source?.informations_personnelles?.telephone || '',
      adresse: source?.informations_personnelles?.adresse || '',
      linkedin: source?.informations_personnelles?.linkedin || '',
      photo: source?.informations_personnelles?.photo || '',
    },
    titre_professionnel: source?.titre_professionnel || '',
    resume: source?.resume || '',
    experiences: Array.isArray(source?.experiences) ? source.experiences : [],
    formations: Array.isArray(source?.formations) ? source.formations : [],
    competences: Array.isArray(source?.competences) ? source.competences : [],
    langues: Array.isArray(source?.langues) ? source.langues : [],
    certifications: Array.isArray(source?.certifications) ? source.certifications : [],
    centres_interet: Array.isArray(source?.centres_interet) ? source.centres_interet : [],
  }
}

function editorFieldClass() {
  return 'h-10 border-border/80 bg-background shadow-none focus-visible:ring-primary/25'
}

export function DocumentCvEditor({ cv, plan }: DocumentCvEditorProps) {
  const [data, setData] = useState<CVDonnees>(() => normalizeData(cv.donnees))
  const [title, setTitle] = useState(cv.titre || 'Mon CV professionnel')
  const [template, setTemplate] = useState(cv.template)
  const [activeSection, setActiveSection] = useState<EditorSection>('identity')
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)
  const [isDirty, setIsDirty] = useState(false)

  const currentTemplate = useMemo(
    () => templateCatalog.find((item) => item.id === template) || templateCatalog[0],
    [template],
  )

  const updateData = (updater: (previous: CVDonnees) => CVDonnees) => {
    setData((previous) => updater(previous))
    setIsDirty(true)
  }

  const save = async () => {
    const cleanedTitle = title.trim() || 'Mon CV professionnel'
    setIsSaving(true)
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId: cv.id, titre: cleanedTitle, template, donnees: data }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'La sauvegarde a échoué.')
      setTitle(cleanedTitle)
      setIsDirty(false)
      toast.success('CV enregistré.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'La sauvegarde a échoué.')
    } finally {
      setIsSaving(false)
    }
  }

  const downloadPdf = async () => {
    if (!exportRef.current) return
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 250))
      await downloadCvPdf(
        exportRef.current,
        `CV_${data.informations_personnelles.prenom || 'CVAfrik'}_${data.informations_personnelles.nom || 'CV'}`,
      )
      toast.success('PDF téléchargé.')
    } catch (error) {
      console.error('Document editor PDF export error:', error)
      toast.error(error instanceof Error ? `Erreur export PDF : ${error.message}` : 'L’export PDF a échoué.')
    } finally {
      setIsExporting(false)
    }
  }

  const selectTemplate = (templateId: string) => {
    const candidate = templateCatalog.find((item) => item.id === templateId)
    if (!candidate) return
    const permitted = plan.id !== 'gratuit' || candidate.plans.includes('gratuit')
    if (!permitted) {
      toast.error('Ce modèle est réservé au plan Pro.')
      return
    }
    setTemplate(candidate.id)
    setIsTemplatePickerOpen(false)
    setIsDirty(true)
  }

  const replaceExperience = (id: string, patch: Partial<Experience>) => updateData((previous) => ({
    ...previous,
    experiences: previous.experiences.map((item) => item.id === id ? { ...item, ...patch } : item),
  }))

  const replaceFormation = (id: string, patch: Partial<Formation>) => updateData((previous) => ({
    ...previous,
    formations: previous.formations.map((item) => item.id === id ? { ...item, ...patch } : item),
  }))

  const replaceCompetence = (id: string, patch: Partial<Competence>) => updateData((previous) => ({
    ...previous,
    competences: previous.competences.map((item) => item.id === id ? { ...item, ...patch } : item),
  }))

  const replaceLanguage = (id: string, patch: Partial<Langue>) => updateData((previous) => ({
    ...previous,
    langues: previous.langues.map((item) => item.id === id ? { ...item, ...patch } : item),
  }))

  return (
    <main className="min-h-screen bg-[#fffcf8] pb-10">
      <div aria-hidden="true" data-cv-pdf-render="true" ref={exportRef} style={{ position: 'fixed', top: 0, left: 0, width: 794, minHeight: 1123, overflow: 'visible', visibility: 'hidden', background: '#ffffff', pointerEvents: 'none', zIndex: -1 }}>
        {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
      </div>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-xl" aria-label="Retour à mes CV">
              <Link href="/dashboard/cv"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Mes CV · Atelier Document</p>
              <Input
                value={title}
                onChange={(event) => { setTitle(event.target.value); setIsDirty(true) }}
                aria-label="Titre du CV"
                className="h-7 max-w-[210px] border-0 bg-transparent px-0 text-base font-black shadow-none focus-visible:ring-0 sm:max-w-sm"
              />
            </div>
            <Badge variant="secondary" className="hidden border border-orange-100 bg-orange-50 text-[10px] text-primary sm:inline-flex">{currentTemplate.name}</Badge>
            {isDirty ? <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">À enregistrer</Badge> : <span className="hidden items-center gap-1 text-xs font-semibold text-emerald-700 sm:flex"><Check className="h-3.5 w-3.5" />Enregistré</span>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={downloadPdf} disabled={isExporting} variant="outline" className="rounded-xl border-border/80 bg-background px-3 sm:px-4">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}<span className="ml-2 hidden sm:inline">Télécharger PDF</span>
            </Button>
            <Button onClick={save} disabled={isSaving} className="rounded-xl px-3 shadow-sm sm:px-4">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Enregistrer</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 pt-5 sm:px-6 lg:grid-cols-[220px_minmax(360px,0.9fr)_minmax(500px,1.1fr)]">
        <aside className="rounded-2xl border border-border/70 bg-card p-2 shadow-sm lg:sticky lg:top-[77px] lg:h-fit">
          <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Votre document</p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Sections du CV">
            {sectionItems.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    activeSection === section.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <Card className="overflow-hidden border-border/70 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">Modification guidée</p>
                <p className="text-xs text-muted-foreground">Modifiez les informations, sans déplacer ni casser la mise en page.</p>
              </div>
              <Button variant="outline" className="w-full justify-between rounded-xl sm:w-auto" onClick={() => setIsTemplatePickerOpen((value) => !value)}>
                <span className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-primary" />{currentTemplate.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {isTemplatePickerOpen && (
              <div className="grid grid-cols-2 gap-2 border-b border-border/60 bg-muted/20 p-3 sm:grid-cols-3">
                {templateCatalog.map((item) => {
                  const permitted = plan.id !== 'gratuit' || item.plans.includes('gratuit')
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectTemplate(item.id)}
                      disabled={!permitted}
                      className={cn(
                        'rounded-xl border p-2 text-left text-xs transition-colors',
                        template === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:border-primary/50',
                        !permitted && 'cursor-not-allowed opacity-45',
                      )}
                    >
                      <span className="block font-bold">{item.name}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{item.category}{!permitted ? ' · Pro' : ''}</span>
                    </button>
                  )
                })}
              </div>
            )}

            <CardContent className="p-5 sm:p-6">
              {activeSection === 'identity' && (
                <div className="space-y-6">
                  <EditorTitle icon={UserRound} title="Profil" description="Vos coordonnées et votre présentation apparaissent dans le modèle choisi." />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Prénom"><Input className={editorFieldClass()} value={data.informations_personnelles.prenom} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, prenom: event.target.value } }))} /></FormField>
                    <FormField label="Nom"><Input className={editorFieldClass()} value={data.informations_personnelles.nom} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, nom: event.target.value } }))} /></FormField>
                    <FormField label="E-mail"><Input type="email" className={editorFieldClass()} value={data.informations_personnelles.email} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, email: event.target.value } }))} /></FormField>
                    <FormField label="Téléphone"><Input className={editorFieldClass()} value={data.informations_personnelles.telephone} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, telephone: event.target.value } }))} /></FormField>
                    <FormField label="Ville / adresse"><Input className={editorFieldClass()} value={data.informations_personnelles.adresse} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, adresse: event.target.value } }))} /></FormField>
                    <FormField label="Profil LinkedIn"><Input className={editorFieldClass()} value={data.informations_personnelles.linkedin || ''} onChange={(event) => updateData((previous) => ({ ...previous, informations_personnelles: { ...previous.informations_personnelles, linkedin: event.target.value } }))} placeholder="linkedin.com/in/votre-profil" /></FormField>
                  </div>
                  <FormField label="Titre professionnel"><Input className={editorFieldClass()} value={data.titre_professionnel} onChange={(event) => updateData((previous) => ({ ...previous, titre_professionnel: event.target.value }))} placeholder="Ex. Chargé de projet digital" /></FormField>
                  <FormField label="Résumé professionnel"><Textarea value={data.resume || ''} onChange={(event) => updateData((previous) => ({ ...previous, resume: event.target.value }))} className="min-h-32 resize-y border-border/80 shadow-none focus-visible:ring-primary/25" placeholder="Présentez en quelques lignes votre expérience, vos forces et votre objectif." /></FormField>
                </div>
              )}

              {activeSection === 'experience' && (
                <div className="space-y-5">
                  <EditorTitle icon={BriefcaseBusiness} title="Expériences professionnelles" description="Ajoutez les postes les plus pertinents, du plus récent au plus ancien." />
                  {data.experiences.map((experience, index) => (
                    <div key={experience.id} className="rounded-2xl border border-border/70 bg-muted/15 p-4">
                      <div className="mb-4 flex items-center justify-between"><Badge variant="secondary">Expérience {index + 1}</Badge><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label="Supprimer cette expérience" onClick={() => updateData((previous) => ({ ...previous, experiences: previous.experiences.filter((item) => item.id !== experience.id) }))}><Trash2 className="h-4 w-4" /></Button></div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Poste"><Input className={editorFieldClass()} value={experience.poste} onChange={(event) => replaceExperience(experience.id, { poste: event.target.value })} /></FormField>
                        <FormField label="Entreprise"><Input className={editorFieldClass()} value={experience.entreprise} onChange={(event) => replaceExperience(experience.id, { entreprise: event.target.value })} /></FormField>
                        <FormField label="Ville"><Input className={editorFieldClass()} value={experience.ville} onChange={(event) => replaceExperience(experience.id, { ville: event.target.value })} /></FormField>
                        <FormField label="Pays"><Input className={editorFieldClass()} value={experience.pays} onChange={(event) => replaceExperience(experience.id, { pays: event.target.value })} /></FormField>
                        <FormField label="Début"><Input type="month" className={editorFieldClass()} value={experience.date_debut} onChange={(event) => replaceExperience(experience.id, { date_debut: event.target.value })} /></FormField>
                        <FormField label="Fin"><Input type="month" className={editorFieldClass()} disabled={experience.en_cours} value={experience.date_fin} onChange={(event) => replaceExperience(experience.id, { date_fin: event.target.value })} /></FormField>
                      </div>
                      <label className="mt-3 flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={experience.en_cours} onChange={(event) => replaceExperience(experience.id, { en_cours: event.target.checked, date_fin: event.target.checked ? '' : experience.date_fin })} className="h-4 w-4 accent-primary" />Poste actuel</label>
                      <FormField label="Description et réalisations" className="mt-3"><Textarea value={experience.description} onChange={(event) => replaceExperience(experience.id, { description: event.target.value, realisations: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} className="min-h-24 border-border/80 shadow-none focus-visible:ring-primary/25" placeholder="Une idée par ligne : responsabilités, actions et résultats obtenus." /></FormField>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => updateData((previous) => ({ ...previous, experiences: [...previous.experiences, { id: createId('exp'), poste: '', entreprise: '', ville: '', pays: '', date_debut: '', date_fin: '', en_cours: false, description: '', realisations: [] }] }))}><Plus className="mr-2 h-4 w-4" />Ajouter une expérience</Button>
                </div>
              )}

              {activeSection === 'education' && (
                <div className="space-y-5">
                  <EditorTitle icon={GraduationCap} title="Formations" description="Indiquez vos diplômes, écoles et périodes de formation." />
                  {data.formations.map((formation, index) => (
                    <div key={formation.id} className="rounded-2xl border border-border/70 bg-muted/15 p-4">
                      <div className="mb-4 flex items-center justify-between"><Badge variant="secondary">Formation {index + 1}</Badge><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label="Supprimer cette formation" onClick={() => updateData((previous) => ({ ...previous, formations: previous.formations.filter((item) => item.id !== formation.id) }))}><Trash2 className="h-4 w-4" /></Button></div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Diplôme"><Input className={editorFieldClass()} value={formation.diplome} onChange={(event) => replaceFormation(formation.id, { diplome: event.target.value })} /></FormField>
                        <FormField label="Établissement"><Input className={editorFieldClass()} value={formation.etablissement} onChange={(event) => replaceFormation(formation.id, { etablissement: event.target.value })} /></FormField>
                        <FormField label="Ville"><Input className={editorFieldClass()} value={formation.ville} onChange={(event) => replaceFormation(formation.id, { ville: event.target.value })} /></FormField>
                        <FormField label="Pays"><Input className={editorFieldClass()} value={formation.pays} onChange={(event) => replaceFormation(formation.id, { pays: event.target.value })} /></FormField>
                        <FormField label="Début"><Input type="month" className={editorFieldClass()} value={formation.date_debut} onChange={(event) => replaceFormation(formation.id, { date_debut: event.target.value })} /></FormField>
                        <FormField label="Fin"><Input type="month" className={editorFieldClass()} disabled={formation.en_cours} value={formation.date_fin} onChange={(event) => replaceFormation(formation.id, { date_fin: event.target.value })} /></FormField>
                      </div>
                      <label className="mt-3 flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={formation.en_cours} onChange={(event) => replaceFormation(formation.id, { en_cours: event.target.checked, date_fin: event.target.checked ? '' : formation.date_fin })} className="h-4 w-4 accent-primary" />Formation en cours</label>
                      <FormField label="Précision facultative" className="mt-3"><Textarea value={formation.description || ''} onChange={(event) => replaceFormation(formation.id, { description: event.target.value })} className="min-h-20 border-border/80 shadow-none focus-visible:ring-primary/25" /></FormField>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => updateData((previous) => ({ ...previous, formations: [...previous.formations, { id: createId('edu'), diplome: '', etablissement: '', ville: '', pays: '', date_debut: '', date_fin: '', en_cours: false, description: '' }] }))}><Plus className="mr-2 h-4 w-4" />Ajouter une formation</Button>
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="space-y-5">
                  <EditorTitle icon={Sparkles} title="Compétences" description="Conservez les compétences réellement utiles au poste recherché." />
                  <div className="space-y-3">
                    {data.competences.map((skill) => (
                      <div key={skill.id} className="grid grid-cols-[1fr_132px_36px] items-end gap-2 rounded-xl border border-border/70 bg-muted/15 p-3">
                        <FormField label="Compétence"><Input className={editorFieldClass()} value={skill.nom} onChange={(event) => replaceCompetence(skill.id, { nom: event.target.value })} /></FormField>
                        <FormField label="Niveau"><select className="h-10 w-full rounded-md border border-border/80 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25" value={skill.niveau} onChange={(event) => replaceCompetence(skill.id, { niveau: event.target.value as Competence['niveau'] })}><option value="debutant">Débutant</option><option value="intermediaire">Intermédiaire</option><option value="avance">Avancé</option><option value="expert">Expert</option></select></FormField>
                        <Button variant="ghost" size="icon" className="h-10 w-9 text-destructive hover:text-destructive" aria-label="Supprimer cette compétence" onClick={() => updateData((previous) => ({ ...previous, competences: previous.competences.filter((item) => item.id !== skill.id) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => updateData((previous) => ({ ...previous, competences: [...previous.competences, { id: createId('skill'), nom: '', niveau: 'intermediaire', categorie: 'technique' }] }))}><Plus className="mr-2 h-4 w-4" />Ajouter une compétence</Button>
                </div>
              )}

              {activeSection === 'languages' && (
                <div className="space-y-5">
                  <EditorTitle icon={Languages} title="Langues" description="Présentez les langues que vous maîtrisez avec un niveau juste." />
                  <div className="space-y-3">
                    {data.langues.map((language) => (
                      <div key={language.id} className="grid grid-cols-[1fr_132px_36px] items-end gap-2 rounded-xl border border-border/70 bg-muted/15 p-3">
                        <FormField label="Langue"><Input className={editorFieldClass()} value={language.nom} onChange={(event) => replaceLanguage(language.id, { nom: event.target.value })} /></FormField>
                        <FormField label="Niveau"><select className="h-10 w-full rounded-md border border-border/80 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25" value={language.niveau} onChange={(event) => replaceLanguage(language.id, { niveau: event.target.value as Langue['niveau'] })}><option value="debutant">Débutant</option><option value="intermediaire">Intermédiaire</option><option value="courant">Courant</option><option value="bilingue">Bilingue</option><option value="natif">Natif</option></select></FormField>
                        <Button variant="ghost" size="icon" className="h-10 w-9 text-destructive hover:text-destructive" aria-label="Supprimer cette langue" onClick={() => updateData((previous) => ({ ...previous, langues: previous.langues.filter((item) => item.id !== language.id) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => updateData((previous) => ({ ...previous, langues: [...previous.langues, { id: createId('lang'), nom: '', niveau: 'courant' }] }))}><Plus className="mr-2 h-4 w-4" />Ajouter une langue</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="min-w-0 lg:sticky lg:top-[77px] lg:h-[calc(100vh-97px)]">
          <Card className="flex h-full min-h-[560px] flex-col overflow-hidden border-border/70 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><div><p className="text-sm font-bold">Aperçu fidèle</p><p className="text-[11px] text-muted-foreground">Même modèle à l’écran et en PDF</p></div></div>
              <Badge variant="secondary" className="text-[10px]">A4</Badge>
            </div>
            <div className="flex-1 overflow-auto bg-slate-200/60 p-4 dark:bg-slate-950/70">
              <div className="mx-auto h-[562px] w-[397px] overflow-hidden bg-white shadow-2xl sm:h-[675px] sm:w-[477px]">
                <div style={{ width: 794, minHeight: 1123, transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                  {renderCvTemplate(template, { data, showWatermark: plan.limites.filigrane })}
                </div>
              </div>
            </div>
            <div className="border-t border-border/60 bg-card px-4 py-3 text-center text-xs text-muted-foreground"><Check className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />Le modèle choisi reste appliqué. Changez-le seulement si vous le décidez.</div>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function EditorTitle({ icon: Icon, title, description }: { icon: typeof UserRound; title: string; description: string }) {
  return <div className="flex gap-3"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div><div><h1 className="text-lg font-bold">{title}</h1><p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p></div></div>
}

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</Label>{children}</div>
}
