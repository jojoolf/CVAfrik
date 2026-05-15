'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  userEmail: string;
  userFirstname: string;
  userLastname: string;
}

export function FedaPayButton({ amount, planId, userEmail, userFirstname, userLastname }: FedaPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/fedapay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          planId,
          userEmail,
          userFirstname,
          userLastname,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirection vers la page de paiement sécurisée de FedaPay
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Impossible de générer le lien de paiement');
      }
    } catch (error: any) {
      toast.error('Erreur lors de l\'initialisation du paiement : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 gap-3"
    >
      {loading ? (
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
