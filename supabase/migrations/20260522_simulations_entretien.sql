-- Table pour sauvegarder les sessions de simulation d'entretien
CREATE TABLE IF NOT EXISTS simulations_entretien (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes par utilisateur
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON simulations_entretien(user_id);

-- Sécurité RLS
ALTER TABLE simulations_entretien ENABLE ROW LEVEL SECURITY;

-- L'utilisateur ne voit que ses propres simulations
CREATE POLICY "Users can view own simulations"
  ON simulations_entretien FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON simulations_entretien FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON simulations_entretien FOR UPDATE
  USING (auth.uid() = user_id);
