import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'

const ADMIN_EMAILS = ['nokejoel@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="bg-amber-500 text-amber-950 p-2 text-center text-[10px] font-black tracking-[0.3em] uppercase">
        ⚠️ Mode Administrateur ⚠️
      </div>
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  )
}
