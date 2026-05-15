'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  isAnnual?: boolean;
  variant?: 'mobile' | 'card';
}

export function FedaPayButton({ amount, planId, isAnnual, variant = 'mobile' }: FedaPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    // Redirection vers le manuel si > 20k
    if (amount >= 20000) {
      window.location.href = `/paiement/manuel?plan=${planId}&billing=annual`;
      return;
    }

    const links: Record<string, string> = {
      'pro_monthly': 'https://me.fedapay.com/QQieaVUI',
      'pro_annual': 'https://me.fedapay.com/BBcNp6bS',
      'premium_monthly': 'https://me.fedapay.com/TEcHFhRT',
      'premium_annual': 'https://me.fedapay.com/dZShMsdh'
    };

    const key = `${planId}_${isAnnual ? 'annual' : 'monthly'}`;
    const targetLink = links[key] || links['pro_monthly'];
    
    window.location.href = targetLink;
  };

  if (variant === 'card') {
    return (
      <Button 
        onClick={handleClick} 
        disabled={loading}
        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl gap-3 transition-all border-b-4 border-slate-700 active:border-b-0 active:translate-y-1"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><CreditCard className="h-6 w-6" /> Payer par Carte Bancaire</>}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-[#00875A] hover:bg-[#00704A] text-white font-black text-lg shadow-xl gap-3 transition-all border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1"
    >
      {loading ? <Loader2 className="animate-spin" /> : <><Smartphone className="h-6 w-6" /> Payer par Mobile Money</>}
    </Button>
  );
}
