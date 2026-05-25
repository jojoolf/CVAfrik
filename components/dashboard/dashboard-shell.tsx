'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FileSignature,
  MessageSquareCode,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  Crown,
  Sparkles,
  BookOpen,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { useState } from 'react'

const sidebarLinks = [
  {
    label: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Mes CV',
    href: '/cv-builder',
    icon: FileText,
  },
  {
    label: 'Lettres de motivation',
    href: '/dashboard/lettres',
    icon: FileSignature,
  },
  {
    label: 'Simulateur IA',
    href: '/dashboard/simulateur',
    icon: MessageSquareCode,
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: BookOpen,
  },
  {
    label: 'Aide & Support',
    href: '/dashboard/support',
    icon: LifeBuoy,
  },
  {
    label: 'Tarifs',
    href: '/tarifs',
    icon: CreditCard,
  },
]

interface DashboardShellProps {
  children: React.ReactNode
  user?: {
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
    }
  } | null
  displayName?: string
  planName?: string
  isFreePlan?: boolean
}

export function DashboardShell({
  children,
  user,
  displayName,
  planName,
  isFreePlan,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 lg:static',
          sidebarOpen ? 'w-64' : 'w-16',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b border-border px-4',
          !sidebarOpen && 'justify-center px-0',
        )}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-white text-xs font-bold shadow-sm">
              CA
            </div>
            <span className={cn(
              'font-bold text-foreground transition-opacity duration-200',
              !sidebarOpen && 'hidden',
            )}>
              CVAfrik
            </span>
          </Link>
        </div>

        {/* Plan badge */}
        {sidebarOpen && (
          <div className="px-3 pt-4">
            <Link href={isFreePlan ? '/tarifs' : '/dashboard/factures'}>
              <div className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors',
                isFreePlan
                  ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20'
                  : 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
              )}>
                {isFreePlan ? (
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Crown className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate">
                  {isFreePlan ? 'Passer à Pro' : `Plan ${planName || 'Gratuit'}`}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  !sidebarOpen && 'justify-center px-2',
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span className={cn(
                  'transition-opacity duration-200',
                  !sidebarOpen && 'hidden',
                )}>
                  {link.label}
                </span>
                {isActive && sidebarOpen && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        {sidebarOpen && (
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-2.5">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayName || 'Utilisateur'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-sidebar text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Search */}
          <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 h-9 bg-muted/50 border-none rounded-xl text-sm"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* Theme toggle */}
            <ModeToggle />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 ring-2 ring-border">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{displayName || 'Utilisateur'}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profil/modifier" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
