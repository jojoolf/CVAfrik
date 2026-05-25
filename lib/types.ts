// Types pour CVAfrik

export type Plan = 'gratuit' | 'pro' | 'premium'
export type PaymentStatus = 'en_attente' | 'accepte' | 'echoue'
export type CandidatureStatus = 'envoye' | 'relance' | 'entretien' | 'refuse' | 'accepte'

export interface Profile {
  id: string
  email: string
  nom: string | null
  prenom: string | null
  telephone: string | null
  date_naissance: string | null
  adresse: string | null
  linkedin: string | null
  plan: Plan
  plan_expiry: string | null
  cvs_generes_ce_mois: number
  lettres_generees_ce_mois: number
  derniere_reinitialisation: string
  cinetpay_customer_id: string | null
  pays: string | null
  /** Champs optionnels (questionnaire / onboarding) — non requis pour acceder au tableau de bord */
  statut?: string | null
  secteur?: string | null
  objectif?: string | null
  source?: string | null
  onboarding_completed?: boolean
  created_at: string
  updated_at: string
}

export interface CVDonnees {
  informations_personnelles: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    linkedin?: string
    photo?: string
  }
  titre_professionnel: string
  resume?: string
  formations: Formation[]
  experiences: Experience[]
  competences: Competence[]
  langues: Langue[]
  certifications?: Certification[]
  centres_interet?: string[]
}

export interface Formation {
  id: string
  diplome: string
  etablissement: string
  ville: string
  pays: string
  date_debut: string
  date_fin: string
  en_cours: boolean
  description?: string
}

export interface Experience {
  id: string
  poste: string
  entreprise: string
  ville: string
  pays: string
  date_debut: string
  date_fin: string
  en_cours: boolean
  description: string
  realisations: string[]
}

export interface Competence {
  id: string
  nom: string
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert'
  categorie: 'technique' | 'soft_skill' | 'langue' | 'autre'
}

export interface Langue {
  id: string
  nom: string
  niveau: 'debutant' | 'intermediaire' | 'courant' | 'bilingue' | 'natif'
}

export interface Certification {
  id: string
  nom: string
  organisme: string
  date_obtention: string
  date_expiration?: string
  lien?: string
}

export interface LettreMotivation {
  id: string
  user_id: string
  cv_id: string | null
  destinataire: string
  entreprise: string
  poste: string
  contenu: string
  style: string
  created_at: string
}

export interface CV {
  id: string
  user_id: string
  titre: string
  donnees: CVDonnees
  template: string
  score: number | null
  conseils_ia: string[] | null
  created_at: string
  updated_at: string
}

export interface LettreMotivation {
  id: string
  user_id: string
  cv_id: string | null
  titre: string
  contenu: string
  offre_emploi: string | null
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  cinetpay_transaction_id: string
  montant_fcfa: number
  montant_usd: number | null
  plan_achete: 'pro' | 'premium'
  operateur: string | null
  statut: PaymentStatus
  created_at: string
}

export interface SuiviCandidature {
  id: string
  user_id: string
  cv_id: string | null
  nom_entreprise: string
  poste: string
  date_candidature: string
  statut: CandidatureStatus
  notes: string | null
  rappel_date: string | null
  created_at: string
  updated_at: string
}

