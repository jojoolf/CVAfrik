"use client";

import React, { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  User, 
  Calendar, 
  Mail, 
  Save, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    email: "",
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          birth_date: data.birth_date || "",
          email: session.user.email || "",
        });
      } else {
        // Fallback if no profile record yet
        setProfile((prev) => ({ ...prev, email: session.user.email || "" }));
      }
      setLoading(false);
    }

    getProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("users")
      .upsert({
        id: session.user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birth_date,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour au tableau de bord
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black mb-2">Mon Profil</h1>
            <p className="text-slate-400 text-sm">Gérez vos informations personnelles qui apparaîtront sur vos CV.</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: Amina"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: Coulibaly"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date de naissance</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="date" 
                  value={profile.birth_date}
                  onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email (Lecture seule)</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Données sécurisées par Supabase
            </div>
            
            <button 
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] ${
                success 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-slate-900 hover:bg-blue-50 shadow-xl shadow-white/5"
              }`}
            >
              {saving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Enregistré !
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Card */}
        <div className="mt-12 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-blue-400 mb-1">Pourquoi remplir mon profil ?</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ces informations sont automatiquement insérées dans vos nouveaux CV pour vous faire gagner du temps. 
              Vous pourrez toujours les modifier individuellement pour chaque CV généré.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
