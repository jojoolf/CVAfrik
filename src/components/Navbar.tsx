"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, User } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm">CV</span>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white">Afrik</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Accueil</Link>
          <Link href="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</Link>
          <Link href="/tarifs" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tarifs</Link>
          {user && (
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link 
              href="/settings"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors px-3 py-2"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              Profil
            </Link>
          ) : (
            <Link 
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors px-3 py-2"
            >
              Connexion
            </Link>
          )}
          <Link
            href="/creer"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Créer mon CV
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-slate-700 dark:text-slate-200"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-6 flex flex-col gap-4">
          <Link href="/" className="text-slate-700 dark:text-slate-300 font-medium" onClick={() => setOpen(false)}>Accueil</Link>
          <Link href="/templates" className="text-slate-700 dark:text-slate-300 font-medium" onClick={() => setOpen(false)}>Templates</Link>
          <Link href="/tarifs" className="text-slate-700 dark:text-slate-300 font-medium" onClick={() => setOpen(false)}>Tarifs</Link>
          {user && (
            <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
          )}
          <hr className="border-slate-200 dark:border-slate-800" />
          {user ? (
            <Link 
              href="/settings" 
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-left"
              onClick={() => setOpen(false)}
            >
              Mon Profil
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-left"
              onClick={() => setOpen(false)}
            >
              Connexion
            </Link>
          )}
          <Link
            href="/creer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold"
            onClick={() => setOpen(false)}
          >
            <Sparkles className="w-4 h-4" />
            Créer mon CV gratuitement
          </Link>
        </div>
      )}
    </nav>
  );
}
