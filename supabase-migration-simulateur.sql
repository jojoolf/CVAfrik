-- ========================================================
-- RLS POLICIES FOR SIMULATEUR D'ENTRETIEN
-- Copiez et exécutez ce script dans l'éditeur SQL de Supabase.
-- ========================================================

-- 1. Activer RLS (si ce n'est pas déjà fait)
ALTER TABLE public.simulations_entretien ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent pour éviter les doublons
DROP POLICY IF EXISTS "Users can view own simulations" ON public.simulations_entretien;
DROP POLICY IF EXISTS "Users can insert own simulations" ON public.simulations_entretien;
DROP POLICY IF EXISTS "Users can update own simulations" ON public.simulations_entretien;
DROP POLICY IF EXISTS "Users can delete own simulations" ON public.simulations_entretien;

-- 3. Créer les politiques RLS complètes
-- Permet aux utilisateurs connectés de lire leurs propres simulations
CREATE POLICY "Users can view own simulations" 
ON public.simulations_entretien 
FOR SELECT 
USING (auth.uid() = user_id);

-- Permet aux utilisateurs connectés d'insérer une simulation pour eux-mêmes
CREATE POLICY "Users can insert own simulations" 
ON public.simulations_entretien 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Permet aux utilisateurs connectés de mettre à jour leurs propres simulations
CREATE POLICY "Users can update own simulations" 
ON public.simulations_entretien 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Permet aux utilisateurs connectés de supprimer leurs propres simulations
CREATE POLICY "Users can delete own simulations" 
ON public.simulations_entretien 
FOR DELETE 
USING (auth.uid() = user_id);
