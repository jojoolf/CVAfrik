'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotificationsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[notifications/page]', error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><AlertTriangle className="h-6 w-6" /></span>
        <h1 className="mt-5 text-xl font-black text-foreground">Les notifications sont temporairement indisponibles</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Réessayez dans quelques instants. Vos notifications ne sont pas perdues.</p>
        <Button onClick={reset} className="mt-6 rounded-xl"><RotateCcw className="mr-2 h-4 w-4" />Réessayer</Button>
      </section>
    </main>
  )
}
