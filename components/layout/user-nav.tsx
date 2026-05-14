'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { LayoutDashboard, LogOut, UserRound, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const meta = user.user_metadata as { prenom?: string; nom?: string; full_name?: string } | undefined
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

  const handleSignOut = async () => {
    setLoading(true)
    onNavigate?.()
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'stacked') {
    return (
      <div className="flex flex-col gap-2 pt-2">
        <p className="truncate px-1 text-sm text-muted-foreground">{email}</p>
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
        <Button variant="outline" className="gap-2 border-border/60">
          <UserRound className="h-4 w-4 shrink-0" />
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
