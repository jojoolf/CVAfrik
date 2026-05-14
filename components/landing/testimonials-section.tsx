"use client";

import { Star, Quote, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function TestimonialsSection() {
  const [realReviews, setRealReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .eq('statut', 'approuve')
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (!error && data) {
        setRealReviews(data)
      }
      setLoading(false)
    }
    fetchReviews()
  }, [])

  const staticTestimonials = [
    {
      id: 's1',
      commentaire: 'Grace a CVAfrik, j\'ai pu creer un CV professionnel en quelques minutes. Le paiement par Orange Money m\'a facilite la vie. J\'ai decroche un entretien une semaine apres!',
      nom: 'Aminata Diallo',
      note: 5,
    },
    {
      id: 's2',
      commentaire: 'Les conseils de l\'IA m\'ont aide a ameliorer mon CV. Mon score est passe de 65% a 92%. Je recommande vivement CVAfrik a tous les jeunes diplomes.',
      nom: 'Kouadio Yao',
      note: 5,
    },
    {
      id: 's3',
      commentaire: 'J\'ai essaye plusieurs sites de CV mais aucun n\'etait adapte a notre contexte. CVAfrik comprend vraiment les besoins des candidats africains.',
      nom: 'Fatoumata Traore',
      note: 5,
    },
  ]

  const displayReviews = realReviews.length > 0 ? [...realReviews, ...staticTestimonials].slice(0, 6) : staticTestimonials

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
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            displayReviews.map((testimonial) => (
              <Card key={testimonial.id} className="relative overflow-hidden border-none shadow-xl shadow-slate-200/50">
                <CardContent className="pt-6">
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/5" />
                  
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: testimonial.note }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-600 italic leading-relaxed mb-6">
                    &ldquo;{testimonial.commentaire || testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs uppercase">
                      {testimonial.nom?.substring(0, 2) || 'CV'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{testimonial.nom || testimonial.author}</p>
                      <p className="text-xs text-slate-400">Utilisateur verifie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-8 rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 md:grid-cols-4">
          {[
            { value: '10 000+', label: 'CV crees' },
            { value: 'Africa', label: 'Couverture' },
            { value: '4.9/5', label: 'Note moyenne' },
            { value: '85%', label: 'Taux de succes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              <p className="mt-2 text-xs font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
