'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isLinkedinLoading, setIsLinkedinLoading] = useState(false)
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    acceptTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            nom: formData.nom,
            prenom: formData.prenom,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Un compte existe deja avec cet email')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Compte cree avec succes! Verifiez votre email pour confirmer.')
      router.push('/auth/verification-email')
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkedinSignup = async () => {
    setIsLinkedinLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLinkedinLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prenom</Label>
            <Input
              id="prenom"
              name="prenom"
              placeholder="Votre prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              name="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Au moins 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
            }
            disabled={isLoading}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-tight text-muted-foreground">
            J&apos;accepte les{' '}
            <Link href="/legal/conditions" className="text-primary hover:underline">
              conditions d&apos;utilisation
            </Link>{' '}
            et la{' '}
            <Link href="/legal/confidentialite" className="text-primary hover:underline">
              politique de confidentialite
            </Link>
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creation en cours...
            </>
          ) : (
            'Creer mon compte'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Google
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleLinkedinSignup}
        disabled={isLinkedinLoading}
      >
        {isLinkedinLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )}
        LinkedIn
      </Button>
    </div>
  )
}
