"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, HelpCircle, ArrowRight, ShieldCheck, Zap, Star, ChevronDown } from "lucide-react";

const plans = [
  {
    id: "gratuit",
    name: "Gratuit",
    emoji: "🆓",
    price: "0",
    priceUsd: "0$",
    period: "",
    desc: "Pour découvrir CVAfrik sans engagement.",
    features: [
      "1 CV généré par mois",
      "1 lettre de motivation par mois",
      "Template Classique uniquement",
      "Téléchargement PDF avec filigrane",
    ],
    missing: [
      "Sauvegarde des CVs",
      "Modification après génération",
      "Conseils IA personnalisés",
      "Sans publicités",
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/creer",
    highlight: false,
    color: "slate",
  },
  {
    id: "pro",
    name: "Pro",
    emoji: "🚀",
    price: "1 200",
    priceUsd: "~2$",
    period: "/mois",
    desc: "Pour les candidats sérieux qui veulent se démarquer.",
    badge: "Le plus populaire ⭐",
    features: [
      "CVs illimités chaque mois",
      "Lettres de motivation illimitées",
      "3 templates au choix",
      "PDF sans filigrane",
      "Sauvegarde de tous tes CVs",
      "Modification après génération",
      "Adaptation à une offre d'emploi",
      "Historique complet (dashboard)",
      "Sans publicités",
    ],
    missing: [
      "Conseils IA avancés",
      "Score du CV sur 100",
      "Simulation d'entretien IA",
    ],
    cta: "Passer au Pro — 1 200 FCFA",
    ctaHref: "/paiement?plan=pro",
    highlight: true,
    color: "blue",
  },
  {
    id: "premium",
    name: "Premium",
    emoji: "✨",
    price: "3 000",
    priceUsd: "~5$",
    period: "/mois",
    desc: "L'accès complet pour maximiser tes chances.",
    features: [
      "Tout du plan Pro",
      "5 templates premium exclusifs",
      "Conseils IA personnalisés",
      "Score de ton CV sur 100",
      "Suivi de candidatures intégré",
      "Simulation d'entretien IA",
      "Génération profil LinkedIn",
      "Support prioritaire (24h)",
      "Nouvelles fonctionnalités en avant-première",
    ],
    missing: [],
    cta: "Tout débloquer — 3 000 FCFA",
    ctaHref: "/paiement?plan=premium",
    highlight: false,
    color: "indigo",
  },
];

const paymentMethods = [
  { name: "Moov Money", bg: "bg-blue-600", short: "Moov" },
  { name: "Orange Money", bg: "bg-orange-500", short: "Orange" },
  { name: "Wave", bg: "bg-cyan-400", short: "Wave" },
  { name: "Flooz", bg: "bg-green-500", short: "Flooz" },
  { name: "MTN MoMo", bg: "bg-yellow-400", short: "MTN", textDark: true },
  { name: "Mixx by Yas", bg: "bg-purple-600", short: "Mixx" },
  { name: "VISA / Mastercard", bg: "bg-slate-800", short: "Card" },
];

const faqs = [
  {
    q: "Comment puis-je payer ?",
    a: "Tu peux payer avec Moov Money, Orange Money, Wave, Mixx by Yas, Flooz, MTN MoMo ou par carte bancaire. Le paiement se fait directement depuis ton téléphone, sans carte internationale nécessaire.",
  },
  {
    q: "Est-ce que je peux annuler à tout moment ?",
    a: "Oui, tu peux annuler ton abonnement à tout moment depuis ton tableau de bord. Tu gardes l'accès jusqu'à la fin du mois payé.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Toutes tes informations sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais tes données personnelles.",
  },
  {
    q: "Je suis en dehors du Togo, puis-je utiliser CVAfrik ?",
    a: "Oui ! CVAfrik fonctionne dans toute l'Afrique de l'Ouest et au-delà. Les paiements Mobile Money sont disponibles dans la plupart des pays francophones d'Afrique.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Absolument. Tu peux upgrader ou downgrader ton plan depuis ton tableau de bord. Le changement prend effet immédiatement.",
  },
];

export default function TarifsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── HEADER ── */}
      <section className="relative pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100 dark:from-blue-900/20 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Zap className="w-4 h-4" />
            Simple, transparent, sans surprise
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-tight">
            Des tarifs faits{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              pour l'Afrique
            </span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
            Paye en FCFA avec ton téléphone. Commence gratuitement, évolue selon tes besoins.
          </p>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/30 scale-105 z-10"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-8 flex flex-col flex-grow">
                {/* Plan header */}
                <div className="mb-8">
                  <div className="text-3xl mb-3">{plan.emoji}</div>
                  <h2 className={`text-2xl font-black mb-1 ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    Plan {plan.name}
                  </h2>
                  <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.desc}
                  </p>

                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg font-bold ${plan.highlight ? "text-blue-200" : "text-slate-500"}`}>
                      {plan.price !== "0" ? " FCFA" : " FCFA"}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>{plan.period}</span>
                    )}
                  </div>
                  {plan.priceUsd !== "0$" && (
                    <p className={`text-xs mt-1 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>
                      {plan.priceUsd}/mois · 1 USD ≈ 600 FCFA
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlight ? "bg-white/20" : "bg-emerald-100 dark:bg-emerald-900/30"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-emerald-600"}`} />
                      </div>
                      <span className={`text-sm ${plan.highlight ? "text-blue-50" : "text-slate-700 dark:text-slate-300"}`}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f, i) => (
                    <div key={i} className="flex gap-3 items-start opacity-40">
                      <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                        <X className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className={`text-sm line-through ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-blue-700 hover:bg-blue-50 shadow-xl hover:scale-105"
                      : plan.id === "premium"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-16 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Moyens de paiement acceptés</p>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.name}
                className={`flex items-center gap-2 ${pm.bg} ${pm.textDark ? "text-black" : "text-white"} px-4 py-2 rounded-xl text-sm font-bold shadow-md`}
              >
                {pm.name}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Paiement 100% sécurisé via CinetPay · Activation instantanée</p>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: <ShieldCheck className="w-8 h-8" />, color: "text-emerald-500", title: "100% Sécurisé", desc: "SSL + chiffrement Supabase. Tes données sont en sécurité." },
            { icon: <Zap className="w-8 h-8" />, color: "text-amber-500", title: "Activation instantanée", desc: "Ton plan s'active dès la confirmation du paiement mobile." },
            { icon: <Star className="w-8 h-8" />, color: "text-blue-500", title: "Qualité garantie", desc: "Satisfait ou remboursé sous 7 jours. Sans question." },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`${t.color} mb-4`}>{t.icon}</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <HelpCircle className="w-7 h-7 text-blue-600" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === i ? "border-blue-200 dark:border-blue-800 shadow-md" : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-blue-600" : ""}`}
                  />
                </button>
                <div className={`transition-all duration-300 ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                  <p className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-slate-500 mb-4">Toujours hésitant ?</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
            Commence gratuitement dès maintenant 🎯
          </h3>
          <Link
            href="/creer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-blue-500/25 hover:scale-105 hover:shadow-blue-500/40 transition-all"
          >
            Créer mon CV gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-slate-400 mt-4">Aucune carte requise · Résultat en 5 minutes</p>
        </div>
      </section>
    </div>
  );
}
