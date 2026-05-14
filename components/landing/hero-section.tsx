import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Sparkles, FileText, Star } from 'lucide-react'

const features = [
  'CV professionnels en 10 minutes',
  'Paiement Mobile Money',
  'Conseils IA personnalises',
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Sois parmi les premiers en Afrique
            </Badge>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Creez un CV qui vous
              <span className="text-primary"> ouvre des portes</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground lg:mx-0">
              La premiere plateforme de creation de CV conçue pour le marche de l&apos;emploi 
              en Afrique. Templates professionnels, conseils IA et paiement 
              Mobile Money.
            </p>

            {/* Features List */}
            <ul className="mx-auto mt-8 flex flex-col gap-3 lg:mx-0">
              {features.map((feature) => (
                <li key={feature} className="flex items-center justify-center gap-2 lg:justify-start">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/auth/inscription">
                  Creer mon CV gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/#templates">
                  Voir les templates
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-muted">
                  <img src="https://i.pravatar.cc/100?img=1" alt="Utilisateur" className="h-full w-full object-cover" />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-muted">
                  <img src="https://i.pravatar.cc/100?img=2" alt="Utilisateur" className="h-full w-full object-cover" />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-muted">
                  <img src="https://i.pravatar.cc/100?img=3" alt="Utilisateur" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                    Nouveau 🚀
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rejoignez la communaute
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image / CV Preview */}
          <div className="relative mx-auto max-w-lg lg:mx-0">
            <div className="relative rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-border">
              {/* CV Preview Card */}
              <div className="aspect-[8.5/11] overflow-hidden rounded-lg bg-white p-6 shadow-inner">
                {/* CV Header */}
                <div className="flex items-start gap-4 border-b border-gray-200 pb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-gray-800" />
                    <div className="mt-2 h-3 w-24 rounded bg-primary" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-2 w-20 rounded bg-gray-300" />
                      <div className="h-2 w-16 rounded bg-gray-300" />
                    </div>
                  </div>
                </div>

                {/* CV Content Skeleton */}
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="h-3 w-20 rounded bg-primary/60" />
                    <div className="mt-2 space-y-1">
                      <div className="h-2 w-full rounded bg-gray-200" />
                      <div className="h-2 w-5/6 rounded bg-gray-200" />
                      <div className="h-2 w-4/6 rounded bg-gray-200" />
                    </div>
                  </div>

                  <div>
                    <div className="h-3 w-24 rounded bg-primary/60" />
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="h-2 w-full rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="h-2 w-5/6 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="h-3 w-20 rounded bg-primary/60" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-5 w-16 rounded-full bg-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -right-4 -top-4 rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Score CV</p>
                    <p className="text-lg font-bold text-green-600">92%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Template</p>
                    <p className="text-sm font-semibold text-primary">Moderne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
