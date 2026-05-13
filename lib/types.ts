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
    nom: 'Gratuit',
    prix_fcfa: 0,
    prix_usd: 0,
    description: 'Pour commencer a creer votre CV',
    fonctionnalites: [
      '1 CV par mois',
      '2 templates de base',
      'Export PDF avec filigrane',
      'Conseils de base',
    ],
    limites: {
      cvs_par_mois: 1,
      lettres_par_mois: 0,
      templates: ['classique', 'moderne'],
      filigrane: true,
      export_pdf: true,
      conseils_ia: false,
      simulation_entretien: false,
      suivi_candidatures: false,
      profil_linkedin: false,
      adaptation_offre: false,
    },
  },
  {
    id: 'pro',
    nom: 'Pro',
    prix_fcfa: 1200,
    prix_usd: 2,
    description: 'Pour les chercheurs d\'emploi actifs',
    fonctionnalites: [
      'CVs illimites',
      '5 lettres de motivation/mois',
      '6 templates premium',
      'Export PDF sans filigrane',
      'Score CV et conseils IA',
      'Adaptation a une offre',
    ],
    limites: {
      cvs_par_mois: null,
      lettres_par_mois: 5,
      templates: ['classique', 'moderne', 'creatif', 'executif', 'tech', 'minimaliste'],
      filigrane: false,
      export_pdf: true,
      conseils_ia: true,
      simulation_entretien: false,
      suivi_candidatures: false,
      profil_linkedin: false,
      adaptation_offre: true,
    },
  },
  {
    id: 'premium',
    nom: 'Premium',
    prix_fcfa: 3000,
    prix_usd: 5,
    description: 'L\'experience complete pour reussir',
    fonctionnalites: [
      'Tout le plan Pro',
      'Lettres illimitees',
      '8 templates exclusifs',
      'Simulation d\'entretien IA',
      'Suivi des candidatures',
      'Generateur profil LinkedIn',
      'Support prioritaire',
    ],
    limites: {
      cvs_par_mois: null,
      lettres_par_mois: null,
      templates: ['classique', 'moderne', 'creatif', 'executif', 'tech', 'minimaliste', 'startup', 'luxe'],
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

// Pays d'Afrique de l'Ouest supportes
export const PAYS_AFRIQUE_OUEST = [
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
  { id: 'wave', nom: 'Wave', pays: ['SN', 'CI', 'ML', 'BF'] },
  { id: 'flooz', nom: 'Flooz', pays: ['TG', 'BJ'] },
]
