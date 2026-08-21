'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface FedaPayButtonProps {
  amount: number;
  planId: string;
  isAnnual?: boolean;
  variant?: 'mobile' | 'card';
}

export function FedaPayButton({ amount, planId, isAnnual, variant = 'mobile' }: FedaPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/fedapay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billing: isAnnual ? 'annual' : 'monthly',
          amount,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/auth/connexion?redirect=${encodeURIComponent(`/paiement?plan=${planId}${isAnnual ? '&billing=annual' : ''}`)}`)
          return
        }

        toast.error(data.error || data.message || 'Impossible de lancer le paiement')
        return
      }

      if (!data?.url) {
        toast.error('Lien de paiement FedaPay introuvable')
        return
      }

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
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
