import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous a votre compte CVAfrik.',
}

interface PageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>
}

export default async function ConnexionPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(params.redirect || '/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              CV<span className="text-primary">Afrik</span>
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
            Bon retour parmi nous
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pas encore de compte?{' '}
            <Link href="/auth/inscription" className="font-medium text-primary hover:underline">
              Creer un compte
            </Link>
          </p>

          {params.error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {params.error === 'invalid_credentials' && 'Email ou mot de passe incorrect.'}
              {params.error === 'email_not_confirmed' && 'Veuillez confirmer votre email avant de vous connecter.'}
              {params.error === 'unknown' && 'Une erreur est survenue. Veuillez reessayer.'}
            </div>
          )}

          <LoginForm redirectTo={params.redirect} />
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-primary-foreground">
            <h3 className="text-3xl font-bold">Creez des CV qui font la difference</h3>
            <p className="mt-4 max-w-md text-lg text-primary-foreground/90">
              Plus de 10 000 utilisateurs en Afrique de l&apos;Ouest nous font confiance 
              pour creer leur CV professionnel.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8">
              {[
                { value: '10K+', label: 'CV crees' },
                { value: '8', label: 'Pays couverts' },
                { value: '4.9/5', label: 'Satisfaction' },
                { value: '85%', label: 'Taux de succes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
