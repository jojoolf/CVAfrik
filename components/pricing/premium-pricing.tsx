"use client";

import React, { useState } from "react";
import { Check, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PremiumPricingProps {
  user?: any;
}

export function PremiumPricing({ user }: PremiumPricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: "🌱",
      tagline: "Pour découvrir CVAfrik et créer ton premier CV",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: "2 CV par mois", active: true },
        { text: "3 templates basiques", active: true },
        { text: "Export PDF (avec watermark)", active: true },
        { text: "Score ATS basique", active: true },
        { text: "3 simulations d'entretien/mois", active: true },
        { text: "Accès aux offres de stages", active: true },
        { text: "Suggestions IA avancées", active: false },
        { text: "Matching CV ↔ offre", active: false },
        { text: "Traduction anglais/français", active: false },
        { text: "Mini-cours vidéo", active: false },
      ],
      cta: "Commencer gratuitement",
      variant: "outline" as const,
    },
    {
      id: "pro",
      name: "Career Pro",
      icon: "🚀",
      tagline: "Pour décrocher ton stage ou premier emploi rapidement",
      monthlyPrice: 3.99,
      annualPrice: 3.32,
      popular: true,
      features: [
        { text: "CV illimités", active: true },
        { text: "45+ templates premium", active: true, badge: "NOUVEAU" },
        { text: "Export PDF sans watermark", active: true },
        { text: "Score ATS détaillé + conseils", active: true },
        { text: "Simulateur entretien illimité", active: true },
        { text: "Coaching IA après entretien", active: true },
        { text: "Matching CV ↔ offre d'emploi", active: true },
        { text: "Traduction anglais/français", active: true },
        { text: "Toutes les offres de stages", active: true },
        { text: "Mini-cours vidéo soft skills", active: true },
      ],
      cta: "Passer au Pro →",
      variant: "primary" as const,
    },
    {
      id: "business",
      name: "Business",
      icon: "🏛️",
      tagline: "Pour les universités, écoles et coachs carrière",
      monthlyPrice: 9.99,
      annualPrice: 8.32,
      features: [
        { text: "Tout le plan Pro inclus", active: true },
        { text: "Gestion multi-profils étudiants", active: true },
        { text: "Dashboard de suivi", active: true },
        { text: "Templates avec logo école", active: true, badge: "CUSTOM" },
        { text: "Rapport mensuel des progrès", active: true },
        { text: "Support prioritaire WhatsApp", active: true },
        { text: "Accès anticipé aux nouveautés", active: true },
        { text: "Onboarding personnalisé", active: true },
        { text: "API access", active: false },
        { text: "Intégration LMS école", active: false },
      ],
      cta: "Contacter l'équipe →",
      variant: "gold" as const,
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === "starter") {
      window.location.href = "/auth/inscription";
      return;
    }
    if (planId === "business") {
      window.location.href = "mailto:contact@cvafrik.com";
      return;
    }
    setLoadingPlan(planId);
    window.location.href = `/paiement?plan=${planId}${isAnnual ? '&billing=annual' : ''}`;
  };

  return (
    <div className="bg-[#0A0F0D] text-[#E8F0E9] min-h-screen font-sans selection:bg-[#00C853]/30">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(0,200,83,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(255,179,0,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <Badge variant="outline" className="mb-8 px-4 py-1.5 rounded-full border-[#00C853]/20 bg-[#00C853]/5 text-[#00C853] font-medium tracking-wide">
            Tarifs simples et transparents
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-syne">
            Investis dans <br />
            <span className="text-[#00C853]">ta carrière</span>
          </h1>
          <p className="text-[#6B8070] text-lg max-w-lg mx-auto mb-12 font-light leading-relaxed">
            Commence gratuitement. Passe au Pro quand tu es prêt. Aucune surprise, aucun engagement.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-[#151C16] border border-[#1E2B20] p-1.5 rounded-full shadow-2xl">
            <button 
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm transition-all",
                !isAnnual ? "bg-[#00C853] text-[#0A0F0D] font-bold" : "text-[#6B8070]"
              )}
            >
              Mensuel
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 py-2 rounded-full text-sm transition-all flex items-center gap-2",
                isAnnual ? "bg-[#00C853] text-[#0A0F0D] font-bold" : "text-[#6B8070]"
              )}
            >
              Annuel
              <span className="bg-[#FFB300]/20 text-[#FFB300] text-[10px] px-2 py-0.5 rounded-full border border-[#FFB300]/20">-2 mois</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "group relative bg-[#151C16] border border-[#1E2B20] rounded-[2rem] p-8 transition-all hover:translate-y-[-8px] flex flex-col",
                plan.popular && "border-[#00C853]/30 bg-gradient-to-br from-[#162018] to-[#111712] shadow-2xl shadow-[#00C853]/5"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C853] text-[#0A0F0D] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  ⭐ Le plus populaire
                </div>
              )}

              <div className="text-3xl mb-4 bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5">
                {plan.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#6B8070] mb-2">{plan.name}</h3>
              <p className="text-sm font-light text-[#E8F0E9] mb-8 leading-relaxed h-10">{plan.tagline}</p>

              <div className="mb-8 pb-8 border-b border-[#1E2B20]">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold font-syne tracking-tighter">
                    {plan.id === 'starter' ? '0' : (
                      <>
                        <span className="text-xl align-top mt-2 inline-block">€</span>
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </>
                    )}
                  </span>
                  <span className="text-[#6B8070] text-sm">/mois</span>
                </div>
                {isAnnual && plan.monthlyPrice > 0 && (
                  <p className="text-[10px] text-[#FFB300] mt-2 font-bold uppercase tracking-wider">
                    Facturé {(plan.annualPrice * 12).toFixed(2)}€/an — 2 mois offerts
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature: any, idx) => (
                  <li key={idx} className={cn("flex items-start gap-3 text-sm transition-opacity", feature.active ? "text-[#E8F0E9]" : "text-[#1E2B20] opacity-40")}>
                    {feature.active ? (
                      <Check size={16} className="text-[#00C853] mt-0.5 shrink-0" />
                    ) : (
                      <span className="text-lg leading-none mt-[-2px] shrink-0">×</span>
                    )}
                    <span className="flex items-center gap-2">
                      {feature.text}
                      {feature.badge && (
                        <span className="text-[9px] font-black bg-[#FFB300]/10 text-[#FFB300] px-1.5 py-0.5 rounded border border-[#FFB300]/20">
                          {feature.badge}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan === plan.id}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold transition-all",
                  plan.variant === 'primary' ? "bg-[#00C853] hover:bg-[#00A846] text-[#0A0F0D] shadow-xl shadow-[#00C853]/20" : 
                  plan.variant === 'gold' ? "bg-transparent border border-[#FFB300]/30 text-[#FFB300] hover:bg-[#FFB300]/10" :
                  "bg-transparent border border-[#1E2B20] text-[#E8F0E9] hover:border-[#00C853]/30 hover:text-[#00C853]"
                )}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  plan.cta
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mb-32">
          <p className="text-[#6B8070] text-sm font-medium">
            ✅ Pas de carte bancaire requise pour le plan gratuit · 
            <span className="text-[#00C853]"> Annulation à tout moment</span> · Paiement sécurisé
          </p>
        </div>

        {/* FAQ Preview */}
        <section className="max-w-4xl mx-auto mb-32">
          <h2 className="text-3xl font-bold text-center mb-12 font-syne tracking-tight">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "Puis-je annuler à tout moment ?", a: "Oui, sans frais ni engagement. Tu reviens automatiquement sur le plan gratuit à la fin de ta période." },
              { q: "C'est quoi le Score ATS ?", a: "Les recruteurs utilisent des logiciels qui filtrent les CV avant même de les lire. Le Score ATS te dit si ton CV passe ce filtre." },
              { q: "Le plan Business, c'est pour qui ?", a: "Pour les universités, écoles, incubateurs, et coachs carrière qui veulent offrir CVAfrik à leurs étudiants." },
              { q: "Quels modes de paiement ?", a: "Carte bancaire via Stripe, et Mobile Money (Orange Money, MTN) via CinetPay." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#151C16] border border-[#1E2B20] p-8 rounded-3xl">
                <h4 className="font-bold text-sm mb-2 text-[#E8F0E9] font-syne">{faq.q}</h4>
                <p className="text-xs text-[#6B8070] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-[#00C853]/10 to-transparent border border-[#00C853]/20 p-12 md:p-20 rounded-[3rem] text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-syne tracking-tighter">Prêt à décrocher ton <br /> prochain poste ? 🎯</h2>
          <p className="text-[#6B8070] mb-10 max-w-md mx-auto">Rejoins des milliers de jeunes africains qui construisent leur carrière avec CVAfrik</p>
          <Button asChild size="lg" className="bg-[#00C853] text-[#0A0F0D] h-16 px-10 rounded-2xl font-black text-lg hover:scale-105 transition-transform">
            <Link href="/auth/inscription">Créer mon CV gratuitement</Link>
          </Button>
        </div>

        <footer className="mt-32 pt-10 border-t border-[#1E2B20] text-center">
          <p className="text-[#6B8070] text-xs uppercase tracking-widest">
            © 2025 <span className="text-[#00C853] font-bold">CVAfrik</span> · Fait avec ❤️ pour la jeunesse africaine
          </p>
        </footer>
      </div>

      <style jsx>{`
        .font-syne {
          font-family: 'Syne', sans-serif;
        }
      `}</style>
    </div>
  );
}

