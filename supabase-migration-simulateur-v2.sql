-- ========================================================
-- SCHEMA FOR SIMULATEUR D'ENTRETIEN V2
-- Copiez et exécutez ce script dans l'éditeur SQL de Supabase.
-- ========================================================

CREATE TABLE IF NOT EXISTS public.simulations_entretien_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
  position TEXT NOT NULL,
  sector TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  nombre_questions INTEGER NOT NULL DEFAULT 5,
  messages JSONB DEFAULT '[]'::jsonb NOT NULL,
  feedback JSONB,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Activer RLS
ALTER TABLE public.simulations_entretien_v2 ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent pour éviter les doublons
DROP POLICY IF EXISTS "Users can view own simulations v2" ON public.simulations_entretien_v2;
DROP POLICY IF EXISTS "Users can insert own simulations v2" ON public.simulations_entretien_v2;
DROP POLICY IF EXISTS "Users can update own simulations v2" ON public.simulations_entretien_v2;
DROP POLICY IF EXISTS "Users can delete own simulations v2" ON public.simulations_entretien_v2;

-- Créer les politiques RLS
CREATE POLICY "Users can view own simulations v2" 
ON public.simulations_entretien_v2 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations v2" 
ON public.simulations_entretien_v2 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations v2" 
ON public.simulations_entretien_v2 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations v2" 
ON public.simulations_entretien_v2 
FOR DELETE 
USING (auth.uid() = user_id);
