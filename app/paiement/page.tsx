"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FedaPayButton } from "@/components/payments/fedapay-button";
import { PLANS } from "@/lib/types";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      try {
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
      } catch (err) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [planId, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-slate-400 font-medium animate-pulse">Sécurisation de la connexion...</p>
        </div>
      </div>
    );
  }

  const selectedPlan = PLANS?.find(p => p.id === planId) || PLANS[1];
  const isAnnual = billing === 'annual';
  const amount = isAnnual 
    ? (selectedPlan.prix_annuel_fcfa || (selectedPlan.id === 'pro' ? 26000 : 65000))
    : (selectedPlan.prix_fcfa || (selectedPlan.id === 'pro' ? 2600 : 6500));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Colonne de Gauche : Résumé de la commande */}
        <div className="p-8 md:p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <Link href="/tarifs" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-12 text-sm font-bold gap-2">
            ← Retour aux tarifs
          </Link>

          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20 mb-6 inline-block">
              Votre Commande
            </span>
            <h1 className="text-4xl font-black mb-2">Plan {selectedPlan.nom}</h1>
            <p className="text-slate-400 text-lg mb-8">Activation instantanée après paiement</p>

            <div className="space-y-4 mb-12">
              {selectedPlan.fonctionnalites.slice(0, 5).map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-800 flex items-end justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total à payer</p>
                <p className="text-4xl font-black">{amount.toLocaleString()} <span className="text-lg text-primary">FCFA</span></p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">TVA incluse</p>
                <div className="flex gap-1">
                  <div className="w-6 h-4 bg-white/10 rounded-sm border border-white/5" />
                  <div className="w-6 h-4 bg-white/10 rounded-sm border border-white/5" />
                  <div className="w-6 h-4 bg-white/10 rounded-sm border border-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de Droite : Options de paiement */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Choisir le mode de paiement</h2>
            <p className="text-slate-500">Sélectionnez votre option préférée pour continuer.</p>
          </div>

          <div className="space-y-6">
            {/* Option FedaPay (Automatique) */}
            <div className="group">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-1">Recommandé & Instantané</p>
              <FedaPayButton 
                amount={amount}
                planId={planId}
                isAnnual={billing === 'annual'}
              />
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-6 opacity-60">
                        <div className="h-6 w-px bg-slate-200" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-4 object-contain grayscale hover:grayscale-0 transition-all cursor-help" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 object-contain grayscale hover:grayscale-0 transition-all cursor-help" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paiements 100% sécurisés par FedaPay</p>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black"><span className="bg-white px-6 text-slate-300">OU</span></div>
            </div>

            {/* Option Transfert Manuel */}
            <Link href={`/paiement/manuel?plan=${planId}${billing === 'annual' ? '&billing=annual' : ''}`}>
              <div className="p-6 rounded-2xl border-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-lg rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Transfert Manuel</p>
                      <p className="text-xs text-slate-500 font-medium">T-Money, Moov, Flooz</p>
                    </div>
                  </div>
                  <Zap size={20} className="text-slate-200 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-4 text-slate-400">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            <p className="text-[10px] leading-relaxed font-medium uppercase tracking-wider">
              Vos informations de paiement sont cryptées et sécurisées. 
              CVAfrik ne stocke aucune donnée bancaire.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const Smartphone = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
