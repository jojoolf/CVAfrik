'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { CreditCard, LayoutDashboard, LogOut, UserRound, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

interface UserNavProps {
  user: User
  /** Fermer le menu mobile (Sheet) après navigation */
  onNavigate?: () => void
  /** Liste verticale pour le drawer mobile */
  variant?: 'dropdown' | 'stacked'
}

function displayLabel(user: User) {
  const meta = user.user_metadata as { prenom?: string; nom?: string; full_name?: string; avatar_url?: string } | undefined
  const fromMeta = [meta?.prenom, meta?.nom].filter(Boolean).join(' ').trim()
  if (fromMeta) return fromMeta
  if (meta?.full_name) return meta.full_name
  return user.email?.split('@')[0] ?? 'Compte'
}

export function UserNav({ user, onNavigate, variant = 'dropdown' }: UserNavProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const label = displayLabel(user)
  const email = user.email ?? ''
  const avatarUrl = (user.user_metadata as { avatar_url?: string } | undefined)?.avatar_url
  const initials = label.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CA'

  const handleSignOut = async () => {
    setLoading(true)
    onNavigate?.()
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      router.replace('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'stacked') {
    return (
      <div className="flex flex-col gap-2 pt-2">
        <div className="mb-1 rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0"><AvatarImage src={avatarUrl} alt="Photo de profil" /><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{label}</p><p className="truncate text-xs text-muted-foreground">{email}</p></div>
          </div>
        </div>
        <Button variant="outline" asChild className="w-full justify-start" onClick={onNavigate}>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Mon espace
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full justify-start" onClick={onNavigate}>
          <Link href="/profil">
            <UserRound className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full justify-start" onClick={onNavigate}>
          <Link href="/dashboard/factures"><CreditCard className="mr-2 h-4 w-4" />Mon abonnement</Link>
        </Button>
        <Button variant="outline" asChild className="w-full justify-start" onClick={onNavigate}>
          <Link href="/dashboard/support"><LifeBuoy className="mr-2 h-4 w-4" />Aide & Support</Link>
        </Button>
        <Button
          variant="destructive"
          className="w-full justify-start"
          disabled={loading}
          onClick={() => void handleSignOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-border/60 hover:bg-secondary/80 dark:hover:bg-slate-800 transition-colors">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarImage src={avatarUrl} alt="Photo de profil" />
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <span className="max-w-[140px] truncate text-sm font-medium">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Mon espace
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profil" className="cursor-pointer">
            <UserRound className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/factures" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Mon abonnement
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/support" className="cursor-pointer">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Aide & Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          disabled={loading}
          onClick={() => void handleSignOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
