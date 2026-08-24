import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { NotificationsInboxClient } from '@/components/notifications/notifications-inbox-client'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Notifications | CVAfrik',
  description: 'Vos notifications CVAfrik',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion?redirect=/notifications')

  const { data } = await supabase
    .from('user_notifications')
    .select('id,category,title,body,href,read_at,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <NotificationsInboxClient initialNotifications={data ?? []} />
      </main>
    </div>
  )
}
