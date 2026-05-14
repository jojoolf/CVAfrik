"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkUserAndPay() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/auth/connexion?redirect=/paiement?plan=${plan}`);
        return;
      }

      if (!plan) {
        setError("Plan non spécifié.");
        setLoading(false);
        return;
      }

      // Rediriger directement vers le paiement manuel pour éviter les erreurs d'API non configurées
      const billingParam = searchParams.get("billing") ? `&billing=${searchParams.get("billing")}` : "";
      router.push(`/paiement/manuel?plan=${plan}${billingParam}`);
      return;
    }

    checkUserAndPay();
  }, [plan, router, supabase]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4">Oups ! Une erreur est survenue</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-slate-900 text-white py-6 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
              <Link href={`/paiement/manuel?plan=${plan}${searchParams.get("billing") ? `&billing=${searchParams.get("billing")}` : ""}`}>
                Payer manuellement (Wave / T-Money)
              </Link>
            </Button>
            <Link 
              href="/tarifs" 
              className="text-slate-400 py-3 font-bold text-sm hover:text-slate-900 transition-colors"
            >
              Retour aux tarifs
            </Link>
            <Link 
              href="/dashboard" 
              className="text-slate-500 py-3 font-bold text-sm hover:text-slate-900 transition-colors"
            >
              Aller au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 relative mb-10">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
          <CreditCard className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 mb-4">Préparation du paiement</h1>
      <p className="text-slate-500 max-w-sm mb-12 leading-relaxed">
        Nous vous redirigeons vers l'interface sécurisée de <span className="font-bold text-slate-900">FedaPay</span> pour finaliser votre abonnement <span className="text-primary font-bold">{plan}</span>.
      </p>

      <div className="flex items-center gap-4 text-slate-400 bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm mb-12 animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="font-bold text-sm uppercase tracking-widest">Connexion sécurisée...</span>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
        <ShieldCheck size={14} />
        Paiement Mobile Money Sécurisé
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
