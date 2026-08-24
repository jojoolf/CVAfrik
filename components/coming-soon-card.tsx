'use client'

import { useEffect, useState } from 'react'
import { Clock3, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const LAUNCH_DATE = new Date('2026-08-31T00:00:00.000Z').getTime()

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdown(): Countdown {
  const remaining = Math.max(0, LAUNCH_DATE - Date.now())
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
  }
}

export function ComingSoonCard({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  const [countdown, setCountdown] = useState<Countdown>(getCountdown)

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1_000)
    return () => window.clearInterval(interval)
  }, [])

  const isAvailable = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0

  return (
    <section className={cn('rounded-2xl border border-dashed border-primary/35 bg-primary/[0.045] p-4 shadow-sm', className)}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-primary">
            <Clock3 className="h-3 w-3" /> {isAvailable ? 'Disponible maintenant' : 'Bientôt disponible'}
          </p>
          <h3 className="mt-2 font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
          {!isAvailable && (
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                [countdown.days, 'jours'],
                [countdown.hours, 'heures'],
                [countdown.minutes, 'min'],
                [countdown.seconds, 'sec'],
              ].map(([value, label]) => (
                <div key={String(label)} className="rounded-lg border border-primary/15 bg-background/80 px-1 py-2">
                  <p className="text-base font-black tabular-nums text-primary">{String(value).padStart(2, '0')}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
