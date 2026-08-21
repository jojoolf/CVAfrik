-- ========================================================
-- RLS POLICIES FOR BLOG POSTS (blog_posts)
-- Execute ce script dans l'éditeur SQL de Supabase
-- pour permettre la suppression et modification d'articles.
-- ========================================================

-- 1. Activer RLS sur la table blog_posts si ce n'est pas déjà fait
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Allow public read for published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin insert" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin update" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin delete" ON public.blog_posts;

-- 3. Politique de lecture : tout le monde peut lire les articles publiés,
--    et les administrateurs peuvent lire tous les articles (y compris brouillons)
CREATE POLICY "Allow public read for published posts" 
ON public.blog_posts 
FOR SELECT 
USING (
  publie = true 
  OR auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);

-- 4. Politique d'insertion : seuls les administrateurs peuvent ajouter des articles
CREATE POLICY "Allow admin insert" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (
  auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);

-- 5. Politique de mise à jour : seuls les administrateurs peuvent modifier
CREATE POLICY "Allow admin update" 
ON public.blog_posts 
FOR UPDATE 
USING (
  auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);

-- 6. Politique de suppression : seuls les administrateurs peuvent supprimer
CREATE POLICY "Allow admin delete" 
ON public.blog_posts 
FOR DELETE 
USING (
  auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);
