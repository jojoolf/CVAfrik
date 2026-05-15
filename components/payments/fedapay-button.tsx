'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  userEmail: string;
  userFirstname: string;
  userLastname: string;
}

export function FedaPayButton({ amount, planId, userEmail, userFirstname, userLastname }: FedaPayButtonProps) {
  
  useEffect(() => {
    // Chargement du script FedaPay Checkout
    const script = document.createElement('script');
    script.src = 'https://checkout.fedapay.com/js/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Nettoyage au démontage
      const s = document.querySelector('script[src="https://checkout.fedapay.com/js/checkout.js"]');
      if (s) s.remove();
    };
  }, []);

  const openFedaPay = () => {
    if ((window as any).FedaPay) {
      (window as any).FedaPay.init({
        public_key: 'pk_live_f6IuF-jRjG05qO764KclO1yY', // Ta clé PUBLIQUE (commence par pk_live)
        transaction: {
          amount: amount,
          description: `Abonnement CVAfrik - Plan ${planId}`,
        },
        customer: {
          firstname: userFirstname || 'Client',
          lastname: userLastname || 'CVAfrik',
          email: userEmail,
        },
        onComplete: (response: any) => {
          if (response.status === 'approved') {
            window.location.href = '/dashboard?payment=success';
          }
        }
      });
      (window as any).FedaPay.open();
    } else {
      console.error('FedaPay script not loaded yet');
    }
  };

  return (
    <Button 
      onClick={openFedaPay} 
      className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 gap-3"
    >
      <CreditCard className="h-6 w-6" />
      Payer par Mobile Money / Carte
    </Button>
  );
}
