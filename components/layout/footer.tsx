import Link from 'next/link'
import { FileText, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  produit: [
    { name: 'Creer un CV', href: '/cv-builder' },
    { name: 'Templates', href: '/#templates' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'Lettres de motivation', href: '/lettres' },
  ],
  ressources: [
    { name: 'Guide du CV parfait', href: '/blog/guide-cv' },
    { name: 'Conseils entretien', href: '/blog/conseils-entretien' },
    { name: 'Marche de l\'emploi', href: '/blog/marche-emploi' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '/legal/conditions' },
    { name: 'Politique de confidentialite', href: '/legal/confidentialite' },
    { name: 'Mentions legales', href: '/legal/mentions' },
  ],
}

const paymentMethods = [
  { name: 'Orange Money', color: 'bg-orange-500' },
  { name: 'Wave', color: 'bg-blue-500' },
  { name: 'MTN', color: 'bg-yellow-500' },
  { name: 'Moov', color: 'bg-blue-600' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                CV<span className="text-primary">Afrik</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground">
              La plateforme de creation de CV conçue pour l&apos;Afrique de l&apos;Ouest. 
              Des templates professionnels et des conseils IA pour decrocher votre emploi de reve.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@cvafrik.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+225 07 00 00 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Abidjan, Cote d&apos;Ivoire</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-foreground">Moyens de paiement</p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-sm"
                  >
                    <span className={`h-2 w-2 rounded-full ${method.color}`} />
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CVAfrik. Tous droits reserves.
          </p>
          <p className="text-sm text-muted-foreground">
            Fait avec passion pour l&apos;Afrique
          </p>
        </div>
      </div>
    </footer>
  )
}
