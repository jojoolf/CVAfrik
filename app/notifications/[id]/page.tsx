import { notFound, redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { NotificationDetailClient } from '@/components/notifications/notification-detail-client'
import { createClient } from '@/lib/supabase/server'

interface NotificationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NotificationDetailPage({ params }: NotificationDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/connexion?redirect=/notifications/${id}`)

  const { data: notification } = await supabase
    .from('user_notifications')
    .select('id,category,title,body,href,read_at,created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!notification) notFound()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />
      <NotificationDetailClient notification={notification} />
    </div>
  )
}
