export type Plan = "gratuit" | "pro" | "premium";

export const permissions = {
  gratuit: [
    "generer_cv", // max 1/mois
    "generer_lettre", // max 1/mois
    "template_classique",
    "telecharger_pdf_filigrane",
  ],
  pro: [
    "generer_cv", // illimité
    "generer_lettre", // illimité
    "template_classique",
    "template_moderne",
    "template_creatif",
    "telecharger_pdf_sans_filigrane",
    "sauvegarder_cvs",
    "modifier_cv",
    "adapter_offre_emploi",
    "dashboard_historique",
    "sans_publicites",
  ],
  premium: [
    "generer_cv",
    "generer_lettre",
    "template_classique",
    "template_moderne",
    "template_creatif",
    "template_premium_1",
    "template_premium_2",
    "template_premium_3",
    "telecharger_pdf_sans_filigrane",
    "sauvegarder_cvs",
    "modifier_cv",
    "adapter_offre_emploi",
    "dashboard_historique",
    "sans_publicites",
    "conseils_ia_avances",
    "score_cv",
    "suivi_candidatures",
    "simulation_entretien",
    "generation_profil_linkedin",
    "support_prioritaire",
    "nouvelles_fonctionnalites",
  ],
};

export const verifierAcces = (
  fonctionnalite: string,
  planUtilisateur: Plan = "gratuit"
): boolean => {
  return permissions[planUtilisateur]?.includes(fonctionnalite) ?? false;
};
