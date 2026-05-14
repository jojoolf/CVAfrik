'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, FileText, LayoutDashboard, Sparkles, Star, FileSignature, MessageSquareCode, LifeBuoy } from 'lucide-react'
import { UserNav } from '@/components/layout/user-nav'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: User | null
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
      
      if (data) setPlan(data.plan)
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const getNavigation = () => {
    if (!user) {
      return [
        { name: 'Fonctionnalités', href: '/#fonctionnalites' },
        { name: 'Templates', href: '/templates' },
        { name: 'Tarifs', href: '/tarifs' },
        { name: 'Blog & Emploi', href: '/blog' },
      ]
    }

    // Menu pour utilisateur connecté
    const baseMenu = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'CV', href: '/cv-builder', icon: FileText },
      { name: 'Lettres', href: '/dashboard/lettres', icon: FileSignature },
      { name: 'Entretien', href: '/dashboard/simulateur', icon: MessageSquareCode },
      { name: 'Blog', href: '/blog', icon: Sparkles },
    ]

    return [
      ...baseMenu,
      { name: 'Modèles', href: '/templates' },
      { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    ]
  }

  const navigation = getNavigation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground font-syne">
            CV<span className="text-primary">Afrik</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-full hover:bg-secondary/50",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth & Theme */}
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

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-[2rem]">
            <div className="flex flex-col gap-8 pt-10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold font-syne text-foreground">
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
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-foreground transition-all rounded-2xl hover:bg-secondary"
                  >
                    {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                    {item.name}
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
