import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { createTranslator } from '@/lib/i18n/server'
import { LocaleProvider } from '@/lib/i18n/locale-provider'
import './globals.css'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { NativeOAuthRedirect } from '@/components/auth/native-oauth-redirect'
import { NativePushNotifications } from '@/components/notifications/native-push-notifications'
import { LivePresence } from '@/components/analytics/live-presence'
import { NativeAppExperience } from '@/components/layout/native-app-experience'
import { InAppCampaignModal } from '@/components/campaigns/in-app-campaign-modal'

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
    default: 'CVAfrik - Creez votre CV professionnel pour l\'Afrique',
    template: '%s | CVAfrik',
  },
  description: 'Creez des CV professionnels adaptes au marche de l\'emploi africain. Paiement FedaPay, templates modernes et conseils IA.',
  keywords: ['CV', 'curriculum vitae', 'Afrique', 'emploi', 'recrutement', 'FedaPay', 'Mobile Money', 'Orange Money', 'MTN', 'Moov'],
  authors: [{ name: 'CVAfrik' }],
  creator: 'CVAfrik',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cvafrik.com',
    siteName: 'CVAfrik',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique',
    description: 'Creez des CV qui font la difference. Paiement FedaPay accepte.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique',
    description: 'Creez des CV qui font la difference. Paiement FedaPay accepte.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/brand/cvafrik-official-app-512.png?v=20260823', sizes: '512x512', type: 'image/png' },
      { url: '/brand/cvafrik-official-app-192.png?v=20260823', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/brand/cvafrik-official-app-192.png?v=20260823',
    apple: '/brand/cvafrik-official-apple-180.png?v=20260823',
  },
  manifest: '/manifest.json?v=20260823',
  appleWebApp: {
    capable: true,
    title: 'CVAfrik',
    statusBarStyle: 'black-translucent',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale } = await createTranslator()

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <NativeOAuthRedirect />
        <NativePushNotifications />
        <LivePresence />
        <ThemeProvider
          attribute="class"
          storageKey="cvafrik-theme-v2"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleProvider serverLocale={locale}>
            <NativeAppExperience />
            <InAppCampaignModal />
            {children}
            <Toaster richColors position="top-center" />
            <Script
              src="https://cdn.fedapay.com/checkout.js?v=1.1.7"
              strategy="beforeInteractive"
            />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
