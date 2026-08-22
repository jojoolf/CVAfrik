-- CVAfrik — Contexte et types de lettres de motivation
-- À exécuter dans Supabase SQL Editor avant de déployer la fonctionnalité.

alter table public.lettres_motivation
  add column if not exists type_lettre text not null default 'emploi',
  add column if not exists destinataire text,
  add column if not exists entreprise text,
  add column if not exists poste text,
  add column if not exists secteur_activite text;

alter table public.lettres_motivation
  drop constraint if exists lettres_motivation_type_lettre_check;

alter table public.lettres_motivation
  add constraint lettres_motivation_type_lettre_check
  check (type_lettre in ('emploi', 'spontanee', 'stage', 'alternance', 'bourse', 'programme_incubateur'));

create index if not exists lettres_motivation_user_type_created_at_idx
  on public.lettres_motivation (user_id, type_lettre, created_at desc);

-- La table reste privée : seules les policies déjà en place pour user_id
-- doivent permettre à un candidat de lire ou modifier ses propres lettres.
