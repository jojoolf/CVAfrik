'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function FedaPayButton({ amount, planId, userEmail, userFirstname, userLastname }: any) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    
    // On essaie d'utiliser le CDN directement au moment du clic
    const script = document.createElement('script');
    script.src = "https://checkout.fedapay.com/js/checkout.js";
    script.onload = () => {
      try {
        const fp = (window as any).FedaPay;
        fp.init({
          public_key: 'pk_live_VxEEX9aYyVsaVSMQH4vdCgmx', // Ta clé publique
          transaction: {
            amount: amount,
            description: `Plan ${planId}`
          },
          customer: {
            email: userEmail,
            firstname: userFirstname,
            lastname: userLastname
          }
        });
        fp.open();
      } catch (e) {
        toast.error("Erreur d'initialisation FedaPay.");
      } finally {
        setLoading(false);
      }
    };
    script.onerror = () => {
      toast.error("Impossible de charger le script de paiement.");
      setLoading(false);
    };
    document.body.appendChild(script);
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg gap-3"
    >
      {loading ? <Loader2 className="animate-spin" /> : <><CreditCard /> Payer par Mobile Money / Carte</>}
    </Button>
  );
}
