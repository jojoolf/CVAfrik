'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type InboxNotification = {
  id: string
  category: 'application' | 'opportunity' | 'payment' | 'announcement'
  title: string
  body: string
  href: string | null
  read_at: string | null
  created_at: string
}

function relativeDate(value: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours} h`
  return `Il y a ${Math.floor(hours / 24)} j`
}

export function NotificationBell() {
  const router = useRouter()
  const [items, setItems] = useState<InboxNotification[]>([])
  const [loading, setLoading] = useState(true)
  const unread = useMemo(() => items.filter((item) => !item.read_at), [items])

  const load = async () => {
    try {
      const response = await fetch('/api/notifications/inbox', { credentials: 'include' })
      if (!response.ok) return
      const data = await response.json()
      setItems(data.notifications ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    const refresh = () => void load()
    window.addEventListener('cvafrik:push-received', refresh)
    return () => window.removeEventListener('cvafrik:push-received', refresh)
  }, [])

  const markRead = async (ids: string[]) => {
    if (!ids.length) return
    setItems((current) => current.map((item) => ids.includes(item.id) ? { ...item, read_at: new Date().toISOString() } : item))
    await fetch('/api/notifications/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    })
  }

  const open = (item: InboxNotification) => {
    if (!item.read_at) void markRead([item.id])
    if (item.href?.startsWith('/') && !item.href.startsWith('//')) router.push(item.href)
  }

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) void load() }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Ouvrir les notifications">
          <Bell className="h-4 w-4" />
          {unread.length > 0 ? <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{Math.min(unread.length, 9)}</span> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(23rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-3 py-3">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unread.length > 0 ? <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => void markRead(unread.map((item) => item.id))}><CheckCheck className="mr-1 h-3.5 w-3.5" />Tout lire</Button> : null}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[min(28rem,60vh)] overflow-y-auto p-1">
          {loading ? <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Chargement…</div> : null}
          {!loading && items.length === 0 ? <p className="px-3 py-8 text-center text-sm text-muted-foreground">Aucune notification pour le moment.</p> : null}
          {!loading && items.map((item) => (
            <button key={item.id} type="button" onClick={() => open(item)} className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-muted ${item.read_at ? 'opacity-70' : 'bg-primary/5'}`}>
              <div className="flex items-start gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read_at ? 'bg-muted-foreground/30' : 'bg-primary'}`} /><div className="min-w-0"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.body}</p><p className="mt-1.5 text-[11px] text-muted-foreground">{relativeDate(item.created_at)}</p></div></div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
