'use client'

import { motion } from 'framer-motion'

<<<<<<< HEAD
const templates = [
  { name: 'Dakar', tag: 'Moderne', gradient: 'from-amber-500/40 to-orange-700/40' },
  { name: 'Lagos', tag: 'Tech', gradient: 'from-emerald-500/40 to-teal-700/40' },
  { name: 'Abidjan', tag: 'Créatif', gradient: 'from-rose-500/40 to-fuchsia-700/40' },
  { name: 'Nairobi', tag: 'Corporate', gradient: 'from-sky-500/40 to-indigo-700/40' },
  { name: 'Casablanca', tag: 'Élégant', gradient: 'from-yellow-500/40 to-amber-700/40' },
  { name: 'Kigali', tag: 'Minimal', gradient: 'from-stone-400/40 to-stone-700/40' },
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
=======
type TemplatePlan = 'gratuit' | 'pro' | 'premium'

interface TemplateCard {
  id: string
  name: string
  description: string
  plan: TemplatePlan
  colors: {
    primary: string
    secondary: string
  }
}

const templates: TemplateCard[] = [
  {
    id: 'classique',
    name: 'Classique',
    description: 'Un design intemporel et professionnel',
    plan: 'gratuit',
    colors: { primary: 'bg-slate-800', secondary: 'bg-slate-200' },
  },
  {
    id: 'moderne',
    name: 'Moderne',
    description: 'Design contemporain avec touches de couleur',
    plan: 'gratuit',
    colors: { primary: 'bg-primary', secondary: 'bg-primary/20' },
  },
  {
    id: 'creatif',
    name: 'Creatif',
    description: 'Pour les profils artistiques et marketing',
    plan: 'pro',
    colors: { primary: 'bg-purple-600', secondary: 'bg-purple-100' },
  },
  {
    id: 'executif',
    name: 'Executif',
    description: 'Sobre et elegant pour les cadres',
    plan: 'pro',
    colors: { primary: 'bg-gray-900', secondary: 'bg-gray-100' },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Ideal pour les developpeurs et ingenieurs',
    plan: 'pro',
    colors: { primary: 'bg-emerald-600', secondary: 'bg-emerald-100' },
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste',
    description: 'L\'essentiel, rien de plus',
    plan: 'pro',
    colors: { primary: 'bg-gray-700', secondary: 'bg-gray-50' },
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Dynamique et moderne',
    plan: 'premium',
    colors: { primary: 'bg-orange-500', secondary: 'bg-orange-100' },
  },
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Raffinement et elegance',
    plan: 'premium',
    colors: { primary: 'bg-amber-700', secondary: 'bg-amber-50' },
  },
]

const planColors: Record<TemplatePlan, string> = {
  gratuit: 'bg-muted text-muted-foreground',
  pro: 'bg-primary/10 text-primary',
  premium: 'bg-accent/10 text-accent',
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218
}

export function TemplatesSection() {
  return (
<<<<<<< HEAD
    <section id="templates" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="glass mb-6 inline-flex rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
              Templates
=======
    <section id="templates" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Des templates pour
            <span className="text-primary"> chaque profil</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Plus de 100 designs professionnels pour mettre en valeur votre parcours.
            Du classique au creatif, trouvez le style qui vous correspond.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template Preview */}
              <div className="aspect-[8.5/11] p-4">
                <div className="h-full rounded-lg bg-white p-3 shadow-inner">
                  {/* Header */}
                  <div className="flex items-start gap-2 border-b border-gray-100 pb-2">
                    <div className={cn('h-8 w-8 rounded-full', template.colors.primary)} />
                    <div className="flex-1 space-y-1">
                      <div className={cn('h-2 w-16 rounded', template.colors.primary)} />
                      <div className="h-1.5 w-12 rounded bg-gray-300" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="mt-2 space-y-2">
                    <div className={cn('h-1.5 w-8 rounded', template.colors.secondary)} />
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-5/6 rounded bg-gray-200" />
                      <div className="h-1 w-4/6 rounded bg-gray-200" />
                    </div>
                    <div className={cn('h-1.5 w-10 rounded', template.colors.secondary)} />
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-3/4 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="border-t border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  <Badge variant="secondary" className={cn('text-xs', planColors[template.plan])}>
                    {template.plan === 'gratuit' ? 'Gratuit' : template.plan === 'pro' ? 'Pro' : 'Premium'}
                  </Badge>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={cn(
                'absolute inset-0 flex items-center justify-center bg-foreground/80 transition-opacity',
                hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
              )}>
                <Button asChild>
                  <Link href={`/cv-builder?template=${template.id}`}>
                    Utiliser ce template
                    {template.plan !== 'gratuit' && <Lock className="ml-2 h-3 w-3" />}
                  </Link>
                </Button>
              </div>
>>>>>>> ef2d9f0a052998b20d8c6cd7d437ecf368379218
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
