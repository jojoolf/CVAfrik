import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Conditions d’utilisation | CVAfrik',
  description: 'Conditions d’utilisation de CVAfrik',
}

export default async function TermsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-5 rounded-xl px-2 text-muted-foreground"><Link href={user ? '/profil' : '/'}><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link></Button>
        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><FileText className="h-4 w-4" /> CVAfrik</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">Conditions d’utilisation</h1>
          <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : 24 août 2026</p>
          <div className="mt-8 space-y-7 text-sm leading-7 text-muted-foreground">
            <section><h2 className="text-base font-bold text-foreground">Objet du service</h2><p className="mt-2">CVAfrik fournit des outils de création de CV, de lettres de motivation, de préparation aux entretiens, de suivi de candidatures et d’accès à des opportunités professionnelles.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Compte utilisateur</h2><p className="mt-2">Vous êtes responsable des informations renseignées dans votre compte et de la confidentialité de votre accès. Les contenus déposés doivent respecter les lois applicables et les droits de tiers.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Offres et abonnements</h2><p className="mt-2">Les fonctionnalités accessibles dépendent du plan actif. Les montants, durées et moyens de paiement affichés lors de la souscription constituent les informations applicables à votre achat.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Utilisation responsable</h2><p className="mt-2">CVAfrik accompagne votre démarche professionnelle mais ne garantit pas l’obtention d’un entretien, d’une offre ou d’un emploi. Les opportunités publiées doivent être vérifiées par l’utilisateur avant toute candidature.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Contact</h2><p className="mt-2">Pour toute question liée à l’utilisation de CVAfrik, contactez <a className="font-semibold text-primary hover:underline" href="mailto:cvafrik@gmail.com">cvafrik@gmail.com</a>.</p></section>
          </div>
        </article>
      </main>
    </div>
  )
}
