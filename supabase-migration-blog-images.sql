-- Images de couverture du blog CVAfrik
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Le bucket reste public uniquement pour l'affichage des images publiées.
-- L'envoi, la modification et la suppression restent réservés aux administrateurs CVAfrik.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.jwt()->>'email' IN ('nokejoel@gmail.com', 'jojoolf@gmail.com')
);
