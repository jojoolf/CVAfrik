'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  isAnnual?: boolean;
}

export function FedaPayButton({ amount, planId, isAnnual }: FedaPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    // Liens vers tes pages de paiement FedaPay réelles
    const links: Record<string, string> = {
      'pro_monthly': 'https://me.fedapay.com/QQieaVUI',
      'pro_annual': 'https://me.fedapay.com/BBcNp6bS',
      'premium_monthly': 'https://me.fedapay.com/TEcHFhRT',
      'premium_annual': 'https://me.fedapay.com/dZShMsdh'
    };

    const key = `${planId}_${isAnnual ? 'annual' : 'monthly'}`;
    const targetLink = links[key] || links['pro_monthly'];
    
    // Redirection directe
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
