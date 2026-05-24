'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export function LiveCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    fetch('/api/stats/cv-count')
      .then(r => r.json())
      .then(d => {
        if (d.success) setCount(d.thisWeek)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (count === null) return
    const duration = 1500
    const steps = 30
    const increment = count / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= count) {
        setDisplayCount(count)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [count])

  if (count === null) return null

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
      <Users className="h-4 w-4" />
      <span>
        <strong className="text-lg tabular-nums">{displayCount}</strong>
        {' '}CV créés cette semaine
      </span>
    </div>
  )
}
