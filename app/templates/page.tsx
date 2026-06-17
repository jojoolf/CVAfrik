"use client";

import React, { useState } from "react";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import { CVPreviewPremiumFinance } from "@/components/cv-builder/templates/cv-preview-premium-finance";
import { CVPreviewPremiumTech } from "@/components/cv-builder/templates/cv-preview-premium-tech";
import { CVPreviewPremiumMarketing } from "@/components/cv-builder/templates/cv-preview-premium-marketing";
import { CVPreviewPremiumStudent } from "@/components/cv-builder/templates/cv-preview-premium-student";
import { CVPreviewPremiumExecutive } from "@/components/cv-builder/templates/cv-preview-premium-executive";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Layout, Grid, List, Sparkles, ChevronLeft, ChevronRight, Download, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CVDonnees } from "@/lib/types";

const mockDataLegacy = {
  profile: {
    first_name: "Amina",
    last_name: "Coulibaly",
    title: "Juriste d'Affaires Senior",
    email: "amina.coulibaly@email.com",
    phone: "+228 90 00 00 00",
    address: "Lomé, Togo",
    summary: "Juriste passionnée avec plus de 8 ans d'expérience dans le conseil juridique aux entreprises en Afrique. Spécialisée en droit OHADA, contrats commerciaux et conformité réglementaire. Excellente capacité d'analyse et de négociation.",
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

const mockDataV2: CVDonnees = {
  informations_personnelles: {
    prenom: "Amina",
    nom: "Coulibaly",
    email: "amina.coulibaly@email.com",
    telephone: "+228 90 00 00 00",
    adresse: "Lomé, Togo",
    linkedin: "linkedin.com/in/amina-coulibaly",
  },
  titre_professionnel: "Juriste d'Affaires Senior",
  resume: "Juriste passionnée avec plus de 8 ans d'expérience dans le conseil juridique aux entreprises en Afrique. Spécialisée en droit OHADA, contrats commerciaux et conformité réglementaire. Excellente capacité d'analyse et de négociation.",
  experiences: [
    {
      id: "1",
      poste: "Responsable Juridique",
      entreprise: "Cabinet Juridique & Co",
      ville: "Lomé",
      pays: "Togo",
      date_debut: "2019-01",
      date_fin: "",
      en_cours: true,
      description: "Supervision de la conformité légale pour plus de 50 clients corporatifs.",
      realisations: [
        "Rédaction et négociation de contrats complexes internationaux.",
        "Gestion des litiges commerciaux et représentation devant les tribunaux."
      ]
    },
    {
      id: "2",
      poste: "Conseiller Juridique Junior",
      entreprise: "Africa Bank Group",
      ville: "Dakar",
      pays: "Sénégal",
      date_debut: "2015-06",
      date_fin: "2019-12",
      en_cours: false,
      description: "Revue des garanties bancaires et des contrats de prêt.",
      realisations: [
        "Veille juridique sur les évolutions réglementaires de la BCEAO.",
        "Support au secrétariat du conseil d'administration."
      ]
    }
  ],
  formations: [
    {
      id: "1",
      diplome: "Master 2 en Droit des Affaires",
      etablissement: "Université de Lomé",
      ville: "Lomé",
      pays: "Togo",
      date_debut: "2013-10",
      date_fin: "2015-07",
      en_cours: false
    },
    {
      id: "2",
      diplome: "Licence en Droit Privé",
      etablissement: "Université de Dakar",
      ville: "Dakar",
      pays: "Sénégal",
      date_debut: "2010-10",
      date_fin: "2013-07",
      en_cours: false
    }
  ],
  competences: [
    { id: "1", nom: "Droit OHADA", niveau: "expert", categorie: "technique" },
    { id: "2", nom: "Contrats Internationaux", niveau: "expert", categorie: "technique" },
    { id: "3", nom: "Négociation", niveau: "avance", categorie: "technique" },
    { id: "4", nom: "Conformité", niveau: "avance", categorie: "technique" }
  ],
  langues: [
    { id: "1", nom: "Français", niveau: "natif" },
    { id: "2", nom: "Anglais", niveau: "courant" }
  ],
  certifications: [
    { id: "1", nom: "Certification Conformité Africaine", organisme: "Institut de Conformité", date_obtention: "2020-11" }
  ]
};

const templates = [
  { id: "classic", name: "Classique Professional", component: ClassicTemplate, desc: "Sobre, élégant et intemporel.", isPremium: false, isNewV2: false },
  { id: "modern", name: "Modern Sidebar", component: ModernTemplate, desc: "Contemporain, dynamique et structuré.", isPremium: false, isNewV2: false },
  { id: "premium_finance", name: "Premium Finance", component: CVPreviewPremiumFinance, desc: "Design marine et or, parfait pour la banque et finance.", isPremium: true, isNewV2: true },
  { id: "premium_tech", name: "Premium Tech", component: CVPreviewPremiumTech, desc: "Design moderne avec dégradés pour profils tech.", isPremium: true, isNewV2: true },
  { id: "premium_marketing", name: "Premium Marketing", component: CVPreviewPremiumMarketing, desc: "Créatif avec dégradé et frise chronologique.", isPremium: true, isNewV2: true },
  { id: "premium_student", name: "Premium Student", component: CVPreviewPremiumStudent, desc: "Valorise la formation, idéal étudiants et jeunes diplômés.", isPremium: true, isNewV2: true },
  { id: "premium_executive", name: "Premium Executive", component: CVPreviewPremiumExecutive, desc: "Thème sombre luxueux avec accents dorés pour directeurs.", isPremium: true, isNewV2: true }
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const ActiveTemplate = selectedTemplate.component as any;

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
                Chaque template a été validé par des experts RH pour maximiser vos chances de recrutement en Afrique.
              </p>
            </div>

            <div className="flex flex-wrap bg-muted p-1.5 rounded-2xl border border-border gap-1 max-w-full">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                    selectedTemplate.id === t.id 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.name}
                  {t.isPremium && (
                    <span className="bg-amber-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Lock size={8} /> PREM
                    </span>
                  )}
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
                  Débloquez tous nos templates exclusifs et le scoring IA en passant au plan Premium.
                </p>
                <Button variant="secondary" className="w-full font-black text-xs h-11" asChild>
                  <Link href="/tarifs">Mettre à niveau</Link>
                </Button>
              </div>
            </aside>

            {/* Preview Panel */}
            <div className="lg:col-span-9">
              <div className="bg-muted/20 border border-border rounded-[2.5rem] p-4 md:p-12 overflow-hidden shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <p className="text-xs text-muted-foreground font-semibold italic max-w-xs sm:max-w-md">
                    {selectedTemplate.desc}
                  </p>
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
                    {selectedTemplate.isNewV2 ? (
                      <ActiveTemplate data={mockDataV2} showWatermark={true} />
                    ) : (
                      <ActiveTemplate data={mockDataLegacy} />
                    )}
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
