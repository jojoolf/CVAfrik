import { Metadata } from 'next'
import { AdminPromoBannersClient } from './admin-promo-banners-client'

export const metadata: Metadata = {
  title: 'Bannières APK | Administration CVAfrik',
  description: 'Gestion des bannières promotionnelles visibles dans l’application CVAfrik.',
}

export default function AdminPromoBannersPage() {
  return <AdminPromoBannersClient />
}