export interface SimulationEntretien {
  id: string
  user_id: string
  cv_id: string | null
  messages: ChatMessage[]
  feedback: string | null
  score: number | null
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Plans et tarification
export interface PlanConfig {
  id: Plan
  nom: string
  prix_fcfa: number
  prix_usd: number
  prix_annuel_fcfa?: number
  prix_annuel_usd?: number
  description: string
  fonctionnalites: string[]
  limites: {
    cvs_par_mois: number | null // null = illimite
    lettres_par_mois: number | null
    templates: string[]
    filigrane: boolean
    export_pdf: boolean
    conseils_ia: boolean
    simulation_entretien: boolean
    suivi_candidatures: boolean
    profil_linkedin: boolean
    adaptation_offre: boolean
  }
}

export const PLANS: PlanConfig[] = [
  {
    id: 'gratuit',
    nom: 'Starter',
    prix_fcfa: 0,
    prix_usd: 0,
    prix_annuel_fcfa: 0,
    prix_annuel_usd: 0,
    description: 'Pour découvrir CVAfrik et créer ton premier CV',
    fonctionnalites: [
      '3 CV par mois',
      '3 lettres de motivation / mois',
      '3 templates basiques',
      'Export PDF (avec watermark)',
      'Accès aux offres de stages',
    ],
    limites: {
      cvs_par_mois: 3,
      lettres_par_mois: 3,
      templates: ['classique', 'moderne', 'minimaliste'],
      filigrane: true,
      export_pdf: true,
      conseils_ia: false,
      simulation_entretien: true,
      suivi_candidatures: false,
      profil_linkedin: false,
      adaptation_offre: false,
    },
  },
  {
    id: 'pro',
    nom: 'Career Pro',
    prix_fcfa: 2600,
    prix_usd: 3.99,
    prix_annuel_fcfa: 26000,
    prix_annuel_usd: 39.99,
    description: 'Pour décrocher ton stage ou premier emploi rapidement',
    fonctionnalites: [
      'CV illimités',
      'Lettres de motivation illimitées',
      '45+ templates premium',
      'Export PDF sans watermark',
      'Score ATS détaillé + conseils',
      'Simulateur entretien illimité',
      'Coaching IA après entretien',
      'Matching CV ↔ offre d\'emploi',
      'Traduction anglais/français',
      'Toutes les offres de stages',
      'Mini-cours vidéo soft skills',
    ],
    limites: {
      cvs_par_mois: null,
      lettres_par_mois: null,
      templates: ['all'],
      filigrane: false,
      export_pdf: true,
      conseils_ia: true,
      simulation_entretien: true,
      suivi_candidatures: true,
      profil_linkedin: true,
      adaptation_offre: true,
    },
  },
  {
    id: 'premium',
    nom: 'Business',
    prix_fcfa: 6500,
    prix_usd: 9.99,
    prix_annuel_fcfa: 65000,
    prix_annuel_usd: 99.99,
    description: 'Pour les universités, écoles et coachs carrière',
    fonctionnalites: [
      'Tout le plan Pro inclus',
      'Gestion multi-profils étudiants',
      'Dashboard de suivi',
      'Templates avec logo école (CUSTOM)',
      'Rapport mensuel des progrès',
      'Support prioritaire WhatsApp',
      'Accès anticipé aux nouveautés',
      'Onboarding personnalisé',
    ],
    limites: {
      cvs_par_mois: null,
      lettres_par_mois: null,
      templates: ['all'],
      filigrane: false,
      export_pdf: true,
      conseils_ia: true,
      simulation_entretien: true,
      suivi_candidatures: true,
      profil_linkedin: true,
      adaptation_offre: true,
    },
  },
]

// Tous les pays d'Afrique supportes
export const PAYS_AFRIQUE = [
  { code: 'BJ', nom: 'Benin', indicatif: '+229' },
  { code: 'BF', nom: 'Burkina Faso', indicatif: '+226' },
  { code: 'CI', nom: 'Cote d\'Ivoire', indicatif: '+225' },
  { code: 'GN', nom: 'Guinee', indicatif: '+224' },
  { code: 'ML', nom: 'Mali', indicatif: '+223' },
  { code: 'NE', nom: 'Niger', indicatif: '+227' },
  { code: 'SN', nom: 'Senegal', indicatif: '+221' },
  { code: 'TG', nom: 'Togo', indicatif: '+228' },
  { code: 'CM', nom: 'Cameroun', indicatif: '+237' },
  { code: 'GA', nom: 'Gabon', indicatif: '+241' },
  { code: 'CG', nom: 'Congo', indicatif: '+242' },
  { code: 'CD', nom: 'RD Congo', indicatif: '+243' },
]

// Operateurs Mobile Money
export const OPERATEURS_MOBILE_MONEY = [
  { id: 'orange', nom: 'Orange Money', pays: ['CI', 'SN', 'ML', 'BF', 'GN', 'CM'] },
  { id: 'mtn', nom: 'MTN Mobile Money', pays: ['CI', 'BJ', 'CM', 'CG', 'GN'] },
  { id: 'moov', nom: 'Moov Money', pays: ['CI', 'BJ', 'TG', 'NE', 'BF'] },
  { id: 'flooz', nom: 'Flooz', pays: ['TG', 'BJ'] },
]

