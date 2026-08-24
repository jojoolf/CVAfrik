-- Bannières promotionnelles du dashboard APK CVAfrik
-- À exécuter une seule fois dans Supabase > SQL Editor.

CREATE TABLE IF NOT EXISTS public.native_promo_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT NOT NULL,
  action_label TEXT NOT NULL DEFAULT 'Découvrir',
  action_href TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT native_promo_banners_valid_period CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS native_promo_banners_active_position_idx
  ON public.native_promo_banners (is_active, position, starts_at);

ALTER TABLE public.native_promo_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view active native promo banners" ON public.native_promo_banners;
CREATE POLICY "Authenticated users can view active native promo banners"
  ON public.native_promo_banners FOR SELECT
  TO authenticated
  USING (
    is_active = TRUE
    AND starts_at <= NOW()
    AND (ends_at IS NULL OR ends_at > NOW())
  );

DROP POLICY IF EXISTS "Admins can manage native promo banners" ON public.native_promo_banners;
CREATE POLICY "Admins can manage native promo banners"
  ON public.native_promo_banners FOR ALL
  TO authenticated
  USING (auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com'))
  WITH CHECK (auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com'));

-- Trois bannières CVAfrik initiales. Elles apparaissent automatiquement dans l’APK.
INSERT INTO public.native_promo_banners
  (slug, title, body, image_url, action_label, action_href, position, is_active)
VALUES
  (
    'opportunites-a-la-une',
    'Opportunités à la une',
    'Découvrez des emplois, stages et bourses adaptés à votre parcours.',
    '/banners/native-opportunities.png',
    'Explorer les opportunités',
    '/opportunites',
    10,
    TRUE
  ),
  (
    'career-pro',
    'Passez au niveau Pro',
    'Créez sans limite, exportez en PDF et améliorez votre score ATS.',
    '/banners/native-career-pro.png',
    'Découvrir Career Pro',
    '/paiement/abonnement',
    20,
    TRUE
  ),
  (
    'entretien-ia',
    'Préparez votre entretien',
    'Entraînez-vous avec le simulateur IA avant votre prochain rendez-vous.',
    '/banners/native-interview-ai.png',
    'Commencer un entretien',
    '/dashboard/simulateur',
    30,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
