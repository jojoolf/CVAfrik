import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Erreur d\'authentification',
  description: 'Une erreur est survenue lors de l\'authentification.',
}

type AuthErrorPageProps = {
  searchParams: Promise<{
    reason?: string
    detail?: string
  }>
}

function getFriendlyError(reason?: string, detail?: string) {
  const normalized = reason?.toLowerCase() ?? ''

  if (normalized.includes('next_public_supabase_url') || normalized.includes('exchange_code_failed') || normalized.includes('verify_otp_failed')) {
    return 'La connexion a echoue a cause de la configuration Supabase ou du callback OAuth.'
  }

  if (normalized.includes('missing_code')) {
    return "Le retour OAuth n'a pas fourni de code de connexion valide."
  }

  if (normalized.includes('access_denied') || normalized.includes('oauth')) {
    return "Le fournisseur OAuth a refuse la connexion ou la redirection n'est pas autorisee."
  }

  return detail || 'Une erreur est survenue lors de la connexion.'
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const reason = params?.reason
  const detail = params?.detail
  const friendlyError = getFriendlyError(reason, detail)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Erreur d&apos;authentification</CardTitle>
          <CardDescription>
            {friendlyError}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p>
              Cela peut venir d&apos;un lien OAuth expire, d&apos;une redirection refusee ou d&apos;une configuration Vercel/Supabase incomplete.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/80">
              Si tu vois une URL Supabase invalide ou un DNS error, corrige `NEXT_PUBLIC_SUPABASE_URL` dans Vercel.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link href="/auth/connexion">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reessayer
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour a l&apos;accueil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
