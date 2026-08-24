import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { isAdminEmail } from '@/lib/admin/access'
import { AdminNavigation } from '@/components/admin/admin-navigation'
import { AdminNativeSectionMenu } from '@/components/admin/admin-native-section-menu'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar user={user} />
      <AdminNativeSectionMenu />
      <section className="admin-native-header border-b border-border bg-background/95">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-foreground">Administration CVAfrik</p>
              <p className="text-xs text-muted-foreground">Pilotage sécurisé de l’application</p>
            </div>
          </div>
          <div className="w-full lg:w-auto"><AdminNavigation /></div>
        </div>
      </section>
      <main className="flex-1 bg-background">{children}</main>
    </div>
  )
}
