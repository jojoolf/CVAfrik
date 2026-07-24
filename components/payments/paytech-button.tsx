'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface PayTechButtonProps {
  amount: number;
  planId: string;
  isAnnual?: boolean;
  variant?: 'mobile' | 'card';
}

export function PayTechButton({ amount, planId, isAnnual, variant = 'mobile' }: PayTechButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/payment/paytech/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          planId: planId,
          durationId: isAnnual ? 'annual' : '1m',
          durationLabel: isAnnual ? '1 An' : '1 Mois',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Erreur lors de l\'initialisation PayTech');
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error('PayTech initiation error:', err);
      toast.error(err.message || 'Erreur de connexion à PayTech.');
      setLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <Button 
        onClick={handleClick} 
        disabled={loading}
        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl gap-3 transition-all border-b-4 border-slate-700 active:border-b-0 active:translate-y-1"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><CreditCard className="h-6 w-6" /> Payer par Carte Bancaire (PayTech)</>}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-[#00875A] hover:bg-[#00704A] text-white font-black text-lg shadow-xl gap-3 transition-all border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1"
    >
      {loading ? <Loader2 className="animate-spin" /> : <><Smartphone className="h-6 w-6" /> Payer par Mobile Money (PayTech)</>}
    </Button>
  );
}
