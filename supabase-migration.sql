-- ============================================
-- CVAfrik - Tables Supabase
-- Execute tout ce script dans Supabase SQL Editor
-- ============================================

-- Profiles (auto-created on signup)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  linkedin TEXT,
  plan TEXT DEFAULT 'gratuit',
  plan_expiry TIMESTAMPTZ,
  cvs_generes_ce_mois INTEGER DEFAULT 0,
  lettres_generees_ce_mois INTEGER DEFAULT 0,
  simulations_faites_ce_mois INTEGER DEFAULT 0,
  derniere_reinitialisation TIMESTAMPTZ DEFAULT NOW(),
  cinetpay_customer_id TEXT,
  pays TEXT,
  statut TEXT,
  secteur TEXT,
  objectif TEXT,
  source TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CVs
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  titre TEXT DEFAULT 'Mon CV',
  donnees JSONB NOT NULL,
  template TEXT DEFAULT 'moderne',
  score INTEGER,
  conseils_ia JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lettres de motivation
CREATE TABLE IF NOT EXISTS lettres_motivation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  offre_emploi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paiements
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cinetpay_transaction_id TEXT NOT NULL,
  montant_fcfa NUMERIC NOT NULL,
  montant_usd NUMERIC,
  plan_achete TEXT NOT NULL,
  operateur TEXT,
  statut TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suivi des candidatures
CREATE TABLE IF NOT EXISTS suivi_candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  nom_entreprise TEXT NOT NULL,
  poste TEXT NOT NULL,
  date_candidature DATE DEFAULT CURRENT_DATE,
  statut TEXT DEFAULT 'envoye',
  notes TEXT,
  rappel_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulations d'entretien
CREATE TABLE IF NOT EXISTS simulations_entretien (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  messages JSONB,
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nom, prenom)
  VALUES (NEW.id, NEW.email, '', '');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lettres_motivation ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE suivi_candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations_entretien ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own CVs" ON cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs" ON cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON cvs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lettres" ON lettres_motivation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lettres" ON lettres_motivation FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own candidatures" ON suivi_candidatures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own candidatures" ON suivi_candidatures FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own simulations" ON simulations_entretien FOR SELECT USING (auth.uid() = user_id);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  statut TEXT DEFAULT 'ouvert',
  priorite TEXT DEFAULT 'normale',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
