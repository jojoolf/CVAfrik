import Link from 'next/link'
import { FileText, Mail, CreditCard } from 'lucide-react'

const footerLinks = {
  produit: [
    { name: 'Créer un CV', href: '/cv-builder' },
    { name: 'Modèles de CV', href: '/templates' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'Avis utilisateurs', href: '/avis' },
  ],
  ressources: [
    { name: 'Blog Carrière', href: '/blog' },
    { name: 'Guide de rédaction', href: '/blog/guide-cv' },
    { name: 'Conseils Entretien', href: '/blog/conseils-entretien' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '/legal/conditions' },
    { name: 'Politique de confidentialité', href: '/legal/confidentialite' },
    { name: 'Mentions légales', href: '/legal/mentions' },
  ],
}

const paymentMethods = [
  { name: 'Carte Bancaire', color: 'bg-blue-600', icon: CreditCard },
  { name: 'Orange Money', color: 'bg-orange-500' },
  { name: 'Wave', color: 'bg-blue-400' },
  { name: 'MTN Money', color: 'bg-yellow-500' },
  { name: 'Moov Money', color: 'bg-blue-700' },
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
              La plateforme de création de CV intelligente conçue pour booster la carrière des talents en Afrique. 
              Templates professionnels, score ATS et préparation aux entretiens par IA.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 transition-colors hover:text-primary">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@cvafrik.com">contact@cvafrik.com</a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground/70">Moyens de paiement sécurisés</p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-xs font-semibold shadow-sm ring-1 ring-border/50"
                  >
                    {method.icon ? (
                      <method.icon className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <span className={`h-2 w-2 rounded-full ${method.color}`} />
                    )}
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-5 font-bold text-foreground">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-5 font-bold text-foreground">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-5 font-bold text-foreground">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} CVAfrik. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Fait avec passion pour l&apos;Afrique 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
