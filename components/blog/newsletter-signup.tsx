'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim() })

    if (insertError) {
      if (insertError.code === '23505') {
        setDone(true)
      } else {
        setError('Une erreur est survenue. Réessayez plus tard.')
      }
    } else {
      setDone(true)
    }

    setLoading(false)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="text-lg font-semibold text-foreground">Merci pour votre inscription !</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous recevrez nos prochains articles directement dans votre boîte mail.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl text-center">
      <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
        Restez informé
      </Badge>
      <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
        Ne manquez aucun article
      </h2>
      <p className="mt-3 text-muted-foreground">
        Recevez chaque semaine nos derniers conseils carrière et offres d&apos;emploi directement dans votre boîte mail.
      </p>
      <div className="mt-6 flex max-w-md mx-auto gap-3">
        <Input
          type="email"
          required
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl bg-background"
          disabled={loading}
        />
        <Button type="submit" className="h-11 rounded-xl shrink-0" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Inscription...' : "S'abonner"}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </form>
  )
}
