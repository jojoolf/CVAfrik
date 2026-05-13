"use client";

import React, { useState } from "react";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Layout, Grid, List, Sparkles, ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const mockData = {
  profile: {
    first_name: "Amina",
    last_name: "Coulibaly",
    title: "Juriste d'Affaires Senior",
    email: "amina.coulibaly@email.com",
    phone: "+228 90 00 00 00",
    address: "Lomé, Togo",
    summary: "Juriste passionnée avec plus de 8 ans d'expérience dans le conseil juridique aux entreprises en Afrique de l'Ouest. Spécialisée en droit OHADA, contrats commerciaux et conformité réglementaire. Excellente capacité d'analyse et de négociation.",
  },
  experiences: [
    {
      company: "Cabinet Juridique & Co",
      role: "Responsable Juridique",
      period: "2019 - Présent",
      description: "• Supervision de la conformité légale pour plus de 50 clients corporatifs.\n• Rédaction et négociation de contrats complexes internationaux.\n• Gestion des litiges commerciaux et représentation devant les tribunaux.",
    },
    {
      company: "Africa Bank Group",
      role: "Conseiller Juridique Junior",
      period: "2015 - 2019",
      description: "• Revue des garanties bancaires et des contrats de prêt.\n• Veille juridique sur les évolutions réglementaires de la BCEAO.\n• Support au secrétariat du conseil d'administration.",
    },
  ],
  education: [
    {
      school: "Université de Lomé",
      degree: "Master 2 en Droit des Affaires",
      year: "2015",
    },
    {
      school: "Université de Dakar",
      degree: "Licence en Droit Privé",
      year: "2013",
    },
  ],
  skills: ["Droit OHADA", "Contrats Internationaux", "Négociation", "Arbitrage", "Conformité", "Anglais Juridique"],
};

const templates = [
  { id: "classic", name: "Classique Professional", component: ClassicTemplate, desc: "Sobre, élégant et intemporel." },
  { id: "modern", name: "Modern Sidebar", component: ModernTemplate, desc: "Contemporain, dynamique et structuré." },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const ActiveTemplate = selectedTemplate.component;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                <Sparkles size={16} /> Nos Templates
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Choisissez votre style</h1>
              <p className="text-muted-foreground leading-relaxed">
                Chaque template a été validé par des experts RH pour maximiser vos chances de recrutement en Afrique de l'Ouest.
              </p>
            </div>

            <div className="flex bg-muted p-1.5 rounded-2xl border border-border">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                    selectedTemplate.id === t.id 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Controls Panel */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-muted/30 border border-border rounded-3xl p-8">
                <h3 className="font-black text-foreground mb-6 flex items-center gap-2">
                  <Layout size={18} className="text-primary" /> Options
                </h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between h-14 rounded-2xl group border-border/60">
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm font-bold">Exporter PDF</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between h-14 rounded-2xl group border-border/60">
                    <div className="flex items-center gap-3">
                      <Eye size={18} className="text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm font-bold">Mode Aperçu</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-2xl shadow-primary/20">
                <h4 className="font-black mb-2">Plan Premium</h4>
                <p className="text-primary-foreground/80 text-xs mb-6 leading-relaxed">
                  Débloquez 5 autres templates exclusifs et le scoring IA en passant au plan Premium.
                </p>
                <Button variant="secondary" className="w-full font-black text-xs h-11" asChild>
                  <Link href="/tarifs">Mettre à niveau</Link>
                </Button>
              </div>
            </aside>

            {/* Preview Panel */}
            <div className="lg:col-span-9">
              <div className="bg-muted/20 border border-border rounded-[2.5rem] p-4 md:p-12 overflow-hidden shadow-sm">
                <div className="flex justify-center mb-8">
                  <div className="bg-muted p-1 rounded-xl flex border border-border">
                    <button 
                      onClick={() => setViewMode("desktop")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      <Grid size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode("mobile")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-500 mx-auto ${viewMode === "mobile" ? "max-w-[400px]" : "max-w-[800px]"}`}>
                  <div className="transform scale-[0.6] md:scale-100 origin-top">
                    <ActiveTemplate data={mockData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
