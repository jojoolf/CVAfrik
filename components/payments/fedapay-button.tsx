'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
}

export function FedaPayButton({ amount, planId }: FedaPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    // Liens vers tes pages de paiement FedaPay personnalisées
    const links: Record<string, string> = {
      'pro': 'https://me.fedapay.com/QQieaVUI', // Ton lien pour 2600 FCFA
      'premium': 'https://me.fedapay.com/L-vS7A76' // Ton lien pour 6500 FCFA (à vérifier)
    };

    const targetLink = links[planId] || links['pro'];
    
    // Redirection directe vers la page de paiement sécurisée
    window.location.href = targetLink;
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-[#00875A] hover:bg-[#00704A] text-white font-black text-lg shadow-xl shadow-emerald-900/10 gap-3 border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 transition-all"
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
