import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { createTranslator } from '@/lib/i18n/server'
import { LocaleProvider } from '@/lib/i18n/locale-provider'
import './globals.css'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'

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
  description: 'Creez des CV professionnels adaptes au marche de l\'emploi africain. Paiement Mobile Money (Orange, MTN, Moov). Templates modernes et conseils IA.',
  keywords: ['CV', 'curriculum vitae', 'Afrique', 'emploi', 'recrutement', 'Mobile Money', 'Orange Money', 'MTN', 'Moov', 'CinetPay'],
  authors: [{ name: 'CVAfrik' }],
  creator: 'CVAfrik',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cvafrik.com',
    siteName: 'CVAfrik',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique',
    description: 'Creez des CV qui font la difference. Paiement Mobile Money accepte.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVAfrik - CV Professionnels pour l\'Afrique',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale } = await createTranslator()

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider serverLocale={locale}>
            {children}
            <Toaster richColors position="top-center" />
            <Script 
              src="https://checkout.fedapay.com/js/checkout.js" 
              strategy="beforeInteractive"
            />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
