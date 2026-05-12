'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Comment fonctionne le paiement Mobile Money?',
    answer: 'Apres avoir choisi votre plan, vous serez redirige vers CinetPay ou vous pourrez payer avec Orange Money, Wave, MTN, Moov ou Flooz. Vous recevrez un code de confirmation sur votre telephone pour valider le paiement. Une fois le paiement confirme, votre plan est active immediatement.',
  },
  {
    question: 'Puis-je annuler mon abonnement a tout moment?',
    answer: 'Oui, vous pouvez annuler votre abonnement a tout moment depuis votre espace client. Votre acces aux fonctionnalites premium restera actif jusqu\'a la fin de la periode payee.',
  },
  {
    question: 'Quelle est la duree de validite des plans?',
    answer: 'Les plans Pro et Premium sont valides pour une duree d\'un mois a compter de la date de paiement. Vous pouvez renouveler votre abonnement manuellement ou configurer le renouvellement automatique.',
  },
  {
    question: 'Puis-je changer de plan en cours de mois?',
    answer: 'Oui, vous pouvez passer a un plan superieur a tout moment. La difference de prix sera calculee au prorata des jours restants. Le passage a un plan inferieur sera effectif a la fin de votre periode en cours.',
  },
  {
    question: 'Que se passe-t-il si mon paiement echoue?',
    answer: 'Si votre paiement echoue, vous pouvez reessayer immediatement avec le meme operateur ou en choisir un autre. Si le probleme persiste, contactez notre support a contact@cvafrik.com.',
  },
  {
    question: 'Les prix sont-ils les memes dans tous les pays?',
    answer: 'Oui, nos prix en FCFA sont uniformes dans toute la zone CFA. Pour les autres pays africains, les prix sont convertis en monnaie locale au taux du jour par CinetPay.',
  },
  {
    question: 'Comment obtenir une facture?',
    answer: 'Une facture est automatiquement generee apres chaque paiement et envoyee a votre adresse email. Vous pouvez egalement telecharger vos factures depuis votre espace client.',
  },
  {
    question: 'Y a-t-il des frais supplementaires?',
    answer: 'Non, les prix affiches sont les prix finaux. Les frais de transaction Mobile Money sont a notre charge. Vous payez uniquement le montant indique.',
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
