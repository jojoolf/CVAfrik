'use client'

import { useEffect, useState, useRef } from 'react'
import { Users, TrendingUp, Sparkles } from 'lucide-react'

export function LiveCounter() {
  const [data, setData] = useState<{ thisWeek: number; total: number } | null>(null)
  const [displayWeek, setDisplayWeek] = useState(0)
  const [displayTotal, setDisplayTotal] = useState(0)
  const [pulse, setPulse] = useState(false)
  const prevWeek = useRef(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats/cv-count')
        const d = await res.json()
        if (d.success) setData(d)
      } catch {}
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!data) return
    const duration = 2000
    const steps = 40
    const incrementWeek = data.thisWeek / steps
    const incrementTotal = data.total / steps
    let current = 0
    const timer = setInterval(() => {
      current++
      if (current >= steps) {
        setDisplayWeek(data.thisWeek)
        setDisplayTotal(data.total)
        if (data.thisWeek > prevWeek.current) setPulse(true)
        prevWeek.current = data.thisWeek
        clearInterval(timer)
      } else {
        setDisplayWeek(Math.round(incrementWeek * current))
        setDisplayTotal(Math.round(incrementTotal * current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [data])

  useEffect(() => {
    if (!pulse) return
    const t = setTimeout(() => setPulse(false), 2000)
    return () => clearTimeout(t)
  }, [pulse])

  if (!data) return null

  return (
    <div className="relative group">
      {/* Glow background */}
      <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 blur-2xl transition-opacity duration-1000 ${pulse ? 'opacity-100 scale-105' : 'opacity-60'}`} />

      <div className="relative flex items-center gap-5 rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm px-7 py-5 shadow-lg shadow-primary/5">
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <Users className="h-7 w-7 text-white" />
        </div>

        {/* Numbers */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tabular-nums bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {displayWeek}
              </span>
              <span className="text-xs text-muted-foreground font-medium">/{displayTotal}</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3 text-green-500" />
              CV créés cette semaine
            </p>
          </div>

          <div className="hidden h-10 w-px bg-border sm:block" />

          <div className="hidden sm:block text-center">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tabular-nums text-foreground">
                {displayTotal}
              </span>
              <span className="text-xs text-muted-foreground font-medium">total</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3 text-primary" />
              CV dans la communauté
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
