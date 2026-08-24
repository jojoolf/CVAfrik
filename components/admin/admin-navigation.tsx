'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, BellRing, BriefcaseBusiness, ChevronDown, FilePlus2, LayoutDashboard, Megaphone, PanelsTopLeft, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/admin/blog/nouveau', label: 'Contenu', icon: FilePlus2 },
  { href: '/admin/opportunites', label: 'Opportunités', icon: BriefcaseBusiness },
  { href: '/admin/notifications', label: 'Notifications', icon: BellRing },
  { href: '/admin/campagnes', label: 'Campagnes', icon: Megaphone },
  { href: '/admin/bannieres', label: 'Bannières APK', icon: PanelsTopLeft },
  { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/admin/logs', label: 'Journal', icon: ScrollText },
]

export function AdminNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = sections.find((item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))) || sections[0]
  const CurrentIcon = current.icon

  return (
    <nav aria-label="Sections d’administration" className="w-full">
      <div className="hidden items-center gap-1.5 lg:flex lg:flex-wrap lg:justify-end">
        {sections.map(({ href, label, icon: Icon }) => {
          const active = href === current.href
          return <Link key={href} href={href} className={cn('inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition', active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}><Icon className="h-3.5 w-3.5" />{label}</Link>
        })}
      </div>

      <div className="lg:hidden">
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm">
          <span className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary"><CurrentIcon className="h-4 w-4" /></span><span><span className="block text-sm font-black text-foreground">{current.label}</span><span className="block text-[11px] text-muted-foreground">Sections Administration</span></span></span>
          <ChevronDown className={cn('h-4 w-4 text-primary transition-transform', open && 'rotate-180')} />
        </button>
        {open && <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:grid-cols-3">{sections.map(({ href, label, icon: Icon }) => {
          const active = href === current.href
          return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn('flex min-h-20 flex-col justify-center gap-2 rounded-xl p-3 text-xs font-bold transition active:scale-[0.98]', active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/45 text-foreground hover:bg-primary/10')}><Icon className={cn('h-4 w-4', active ? 'text-primary-foreground' : 'text-primary')} />{label}</Link>
        })}</div>}
      </div>
    </nav>
  )
}
