import { 
  FileText, 
  Sparkles, 
  Download, 
  Smartphone, 
  Globe, 
  Shield,
  Zap,
  Target
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Templates professionnels',
    description: 'Choisissez parmi 100+ templates modernes et adaptes au marche africain. Design elegant et structure claire.',
  },
  {
    icon: Sparkles,
    title: 'Conseils IA personnalises',
    description: 'Notre IA analyse votre CV et vous donne des conseils personnalises pour maximiser votre impact.',
  },
  {
    icon: Download,
    title: 'Export PDF haute qualite',
    description: 'Telecharger votre CV en PDF pret a imprimer ou a envoyer par email aux recruteurs.',
  },
  {
    icon: Smartphone,
    title: 'Paiement Mobile Money',
    description: 'Payez facilement avec Orange Money, Wave, MTN, Moov ou Flooz. Pas besoin de carte bancaire.',
  },
  {
    icon: Globe,
    title: 'Adapte a l\'Afrique de l\'Ouest',
    description: 'Contenus et exemples adaptes aux realites du marche de l\'emploi en Afrique francophone.',
  },
  {
    icon: Shield,
    title: 'Donnees securisees',
    description: 'Vos informations personnelles sont protegees et ne sont jamais partagees avec des tiers.',
  },
  {
    icon: Zap,
    title: 'Creation rapide',
    description: 'Creez votre CV en moins de 10 minutes grace a notre formulaire intelligent et intuitif.',
  },
  {
    icon: Target,
    title: 'Adaptation aux offres',
    description: 'Adaptez automatiquement votre CV a chaque offre d\'emploi pour maximiser vos chances.',
  },
]

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tout ce qu&apos;il vous faut pour
            <span className="text-primary"> decrocher l&apos;emploi</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            CVAfrik combine des outils puissants et une experience utilisateur simple 
            pour vous aider a creer le CV parfait.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute -right-1 -top-1 h-20 w-20 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
