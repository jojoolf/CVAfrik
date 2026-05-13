"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function checkUserAndPay() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Rediriger vers la page de connexion si pas de session
        router.push("/login");
        return;
      }

      if (!plan) {
        setError("Aucun plan sélectionné.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            userId: session.user.id,
            userEmail: session.user.email,
            userName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
          }),
        });

        const data = await response.json();

        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          throw new Error(data.error || "Erreur d'initialisation CinetPay");
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    checkUserAndPay();
  }, [plan, router, supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Redirection vers le paiement</h2>
        <p className="text-slate-400 max-w-sm">
          Nous vous connectons à l'interface sécurisée de <strong>CinetPay</strong>...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
        <h2 className="text-2xl font-black text-white mb-3">Erreur de paiement</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <Link 
          href="/tarifs" 
          className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
        >
          Retour aux tarifs
        </Link>
      </div>
    );
  }

  return null;
}

export default function PaiementPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
      <Suspense fallback={<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
