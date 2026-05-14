import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    content: 'Grace a CVAfrik, j\'ai pu creer un CV professionnel en quelques minutes. Le paiement par Orange Money m\'a facilite la vie. J\'ai decroche un entretien une semaine apres!',
    author: 'Aminata Diallo',
    role: 'Comptable',
    location: 'Dakar, Senegal',
    rating: 5,
  },
  {
    id: 2,
    content: 'Les conseils de l\'IA m\'ont aide a ameliorer mon CV. Mon score est passe de 65% a 92%. Je recommande vivement CVAfrik a tous les jeunes diplomes.',
    author: 'Kouadio Yao',
    role: 'Ingenieur informatique',
    location: 'Abidjan, Cote d\'Ivoire',
    rating: 5,
  },
  {
    id: 3,
    content: 'J\'ai essaye plusieurs sites de CV mais aucun n\'etait adapte a notre contexte. CVAfrik comprend vraiment les besoins des candidats africains.',
    author: 'Fatoumata Traore',
    role: 'Responsable RH',
    location: 'Bamako, Mali',
    rating: 5,
  },
  {
    id: 4,
    content: 'Le template Executif m\'a permis de postuler a des postes de direction. L\'export PDF est impeccable et professionnel.',
    author: 'Emmanuel Mensah',
    role: 'Directeur commercial',
    location: 'Lome, Togo',
    rating: 5,
  },
  {
    id: 5,
    content: 'La simulation d\'entretien avec l\'IA m\'a vraiment prepare pour mon entretien. J\'ai pu anticiper les questions et repondre avec confiance.',
    author: 'Mariam Ouedraogo',
    role: 'Marketing Manager',
    location: 'Ouagadougou, Burkina Faso',
    rating: 5,
  },
  {
    id: 6,
    content: 'Simple, efficace et pas cher. Le plan Pro a 1200 FCFA est vraiment abordable. J\'ai cree 5 versions de mon CV pour differents postes.',
    author: 'Ibrahima Sow',
    role: 'Developpeur web',
    location: 'Conakry, Guinee',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ils ont trouve leur
            <span className="text-primary"> emploi de reve</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Plus de 10 000 utilisateurs en Afrique nous font confiance 
            pour creer leur CV professionnel.
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild className="rounded-full font-bold">
              <Link href="/avis">Donner mon avis</Link>
            </Button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />

                {/* Rating */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-8 rounded-2xl bg-card p-8 shadow-lg ring-1 ring-border md:grid-cols-4">
          {[
            { value: '10 000+', label: 'CV crees' },
            { value: '8', label: 'Pays couverts' },
            { value: '4.9/5', label: 'Note moyenne' },
            { value: '85%', label: 'Taux de succes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
