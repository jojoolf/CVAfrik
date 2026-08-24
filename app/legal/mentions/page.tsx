import Link from 'next/link'
import { ArrowLeft, Scale } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Mentions légales | CVAfrik',
  description: 'Mentions légales de CVAfrik',
}

export default async function LegalNoticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-5 rounded-xl px-2 text-muted-foreground"><Link href={user ? '/profil' : '/'}><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link></Button>
        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Scale className="h-4 w-4" /> CVAfrik</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">Mentions légales</h1>
          <div className="mt-8 space-y-7 text-sm leading-7 text-muted-foreground">
            <section><h2 className="text-base font-bold text-foreground">Service</h2><p className="mt-2">CVAfrik est une plateforme numérique dédiée à la préparation professionnelle et à la création de documents de candidature pour les talents africains.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Contact</h2><p className="mt-2">Pour toute demande concernant le service, contactez <a className="font-semibold text-primary hover:underline" href="mailto:cvafrik@gmail.com">cvafrik@gmail.com</a>.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Hébergement et prestataires techniques</h2><p className="mt-2">L’application CVAfrik utilise des prestataires techniques d’hébergement, de stockage, d’authentification, de paiement et de communication électronique nécessaires à son fonctionnement.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Propriété intellectuelle</h2><p className="mt-2">Les éléments d’identité visuelle, interfaces, contenus et marques présents sur CVAfrik ne peuvent être reproduits sans autorisation, sauf pour les documents que vous créez vous-même dans votre compte.</p></section>
          </div>
        </article>
      </main>
    </div>
  )
}
