'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, BellRing, BriefcaseBusiness, ChevronDown, FilePlus2, LayoutDashboard, Megaphone, PanelsTopLeft, ScrollText, ShieldCheck, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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

export function AdminNativeSectionMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = sections.find((item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))) || sections[0]
  const CurrentIcon = current.icon

  if (pathname === '/admin') return null

  return <div className="admin-native-mobile px-4 pt-3">
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><button type="button" className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5 text-left shadow-sm"><span className="flex min-w-0 items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><CurrentIcon className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-[0.13em] text-primary">Administration</span><span className="block truncate text-sm font-black text-foreground">{current.label}</span></span></span><ChevronDown className="h-4 w-4 text-primary" /></button></SheetTrigger>
      <SheetContent side="bottom" showClose={false} className="max-h-[76dvh] rounded-t-[1.75rem] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"><div className="mx-auto h-1.5 w-12 rounded-full bg-muted" /><div className="mb-4 mt-3 flex items-center justify-between"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><p className="font-black">Administration</p></div><button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-muted-foreground" aria-label="Fermer"><X className="h-4 w-4" /></button></div><div className="grid grid-cols-2 gap-3 overflow-y-auto pb-3">{sections.map(({ href, label, icon: Icon }) => { const active = href === current.href; return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn('flex min-h-24 flex-col justify-center gap-2 rounded-2xl border p-3 text-sm font-bold transition active:scale-[0.98]', active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-card text-foreground')}><Icon className={cn('h-5 w-5', active ? 'text-primary-foreground' : 'text-primary')} />{label}</Link> })}</div></SheetContent>
    </Sheet>
  </div>
}
