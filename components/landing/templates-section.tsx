'use client'

import { motion } from 'framer-motion'

const templates = [
  { name: 'Classique', tag: 'Intemporel', gradient: 'from-amber-500/40 to-orange-700/40' },
  { name: 'Moderne', tag: 'Contemporain', gradient: 'from-emerald-500/40 to-teal-700/40' },
  { name: 'Créatif', tag: 'Artistique', gradient: 'from-rose-500/40 to-fuchsia-700/40' },
  { name: 'Exécutif', tag: 'Élégant', gradient: 'from-yellow-500/40 to-amber-700/40' },
  { name: 'Tech', tag: 'Développeur', gradient: 'from-sky-500/40 to-indigo-700/40' },
  { name: 'Minimal', tag: 'Essentiel', gradient: 'from-stone-400/40 to-stone-700/40' },
]

function MockCV({ gradient }: { gradient: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-elevated">
      <div className={`h-1/3 bg-gradient-to-br ${gradient}`}>
        <div className="flex items-center gap-3 p-5">
          <div className="h-12 w-12 rounded-full bg-white/90" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-white/90" />
            <div className="h-2 w-1/2 rounded bg-white/70" />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-1.5">
          <div className="h-2 w-1/3 rounded bg-stone-800" />
          <div className="h-1.5 w-full rounded bg-stone-200" />
          <div className="h-1.5 w-11/12 rounded bg-stone-200" />
          <div className="h-1.5 w-9/12 rounded bg-stone-200" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-1/4 rounded bg-stone-800" />
          <div className="h-1.5 w-full rounded bg-stone-200" />
          <div className="h-1.5 w-10/12 rounded bg-stone-200" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-12 rounded-full bg-stone-100" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TemplatesSection() {
  return (
    <section id="templates" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
              Templates
            </div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Des designs <span className="text-gradient-gold">qui marquent.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Inspirés des plus grandes villes africaines. Chaque template est
              testé sur les ATS des plus grands recruteurs du continent.
            </p>
          </div>
          <a
            href="/templates"
            className="glass rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Voir les 100+ templates →
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {templates.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -8, rotateZ: -1 }}
              className="group cursor-pointer"
            >
              <MockCV gradient={t.gradient} />
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="font-display text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.tag}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
