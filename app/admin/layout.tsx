import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, BellRing, BriefcaseBusiness, FilePlus2, LayoutDashboard, Megaphone, PanelsTopLeft, ScrollText, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { isAdminEmail } from '@/lib/admin/access'

const adminLinks = [
  { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/admin/blog/nouveau', label: 'Nouveau contenu', icon: FilePlus2 },
  { href: '/admin/opportunites', label: 'Opportunités', icon: BriefcaseBusiness },
  { href: '/admin/notifications', label: 'Notifications', icon: BellRing },
  { href: '/admin/campagnes', label: 'Campagnes in-app', icon: Megaphone },
  { href: '/admin/bannieres', label: 'Bannières APK', icon: PanelsTopLeft },
  { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/admin/logs', label: 'Journal', icon: ScrollText },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar user={user} />
      <section className="border-b border-border bg-background/95">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-foreground">Administration CVAfrik</p>
              <p className="text-xs text-muted-foreground">Espace de pilotage sécurisé</p>
            </div>
          </div>
          <nav className="flex max-w-full gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Navigation administrateur">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <main className="flex-1 bg-background">{children}</main>
    </div>
  )
}
