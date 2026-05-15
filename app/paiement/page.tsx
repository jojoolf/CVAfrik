"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FedaPayButton } from "@/components/payments/fedapay-button";
import { PLANS } from "@/lib/types";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/auth/connexion?redirect=/paiement?plan=${planId}`);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUserData({
        email: session.user.email,
        firstname: profile?.prenom || '',
        lastname: profile?.nom || '',
      });

      if (!planId) {
        setError("Plan non spécifié.");
      }
      setLoading(false);
    }

    checkUser();
  }, [planId, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const selectedPlan = PLANS?.find(p => p.id === planId) || null;
  const amount = (selectedPlan && billing === 'annual') 
    ? (selectedPlan.prix_annuel_fcfa || 0) 
    : (selectedPlan?.prix_fcfa || 0);

  if (error || !selectedPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4">Oups ! Une erreur est survenue</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">{error || "Plan invalide"}</p>
          <Button asChild className="w-full">
            <Link href="/tarifs">Retour aux tarifs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CreditCard size={32} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">Finalisez votre commande</h1>
        <p className="text-slate-500 mb-8">
          Vous avez choisi le plan <span className="text-primary font-bold">{selectedPlan.nom}</span> ({amount.toLocaleString()} FCFA)
        </p>

        <div className="space-y-4 mb-8">
          <FedaPayButton 
            amount={amount}
            planId={planId as string}
            userEmail={userData.email}
            userFirstname={userData.firstname}
            userLastname={userData.lastname}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-white px-4 text-slate-300">Ou</span></div>
          </div>

          <Button variant="outline" asChild className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
            <Link href={`/paiement/manuel?plan=${planId}${billing === 'annual' ? '&billing=annual' : ''}`}>
              Payer par transfert manuel (Wave, T-Money)
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
          <ShieldCheck size={16} />
          Paiement 100% sécurisé via FedaPay
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
