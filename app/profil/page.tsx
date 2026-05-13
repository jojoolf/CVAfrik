import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Mon profil',
  description: 'Consultez les informations de votre compte CVAfrik.',
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion?redirect=/profil')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  const displayName =
    [profile?.prenom, profile?.nom].filter(Boolean).join(' ').trim() ||
    user.email ||
    'Utilisateur'

  const planId = profile?.plan ?? 'gratuit'
  const planLabel = PLANS.find((p) => p.id === planId)?.nom ?? planId

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto max-w-2xl px-4 py-10 md:py-14">
          <div className="mb-8">
            <p className="text-sm font-medium text-primary">Compte</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Mon profil</h1>
            <p className="mt-2 text-muted-foreground">
              Informations liees a votre compte et a votre abonnement.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Identite</CardTitle>
              <CardDescription>Donnees enregistrees sur votre profil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-1">
                <span className="text-muted-foreground">Nom affiche</span>
                <span className="font-medium text-foreground">{displayName}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{user.email ?? '—'}</span>
              </div>
              {profile?.telephone ? (
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Telephone</span>
                  <span className="font-medium text-foreground">{profile.telephone}</span>
                </div>
              ) : null}
              {profile?.pays ? (
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Pays</span>
                  <span className="font-medium text-foreground">{profile.pays}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
              <CardDescription>Plan actuel sur CVAfrik.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm font-normal">
                {planLabel}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tarifs">Voir les tarifs</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cv-builder">Creer un CV</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
