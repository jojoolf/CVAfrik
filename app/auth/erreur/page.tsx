import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Erreur d\'authentification',
  description: 'Une erreur est survenue lors de l\'authentification.',
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Erreur d&apos;authentification</CardTitle>
          <CardDescription>
            Une erreur est survenue lors de la connexion. Veuillez reessayer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p>
              Cela peut etre du a un lien expire ou a un probleme technique. 
              Si le probleme persiste, contactez notre support.
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
