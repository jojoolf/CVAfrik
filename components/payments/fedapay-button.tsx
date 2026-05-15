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
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      /* 
        On utilise le lien de paiement direct de FedaPay.
        C'est la solution la plus robuste qui existe.
      */
      const baseUrl = "https://checkout.fedapay.com/pay";
      const publicKey = "pk_live_VxEEX9aYyVsaVSMQH4vdCgmx";
      
      const params = new URLSearchParams({
        public_key: publicKey,
        amount: amount.toString(),
        description: `Abonnement CVAfrik - Plan ${planId}`,
        currency: "XOF",
        callback_url: `${window.location.origin}/dashboard?payment=success`,
        cancel_url: window.location.href,
        "customer[firstname]": userFirstname || 'Client',
        "customer[lastname]": userLastname || 'CVAfrik',
        "customer[email]": userEmail,
      });

      // Redirection directe
      window.location.href = `${baseUrl}?${params.toString()}`;
    } catch (error: any) {
      toast.error("Erreur lors de l'ouverture du paiement.");
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
