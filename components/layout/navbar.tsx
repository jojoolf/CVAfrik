'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { ArrowLeft, BookOpen, FileSignature, FileText, LayoutDashboard, MoreHorizontal, Sparkles, BriefcaseBusiness, MessageSquareCode, ShieldCheck, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserNav } from '@/components/layout/user-nav'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { isAdminEmail } from '@/lib/admin/access'

interface NavbarProps { user?: User | null }
type NavItem = { name: string; href: string; icon?: React.ComponentType<{ className?: string }> }
type MoreView = 'menu' | 'account' | 'information'

export function Navbar({ user }: NavbarProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [moreView, setMoreView] = useState<MoreView>('menu')
  const isAdmin = isAdminEmail(user?.email)

  const navigation: NavItem[] = user
    ? [
        { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('nav.cv'), href: '/cv-builder', icon: FileText },
        { name: t('nav.lettres'), href: '/dashboard/lettres', icon: FileSignature },
        { name: 'Opportunités', href: '/opportunites', icon: BriefcaseBusiness },
        { name: t('nav.entretien'), href: '/dashboard/simulateur', icon: MessageSquareCode },
        { name: t('nav.blog'), href: '/blog', icon: Sparkles },
        { name: t('nav.modeles'), href: '/templates' },
      ]
    : [
        { name: t('nav.fonctionnalites'), href: '/#fonctionnalites' },
        { name: t('nav.templates'), href: '/templates' },
        { name: t('nav.tarifs'), href: '/tarifs' },
        { name: t('nav.blogEmploi'), href: '/blog' },
      ]

  const mobilePrimary = user
    ? navigation.slice(0, 4)
    : [
        { name: 'Accueil', href: '/', icon: LayoutDashboard },
        { name: t('nav.templates'), href: '/templates', icon: FileText },
        { name: t('nav.tarifs'), href: '/tarifs', icon: Sparkles },
        { name: t('nav.blogEmploi'), href: '/blog', icon: BriefcaseBusiness },
      ]
  const mobileSecondary = user ? navigation.slice(4) : navigation.slice(4)
  const informationLinks: NavItem[] = [
    { name: 'Ressources CVAfrik', href: '/blog', icon: BookOpen },
    { name: 'Confidentialité', href: '/legal/confidentialite', icon: ShieldCheck },
    { name: 'Conditions d’utilisation', href: '/legal/conditions', icon: FileText },
    { name: 'Mentions légales', href: '/legal/mentions', icon: FileText },
  ]
  const isItemActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  const isMoreActive = mobileSecondary.some((item) => isItemActive(item.href))

  const closeMoreMenu = useCallback(() => {
    setMoreView('menu')
    setIsMoreOpen(false)
  }, [])

  const handleMoreOpenChange = useCallback((open: boolean) => {
    setIsMoreOpen(open)
    if (!open) setMoreView('menu')
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let listener: { remove: () => Promise<void> } | undefined
    void CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (isMoreOpen) {
        if (moreView === 'information') {
          setMoreView('account')
          return
        }
        if (moreView === 'account') {
          setMoreView('menu')
          return
        }
        closeMoreMenu()
        return
      }
      if (canGoBack) {
        window.history.back()
        return
      }
      void CapacitorApp.exitApp()
    }).then((handle) => { listener = handle })

    return () => { void listener?.remove() }
  }, [closeMoreMenu, isMoreOpen, moreView])

  const moreTitle = moreView === 'account' ? 'Mon compte' : moreView === 'information' ? 'Informations' : 'Plus'
  const goBackInMore = () => setMoreView(moreView === 'information' ? 'account' : 'menu')

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 shadow-sm md:bg-background/90 md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-background/75">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Image src="/brand/cvafrik-official-mark.png" alt="" width={36} height={36} className="h-8 w-8 object-contain" priority />
            </div>
            <span className="text-xl font-bold text-foreground font-syne">CV<span className="text-primary">Afrik</span></span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                {item.icon && <item.icon className="h-4 w-4" />}{item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <LanguageSwitcher /><ModeToggle />
            {user ? <UserNav user={user} isAdmin={isAdmin} /> : <><Button variant="ghost" asChild className="rounded-full"><Link href="/auth/connexion">{t('nav.connexion')}</Link></Button><Button asChild className="rounded-full shadow-lg shadow-primary/20"><Link href="/auth/inscription">{t('nav.commencer')}</Link></Button></>}
          </div>

          <div className="flex items-center gap-1 md:hidden"><LanguageSwitcher /><ModeToggle /></div>
        </nav>
      </header>

      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {mobilePrimary.map((item) => {
            const Icon = item.icon || FileText
            const active = isItemActive(item.href)
            return <Link key={item.name} href={item.href} aria-current={active ? 'page' : undefined} className={cn('flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition', active ? 'bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary')}><Icon className="h-5 w-5" /><span className="truncate">{item.name}</span></Link>
          })}
          <Sheet open={isMoreOpen} onOpenChange={handleMoreOpenChange}>
            <SheetTrigger asChild><button type="button" aria-current={isMoreActive ? 'page' : undefined} className={cn('flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition', isMoreActive ? 'bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary')}><MoreHorizontal className="h-5 w-5" /><span>Plus</span></button></SheetTrigger>
            <SheetContent side="bottom" showClose={false} className="max-h-[78dvh] overflow-hidden rounded-t-[1.75rem] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
              <div className="mb-4 flex items-center justify-between gap-3">
                {moreView === 'menu' ? (
                  <div className="flex items-center gap-2"><Image src="/brand/cvafrik-official-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" /><p className="font-bold text-foreground">{moreTitle}</p></div>
                ) : (
                  <Button type="button" variant="ghost" size="sm" className="-ml-2 gap-1 px-2" onClick={goBackInMore}><ArrowLeft className="h-4 w-4" />Retour</Button>
                )}
                <div className="flex items-center gap-1">
                  {moreView === 'menu' && <><LanguageSwitcher /><ModeToggle /></>}
                  <Button type="button" variant="ghost" size="sm" className="gap-1 px-2" onClick={closeMoreMenu}><X className="h-4 w-4" /><span>Fermer</span></Button>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto overscroll-contain pb-2">
                {moreView === 'menu' && <>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Découvrir</p>
                  <div className="grid grid-cols-2 gap-3">
                    {mobileSecondary.map((item) => {
                      const Icon = item.icon || FileText
                      const active = isItemActive(item.href)
                      return <Link key={item.name} href={item.href} aria-current={active ? 'page' : undefined} onClick={closeMoreMenu} className={cn('flex min-h-[5.25rem] flex-col justify-center gap-2 rounded-2xl border p-3 text-sm font-semibold transition active:scale-[0.98]', active ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5')}><Icon className="h-5 w-5 text-primary" />{item.name}</Link>
                    })}
                    {!user && <><Link href="/auth/connexion" onClick={closeMoreMenu} className="rounded-2xl border border-border p-4 text-sm font-semibold">{t('nav.connexion')}</Link><Link href="/auth/inscription" onClick={closeMoreMenu} className="rounded-2xl bg-primary p-4 text-sm font-semibold text-primary-foreground">{t('nav.commencer')}</Link></>}
                  </div>
                  {user && <Button type="button" variant="outline" className="mt-4 h-auto w-full justify-start rounded-2xl border-primary/20 bg-primary/5 px-4 py-3 text-left" onClick={() => setMoreView('account')}><UserRound className="mr-3 h-5 w-5 text-primary" /><span><span className="block font-bold">Mon compte</span><span className="mt-0.5 block text-xs font-normal text-muted-foreground">Profil, abonnement, aide et informations</span></span></Button>}
                </>}

                {moreView === 'account' && user && <UserNav user={user} isAdmin={isAdmin} variant="stacked" onNavigate={closeMoreMenu} onShowInformation={() => setMoreView('information')} />}

                {moreView === 'information' && <div className="space-y-2">
                  <p className="px-1 text-sm text-muted-foreground">Ressources et informations légales de CVAfrik.</p>
                  {informationLinks.map((item) => {
                    const Icon = item.icon || FileText
                    return <Link key={item.href} href={item.href} onClick={closeMoreMenu} className="flex min-h-14 items-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5 active:scale-[0.99]"><Icon className="mr-3 h-5 w-5 text-primary" />{item.name}</Link>
                  })}
                </div>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  )
}
