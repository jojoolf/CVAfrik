'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  userEmail: string;
  userFirstname: string;
  userLastname: string;
}

export function FedaPayButton({ amount, planId, userEmail, userFirstname, userLastname }: FedaPayButtonProps) {
  const [isOpening, setIsOpening] = useState(false);

  const openFedaPay = () => {
    setIsOpening(true);
    
    try {
      const FedaPay = (window as any).FedaPay;

      if (FedaPay) {
        FedaPay.init({
          public_key: 'pk_live_VxEEX9aYyVsaVSMQH4vdCgmx',
          transaction: {
            amount: amount,
            description: `Abonnement CVAfrik - Plan ${planId}`
          },
          customer: {
            firstname: userFirstname || 'Client',
            lastname: userLastname || 'CVAfrik',
            email: userEmail
          }
        });
        FedaPay.open();
      } else {
        // Si le script n'est pas chargé, on tente de le charger dynamiquement
        const script = document.createElement('script');
        script.src = "https://checkout.fedapay.com/js/checkout.js";
        script.onload = () => {
          const FP = (window as any).FedaPay;
          FP.init({
            public_key: 'pk_live_VxEEX9aYyVsaVSMQH4vdCgmx',
            transaction: {
              amount: amount,
              description: `Abonnement CVAfrik - Plan ${planId}`
            },
            customer: {
              firstname: userFirstname || 'Client',
              lastname: userLastname || 'CVAfrik',
              email: userEmail
            }
          });
          FP.open();
        };
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error("FedaPay Error:", error);
      toast.error("Erreur technique. Veuillez rafraîchir la page.");
    } finally {
      setTimeout(() => setIsOpening(false), 2000);
    }
  };

  return (
    <Button 
      onClick={openFedaPay} 
      disabled={isOpening}
      className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 gap-3"
    >
      {isOpening ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <CreditCard className="h-6 w-6" />
          Payer par Mobile Money / Carte
        </>
      )}
    </Button>
  );
}
