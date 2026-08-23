'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Eye, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { renderCvTemplate, templateCatalog, type TemplateCatalogItem } from '@/components/cv-builder/templates/cv-preview-collection'
import type { CVDonnees } from '@/lib/types'

const previewData: CVDonnees = {
  informations_personnelles: { prenom: 'Amina', nom: 'Kouassi', email: 'amina.kouassi@email.com', telephone: '+225 07 12 34 56 78', adresse: 'Abidjan, Côte d’Ivoire', linkedin: 'linkedin.com/in/amina-kouassi' },
  titre_professionnel: 'Product & Marketing Specialist',
  resume: 'Professionnelle orientée résultats, avec une expérience en stratégie produit, marketing digital et croissance de marques ambitieuses en Afrique.',
  experiences: [
    { id: '1', poste: 'Product & Marketing Lead', entreprise: 'PayTech Africa', ville: 'Abidjan', pays: 'Côte d’Ivoire', date_debut: '2021-01', date_fin: '', en_cours: true, description: 'Pilotage de la stratégie produit et de la croissance digitale.', realisations: ['Lancement de produits à fort impact.', 'Hausse de 35% de l’adoption utilisateur.'] },
    { id: '2', poste: 'Growth Marketing Manager', entreprise: 'Innova Solutions', ville: 'Abidjan', pays: 'Côte d’Ivoire', date_debut: '2018-03', date_fin: '2020-12', en_cours: false, description: 'Conception de campagnes d’acquisition et d’activation.', realisations: ['Optimisation des performances marketing.'] },
  ],
  formations: [{ id: '1', diplome: 'Master Marketing & Stratégie', etablissement: 'Université de Cocody', ville: 'Abidjan', pays: 'Côte d’Ivoire', date_debut: '2015-10', date_fin: '2017-07', en_cours: false }],
  competences: [{ id: '1', nom: 'Stratégie produit', niveau: 'expert', categorie: 'technique' }, { id: '2', nom: 'Marketing digital', niveau: 'avance', categorie: 'technique' }, { id: '3', nom: 'Analyse de données', niveau: 'avance', categorie: 'technique' }],
  langues: [{ id: '1', nom: 'Français', niveau: 'natif' }, { id: '2', nom: 'Anglais', niveau: 'courant' }],
  certifications: [],
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState<'Tous' | 'Gratuit' | 'Pro'>('Tous')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateCatalogItem>(templateCatalog[0])

  const templates = useMemo(
    () => filter === 'Tous' ? templateCatalog : templateCatalog.filter((template) => template.category === filter),
    [filter],
  )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/12 via-card to-blue-500/10 px-6 py-12 shadow-elegant sm:px-10 lg:px-14">
            <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute -bottom-44 left-1/3 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300"><Sparkles className="h-3.5 w-3.5" /> Collection CVAfrik</div>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Des modèles qui donnent <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">envie de postuler.</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Choisis parmi 15 designs conçus pour valoriser chaque parcours. Commence gratuitement, puis débloque les styles Pro qui mettent en avant ton expertise, tes projets et ton impact.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 3 modèles gratuits</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400" /> 12 modèles Pro</span></div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black">Trouve ton style</h2><p className="mt-1 text-sm text-muted-foreground">Chaque modèle utilise les informations de ton CV automatiquement.</p></div>
            <div className="flex rounded-xl border border-border bg-card/80 p-1 shadow-soft">
              {(['Tous', 'Gratuit', 'Pro'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${filter === item ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>{item === 'Tous' ? `Tous (${templateCatalog.length})` : item === 'Gratuit' ? 'Gratuits (3)' : 'Pro (12)'}</button>)}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => {
              const isPro = template.category === 'Pro'
              const isActive = selectedTemplate.id === template.id
              return <button key={template.id} onClick={() => setSelectedTemplate(template)} className={`group overflow-hidden rounded-2xl border text-left transition duration-300 ${isActive ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/10' : 'border-border bg-card hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant'}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-muted"><Image src={template.previewImage} alt={`Template ${template.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-top transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />{isPro && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground"><Lock className="h-3 w-3" /> Pro</span>}<span className="absolute bottom-3 left-3 text-sm font-black text-white">{template.name}</span></div>
                <div className="flex items-center justify-between gap-2 p-4"><div><p className="text-sm font-bold text-foreground">{template.description}</p><p className="mt-1 text-xs text-muted-foreground">{isPro ? 'Disponible avec CVAfrik Pro' : 'Disponible gratuitement'}</p></div><Eye className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" /></div>
              </button>
            })}
          </div>

          <section className="mt-16 grid gap-8 rounded-3xl border border-border bg-card/70 p-5 shadow-elegant lg:grid-cols-[340px_minmax(0,1fr)] lg:p-8">
            <div className="flex flex-col justify-between"><div><span className="inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Aperçu dynamique</span><h2 className="mt-4 text-3xl font-black">{selectedTemplate.name}</h2><p className="mt-3 leading-6 text-muted-foreground">{selectedTemplate.description}. Lorsque tu remplis ton CV, tes coordonnées, expériences, formations, compétences et langues s’affichent dans ce design.</p></div><div className="mt-8 space-y-3"><Button asChild className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"><Link href={`/cv-builder?template=${selectedTemplate.id}`}>Utiliser ce modèle <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>{selectedTemplate.category === 'Pro' && <Button asChild variant="outline" className="w-full border-primary/35 bg-transparent text-primary hover:bg-primary/10 hover:text-primary"><Link href="/paiement/abonnement">Débloquer les modèles Pro</Link></Button>}</div></div>
            <div className="max-h-[780px] overflow-hidden rounded-xl border border-border bg-muted p-3 shadow-elegant"><div className="origin-top scale-[0.44] sm:scale-[0.55] lg:scale-[0.63]" style={{ width: 794 }}>{renderCvTemplate(selectedTemplate.id, { data: previewData, showWatermark: selectedTemplate.category === 'Gratuit' })}</div></div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  )
}
