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
      if (typeof window !== 'undefined' && (window as any).FedaPay) {
        const fp = (window as any).FedaPay;
        
        fp.init({
          public_key: 'pk_live_VxEEX9aYyVsaVSMQH4vdCgmx',
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
        
        fp.open();
      } else {
        toast.error("Le système de paiement charge encore, veuillez réessayer dans 2 secondes.");
      }
    } catch (error) {
      console.error("FedaPay Error:", error);
      toast.error("Impossible d'ouvrir la fenêtre de paiement.");
    } finally {
      setIsOpening(false);
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
