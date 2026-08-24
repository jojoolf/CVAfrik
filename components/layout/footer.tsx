'use client'

import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/use-translation'
import { Capacitor } from '@capacitor/core'

const footerLinks = {
  product: [
    { key: 'createCV', href: '/cv-builder' },
    { key: 'templates', href: '/templates' },
    { key: 'pricing', href: '/tarifs' },
  ],
  resources: [
    { key: 'blog', href: '/blog' },
    { key: 'guide', href: '/blog/guide-cv' },
    { key: 'interviews', href: '/blog/conseils-entretien' },
    { key: 'faq', href: '/faq' },
  ],
  legal: [
    { key: 'terms', href: '/legal/conditions' },
    { key: 'privacy', href: '/legal/confidentialite' },
    { key: 'mentions', href: '/legal/mentions' },
  ],
}

export function Footer() {
  const { t } = useTranslation()

  // L’APK utilise une navigation applicative avec barre basse : le pied de page web n’y est pas utile.
  if (Capacitor.isNativePlatform()) return null
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                CV<span className="text-primary">Afrik</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground">{t('footer.description')}</p>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 transition-colors hover:text-primary">
                <Mail className="h-4 w-4" />
                <a href="mailto:cvafrik@gmail.com">cvafrik@gmail.com</a>
              </div>
            </div>

          </div>

          <FooterLinkColumn title={t('footer.product')} links={footerLinks.product} t={t} />
          <FooterLinkColumn title={t('footer.resources')} links={footerLinks.resources} t={t} />
          <FooterLinkColumn title={t('footer.legal')} links={footerLinks.legal} t={t} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} CVAfrik. {t('footer.copyright')}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {t('footer.made')} 🌍
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkColumn({
  title,
  links,
  t,
}: {
  title: string
  links: { key: string; href: string }[]
  t: (path: string) => string
}) {
  return (
    <div>
      <h3 className="mb-5 font-bold text-foreground">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.key}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t(`footer.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
