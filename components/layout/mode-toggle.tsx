'use client'

import * as React from 'react'
import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl border border-border/70 bg-card/70 text-foreground shadow-soft transition hover:border-primary/45 hover:bg-accent hover:text-primary" aria-label="Changer le thème">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/80 bg-popover p-1.5 shadow-elegant">
        <DropdownMenuLabel className="px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Apparence</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')} className={`gap-2 rounded-lg px-2.5 py-2 ${theme === 'light' ? 'bg-accent text-accent-foreground' : ''}`}><Sun className="h-4 w-4 text-primary" /> Clair</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={`gap-2 rounded-lg px-2.5 py-2 ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}><Moon className="h-4 w-4 text-primary" /> Sombre</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className={`gap-2 rounded-lg px-2.5 py-2 ${theme === 'system' ? 'bg-accent text-accent-foreground' : ''}`}><Laptop className="h-4 w-4 text-primary" /> Système</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
