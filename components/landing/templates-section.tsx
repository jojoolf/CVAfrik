'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import { templateCatalog } from '@/components/cv-builder/templates/cv-preview-collection'

export function TemplatesSection() {
  const showcaseTemplates = templateCatalog.slice(0, 6)

  return (
    <section id="templates" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,.10),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(37,99,235,.10),transparent_26%)]" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"><Sparkles className="h-3.5 w-3.5" /> Templates</div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Des designs qui <span className="text-gradient-gold">marquent.</span></h2>
            <p className="mt-4 text-lg text-muted-foreground">Choisis un modèle qui révèle ton parcours. Les styles Pro donnent encore plus d’impact à ton profil.</p>
          </div>
          <Link href="/templates" className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/50 px-5 py-3 text-sm font-bold transition hover:border-primary/50 hover:text-primary">Voir les 15 templates <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {showcaseTemplates.map((template) => (
            <Link key={template.id} href={`/templates#${template.id}`} className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image src={template.previewImage} alt={`Aperçu ${template.name}`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                {template.category === 'Pro' && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[9px] font-black uppercase text-primary-foreground"><Lock className="h-2.5 w-2.5" /> Pro</span>}
              </div>
              <div className="p-3"><p className="text-sm font-bold text-foreground">{template.name}</p><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{template.description}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
