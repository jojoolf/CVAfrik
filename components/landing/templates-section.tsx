'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowRight, Lock } from 'lucide-react'
import { TEMPLATE_CATALOG } from '@/lib/template-access'

const planColors = {
  gratuit: 'bg-muted text-muted-foreground',
  pro: 'bg-primary/10 text-primary',
  premium: 'bg-accent/10 text-accent',
}

export function TemplatesSection() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  return (
    <section id="templates" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Des templates pour
            <span className="text-primary"> chaque profil</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            10 designs professionnels pour mettre en valeur votre parcours.
            Du classique au creatif, trouvez le style qui vous correspond.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_CATALOG.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="aspect-[8.5/11] p-4">
                <div className="h-full rounded-lg bg-white p-3 shadow-inner">
                  <div className="flex items-start gap-2 border-b border-gray-100 pb-2">
                    <div className={cn('h-8 w-8 rounded-full', template.color)} />
                    <div className="flex-1 space-y-1">
                      <div className={cn('h-2 w-16 rounded', template.color)} />
                      <div className="h-1.5 w-12 rounded bg-gray-300" />
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className={cn('h-1.5 w-8 rounded', template.accent)} />
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-5/6 rounded bg-gray-200" />
                      <div className="h-1 w-4/6 rounded bg-gray-200" />
                    </div>
                    <div className={cn('h-1.5 w-10 rounded', template.accent)} />
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-3/4 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  <Badge variant="secondary" className={cn('text-xs', planColors[template.requiredPlan])}>
                    {template.requiredPlan === 'gratuit'
                      ? 'Gratuit'
                      : template.requiredPlan === 'pro'
                        ? 'Pro'
                        : 'Premium'}
                  </Badge>
                </div>
              </div>

              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-foreground/80 transition-opacity',
                  hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0',
                )}
              >
                <Button asChild>
                  <Link href={`/cv-builder?template=${template.id}`}>
                    Utiliser ce template
                    {template.requiredPlan !== 'gratuit' && <Lock className="ml-2 h-3 w-3" />}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/templates">
              Voir tous les templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
