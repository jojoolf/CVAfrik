"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  User, 
  CreditCard, 
  Loader2,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ADMIN_EMAILS = ["nokejoel@gmail.com", "jojoolf@gmail.com"];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const fetchPayments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    setIsAdmin(true);

    const { data, error } = await supabase
      .from("manual_payments")
      .select(`
        *,
        profiles (
          email,
          nom,
          prenom,
          plan_expiry
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors de la récupération des paiements");
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (payment: any) => {
    setProcessingId(payment.id);
    try {
      const response = await fetch("/api/admin/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          userId: payment.user_id,
          planId: payment.plan_id
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Paiement validé avec succès !");
        fetchPayments();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error("Erreur: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <XCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-black text-slate-900">Accès Refusé</h1>
          <p className="text-slate-500">Vous n'avez pas les droits pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-2">
              <ShieldCheck size={14} /> Administration
            </div>
            <h1 className="text-4xl font-black text-slate-900">Gestion des Paiements</h1>
          </div>
          <Button onClick={fetchPayments} variant="outline" className="rounded-xl font-bold gap-2">
            <RefreshCw size={18} /> Actualiser
          </Button>
        </header>

        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-200">
              <Clock size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Aucune demande de paiement pour le moment.</p>
            </div>
          ) : (
            payments.map((p) => (
              <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    p.plan_id === 'premium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-900">{p.profiles?.prenom} {p.profiles?.nom}</span>
                      <span className="text-slate-400 text-xs">• {p.profiles?.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                        Plan: {p.plan_id}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        {p.montant} FCFA
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        Via {p.methode}
                      </span>
                      {p.statut === 'valide' && p.profiles?.plan_expiry && (
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                          Expire le: {new Date(p.profiles.plan_expiry).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 font-mono text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      ID Transaction: {p.transaction_id || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {p.statut === 'en_attente' ? (
                    <Button 
                      onClick={() => handleApprove(p)}
                      disabled={processingId === p.id}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl px-8 h-14 shadow-lg shadow-emerald-500/20"
                    >
                      {processingId === p.id ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                      Approuver
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-6 py-4 rounded-2xl font-black text-sm border border-emerald-100">
                      <CheckCircle2 size={18} /> Validé
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
