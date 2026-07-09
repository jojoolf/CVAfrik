'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  FileText,
  LayoutDashboard,
  Sparkles,
  FileSignature,
  MessageSquareCode,
  LifeBuoy,
} from 'lucide-react'
import { UserNav } from '@/components/layout/user-nav'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: User | null
}

interface NavigationItem {
  name: string
  href: string
  icon?: typeof LayoutDashboard
  badge?: string
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getNavigation = (): NavigationItem[] => {
    if (!user) {
      return [
        { name: 'Fonctionnalites', href: '/#fonctionnalites' },
        { name: 'Templates', href: '/templates' },
        { name: 'Tarifs', href: '/tarifs' },
        { name: 'Blog & Emploi', href: '/blog' },
      ]
    }

    const baseMenu: NavigationItem[] = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'CV', href: '/cv-builder', icon: FileText },
      { name: 'Lettres', href: '/dashboard/lettres', icon: FileSignature },
      { name: 'Entretien', href: '/dashboard/simulateur', icon: MessageSquareCode, badge: 'Bientot' },
      { name: 'Blog', href: '/blog', icon: Sparkles },
    ]

    return [
      ...baseMenu,
      { name: 'Modeles', href: '/templates' },
      { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    ]
  }

  const navigation = getNavigation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-syne text-xl font-bold text-foreground">
            CV<span className="text-primary">Afrik</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all hover:bg-secondary/50',
                'text-muted-foreground hover:text-foreground dark:text-slate-300 dark:hover:text-white',
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
              {item.badge && (
                <Badge variant="outline" className="ml-1 h-5 rounded-full px-2 text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          {user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link href="/auth/connexion">Connexion</Link>
              </Button>
              <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                <Link href="/auth/inscription">Commencer gratuitement</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] rounded-l-[2rem] sm:w-[400px]">
            <div className="flex flex-col gap-8 pt-10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-syne text-xl font-bold text-foreground">
                    CV<span className="text-primary">Afrik</span>
                  </span>
                </Link>
                <ModeToggle />
              </div>

              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-medium text-foreground transition-all hover:bg-secondary"
                  >
                    {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                    {item.name}
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                {user ? (
                  <UserNav user={user} variant="stacked" onNavigate={() => setIsOpen(false)} />
                ) : (
                  <>
                    <Button variant="outline" asChild className="rounded-2xl" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/connexion">Connexion</Link>
                    </Button>
                    <Button asChild className="rounded-2xl shadow-lg shadow-primary/20" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/inscription">Commencer gratuitement</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
