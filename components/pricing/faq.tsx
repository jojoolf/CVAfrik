'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Comment fonctionne le paiement par Mobile Money ou Carte ?',
    answer: 'C\'est très simple. Après avoir choisi votre plan, vous pourrez payer instantanément via Orange Money, MTN Mobile Money, Moov ou par Carte Bancaire (Visa/Mastercard). L\'activation de votre plan est immédiate dès la validation de la transaction.',
  },
  {
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Oui, absolument. CVAfrik est sans engagement. Vous pouvez annuler votre abonnement en un clic depuis votre profil. Vous garderez vos accès premium jusqu\'à la fin de la période déjà réglée.',
  },
  {
    question: 'C\'est quoi le "Score ATS" et pourquoi est-ce important ?',
    answer: 'L\'ATS (Applicant Tracking System) est un logiciel utilisé par les recruteurs pour filtrer les CV. Notre IA analyse votre CV pour vérifier s\'il contient les bons mots-clés et le bon format pour passer ces filtres automatiques et arriver sur le bureau du recruteur.',
  },
  {
    question: 'Le plan Business est-il adapté pour les écoles ou universités ?',
    answer: 'Oui, le plan Business est conçu spécifiquement pour les institutions et les coachs carrière. Il permet de gérer plusieurs profils étudiants, de suivre leur progression et d\'utiliser des templates personnalisés avec le logo de votre établissement.',
  },
  {
    question: 'Quels sont les avantages de l\'abonnement annuel ?',
    answer: 'L\'abonnement annuel vous permet de bénéficier de 2 mois offerts par rapport au tarif mensuel. C\'est la solution idéale pour un accompagnement complet sur le long terme.',
  },
  {
    question: 'Puis-je changer de plan en cours de route ?',
    answer: 'Oui, vous pouvez passer d\'un plan Starter à Career Pro à tout moment pour débloquer les fonctionnalités avancées comme la simulation d\'entretien IA.',
  },
  {
    question: 'Comment obtenir une facture ?',
    answer: 'Une facture professionnelle est générée automatiquement pour chaque paiement. Vous pouvez la télécharger à tout moment depuis votre tableau de bord dans la section "Paiements".',
  },
]

export function FAQ() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Questions frequentes
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Tout ce que vous devez savoir sur nos tarifs et le paiement
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
