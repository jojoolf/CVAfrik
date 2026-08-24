import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Confidentialité | CVAfrik',
  description: 'Politique de confidentialité CVAfrik',
}

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-5 rounded-xl px-2 text-muted-foreground"><Link href={user ? '/profil' : '/'}><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link></Button>
        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="h-4 w-4" /> CVAfrik</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : 24 août 2026</p>
          <div className="mt-8 space-y-7 text-sm leading-7 text-muted-foreground">
            <section><h2 className="text-base font-bold text-foreground">Données traitées</h2><p className="mt-2">CVAfrik traite les informations nécessaires à votre compte, à la création de vos CV et lettres, au suivi des candidatures, aux paiements, ainsi qu’aux préférences de notification que vous choisissez d’activer.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Vos documents et votre profil</h2><p className="mt-2">Vos CV, lettres, photos de profil et candidatures restent associés à votre compte. Les images de couverture publiées depuis l’administration sont visibles publiquement lorsqu’elles accompagnent un contenu public.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Notifications et activité</h2><p className="mt-2">Si vous activez les notifications, CVAfrik peut enregistrer un identifiant de notification de votre appareil et vos préférences. Les indicateurs d’activité utilisent uniquement une présence récente et un pays approximatif ; CVAfrik ne conserve pas votre adresse IP complète ni votre position précise à cette fin.</p></section>
            <section><h2 className="text-base font-bold text-foreground">Vos choix</h2><p className="mt-2">Vous pouvez modifier vos informations de profil, vos préférences de notification et demander de l’aide concernant vos données à l’adresse <a className="font-semibold text-primary hover:underline" href="mailto:cvafrik@gmail.com">cvafrik@gmail.com</a>.</p></section>
          </div>
        </article>
      </main>
    </div>
  )
}
