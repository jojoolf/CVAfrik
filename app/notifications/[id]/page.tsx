import { redirect } from 'next/navigation'

interface NotificationDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Compatibilité avec les anciens liens de notification.
 * Le détail est maintenant rendu dans /notifications pour éviter un chargement
 * de route dynamique dans la WebView Android.
 */
export default async function NotificationDetailPage({ params }: NotificationDetailPageProps) {
  const { id } = await params
  void id
  redirect('/notifications')
}
