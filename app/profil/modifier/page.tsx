import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { EditProfileForm } from './edit-profile-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Modifier mon profil',
  description: 'Mettez à jour vos informations personnelles sur CVAfrik.',
}

export default async function ModifierProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion?redirect=/profil/modifier')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto max-w-2xl px-4 py-10 md:py-14">
          <Link 
            href="/profil" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Retour au profil
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Modifier mon profil</h1>
            <p className="mt-2 text-muted-foreground">
              Mettez à jour vos coordonnées pour faciliter la création de vos CV.
            </p>
          </div>

          <EditProfileForm initialProfile={profile || {}} userId={user.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
