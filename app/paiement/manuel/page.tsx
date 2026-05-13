"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Copy, 
  Send,
  Loader2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function ManualPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "pro";
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");

  const amount = planId === "premium" ? "3 000" : "1 200";

  const paymentMethods = [
    { id: "tmoney", name: "T-Money", number: "+228 XX XX XX XX", color: "bg-yellow-400", text: "text-black" },
    { id: "flooz", name: "Moov Money", number: "+228 XX XX XX XX", color: "bg-blue-600", text: "text-white" },
    { id: "wave", name: "Wave", number: "+228 XX XX XX XX", color: "bg-cyan-400", text: "text-white" },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Numéro copié !");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !transactionId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Veuillez vous connecter.");
      return;
    }

    try {
      const { error } = await supabase.from("manual_payments").insert({
        user_id: user.id,
        plan_id: planId,
        montant: planId === "premium" ? 3000 : 1200,
        methode: method,
        transaction_id: transactionId,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error("Une erreur est survenue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4">Demande Envoyée !</h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-sm">
            Merci ! Votre paiement est en cours de vérification. Votre plan sera activé dans les 15 à 30 prochaines minutes.
          </p>
          <Button asChild className="w-full py-6 rounded-2xl font-black shadow-xl shadow-slate-900/10">
            <Link href="/dashboard">Aller au tableau de bord</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <Link href="/tarifs" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-bold text-sm">
          <ArrowLeft size={16} /> Retour
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Paiement Mobile Money</h1>
          <p className="text-slate-500 text-sm">Suivez les étapes ci-dessous pour activer votre plan <span className="font-bold text-primary uppercase">{planId}</span>.</p>
        </header>

        {/* Step 1: Transfer */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">1</div>
            <h2 className="font-black text-slate-900">Effectuez le transfert</h2>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Montant à payer :</span>
              <span className="text-xl font-black text-slate-900">{amount} FCFA</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${pm.color} rounded-xl flex items-center justify-center font-black ${pm.text} text-[10px]`}>
                      {pm.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{pm.name}</div>
                      <div className="font-bold text-slate-900">{pm.number}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(pm.number)}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-all"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Confirm */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">2</div>
            <h2 className="font-black text-slate-900">Confirmez votre paiement</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400 ml-1">Méthode utilisée</Label>
              <div className="grid grid-cols-3 gap-2">
                {["T-Money", "Moov", "Wave"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-3 rounded-xl text-xs font-black transition-all border ${
                      method === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="txid" className="text-xs font-black uppercase text-slate-400 ml-1">ID de transaction (ou votre numéro)</Label>
              <Input
                id="txid"
                placeholder="Ex: 0123456789"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 mt-4"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
              Confirmer le paiement
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4 text-slate-400">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[11px] leading-relaxed font-medium italic">
              Toute fausse déclaration entraînera le blocage définitif de votre compte. Nous vérifions chaque transaction manuellement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <ManualPaymentContent />
    </Suspense>
  );
}
