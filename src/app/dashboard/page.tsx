"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  CreditCard, 
  Plus, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);
      setLoading(false);
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.01] backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">CV</span>
            </div>
            <span className="text-lg font-black tracking-tight">Afrik</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {[
            { icon: <LayoutDashboard size={18} />, label: "Dashboard", active: true, href: "/dashboard" },
            { icon: <FileText size={18} />, label: "Mes CVs", href: "/mes-cvs" },
            { icon: <CreditCard size={18} />, label: "Mon Plan", href: "/tarifs" },
            { icon: <Settings size={18} />, label: "Paramètres", href: "/settings" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span className="font-bold text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black mb-1">Tableau de Bord</h1>
            <p className="text-slate-500 text-sm">Gérez vos CVs et votre profil professionnel.</p>
          </div>
          <Link
            href="/creer"
            className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} />
            Nouveau CV
          </Link>
        </header>

        {/* Welcome Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-125" />
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-md border border-white/20 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <Sparkles size={12} className="text-yellow-300" />
                Plan Gratuit
              </div>
              <h2 className="text-2xl font-black mb-3">Besoin d'un CV plus Pro ?</h2>
              <p className="text-blue-100 text-sm mb-6 max-w-sm leading-relaxed">
                Débloquez tous les templates premium et le scoring IA pour maximiser vos chances de recrutement.
              </p>
              <Link
                href="/tarifs"
                className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-black text-xs inline-flex items-center gap-2 hover:bg-blue-50 transition-all"
              >
                Passer au Pro
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black mb-1">0</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">CV créés</div>
            <Link href="/creer" className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
              Commencer <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={24} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-bold mb-2">Pas encore de CV</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-8">
            Utilisez notre assistant IA pour créer votre premier CV professionnel en moins de 5 minutes.
          </p>
          <Link
            href="/creer"
            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
          >
            Créer mon premier CV
          </Link>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Shield size={14} className="text-emerald-500" />
            Données Chiffrées
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            © 2026 CVAfrik
          </div>
        </footer>
      </main>
    </div>
  );
}
