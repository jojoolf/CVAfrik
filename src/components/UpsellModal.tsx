"use client";

import React from "react";
import Link from "next/link";
import { Rocket, X } from "lucide-react";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-primary" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {featureName || "Fonctionnalité Verrouillée"} 🚀
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Cette fonctionnalité est disponible à partir du plan <span className="font-bold text-primary">Pro</span>. 
            Passe au Pro pour seulement <span className="font-bold text-slate-900 dark:text-white">1 200 FCFA/mois</span> et booste ta recherche d'emploi.
          </p>

          <div className="space-y-4">
            <Link 
              href="/tarifs"
              className="block w-full py-4 px-6 bg-primary text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
              onClick={onClose}
            >
              Passer au Pro →
            </Link>
            
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors"
            >
              Continuer avec le plan gratuit
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 italic">
            Plus de 10 000 candidats utilisent CVAfrik pour réussir.
          </p>
        </div>
      </div>
    </div>
  );
};
