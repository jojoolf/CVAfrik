import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, CheckCircle2 } from 'lucide-react'
import { SignupForm } from '@/components/auth/signup-form'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Creez votre compte CVAfrik et commencez a creer votre CV professionnel.',
}

const benefits = [
  'Premier CV gratuit',
  'Templates professionnels',
  'Conseils IA personnalises',
  'Paiement Mobile Money',
]

export default async function InscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Illustration */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-primary-foreground">
            <h3 className="text-3xl font-bold">Rejoignez la communaute CVAfrik</h3>
            <p className="mt-4 max-w-md text-lg text-primary-foreground/90">
              Plus de 10 000 professionnels en Afrique utilisent CVAfrik 
              pour creer des CV qui font la difference.
            </p>
            <ul className="mt-8 space-y-4 text-left">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            Creez votre compte
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deja un compte?{' '}
            <Link href="/auth/connexion" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>

          <SignupForm />

          {/* Mobile Benefits */}
          <div className="mt-8 lg:hidden">
            <p className="text-center text-sm text-muted-foreground">
              En creant un compte, vous beneficiez de:
            </p>
            <ul className="mt-4 space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
