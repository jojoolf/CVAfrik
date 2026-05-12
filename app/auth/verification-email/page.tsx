import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Verification de l\'email',
  description: 'Verifiez votre adresse email pour activer votre compte CVAfrik.',
}

export default function VerificationEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verifiez votre email</CardTitle>
          <CardDescription>
            Nous vous avons envoye un email de confirmation. Cliquez sur le lien 
            dans l&apos;email pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p>
              Si vous ne voyez pas l&apos;email, verifiez votre dossier spam ou 
              courrier indesirable.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/connexion">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour a la connexion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
