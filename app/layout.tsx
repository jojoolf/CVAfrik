import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

import { Syne, DM_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'CVAfrik - Creez votre CV professionnel pour l\'Afrique de l\'Ouest',
    template: '%s | CVAfrik',
  },
  description: 'Creez des CV professionnels adaptes au marche de l\'emploi en Afrique de l\'Ouest. Paiement Mobile Money (Orange, Wave, MTN, Moov). Templates modernes et conseils IA.',
  keywords: ['CV', 'curriculum vitae', 'Afrique', 'emploi', 'recrutement', 'Mobile Money', 'Orange Money', 'Wave', 'MTN', 'Moov', 'CinetPay'],
  authors: [{ name: 'CVAfrik' }],
  creator: 'CVAfrik',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cvafrik.com',
    siteName: 'CVAfrik',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique de l\'Ouest',
    description: 'Creez des CV qui font la difference. Paiement Mobile Money accepte.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique de l\'Ouest',
    description: 'Creez des CV qui font la difference. Paiement Mobile Money accepte.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d97706' },
    { media: '(prefers-color-scheme: dark)', color: '#f59e0b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
