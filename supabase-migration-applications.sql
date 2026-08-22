-- CVAfrik — Suivi de candidatures
-- À exécuter dans Supabase SQL Editor avant d’activer le tableau de suivi.

create table if not exists public.suivi_candidatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid references public.cvs(id) on delete set null,
  lettre_id uuid references public.lettres_motivation(id) on delete set null,
  opportunite_id uuid references public.opportunites(id) on delete set null,
  nom_entreprise text not null,
  poste text not null,
  date_candidature date not null default current_date,
  statut text not null default 'envoye' check (statut in ('envoye', 'relance', 'entretien', 'refuse', 'accepte')),
  notes text,
  rappel_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.suivi_candidatures
  add column if not exists lettre_id uuid references public.lettres_motivation(id) on delete set null,
  add column if not exists opportunite_id uuid references public.opportunites(id) on delete set null;

create index if not exists suivi_candidatures_user_status_idx
  on public.suivi_candidatures (user_id, statut, date_candidature desc);

alter table public.suivi_candidatures enable row level security;

drop policy if exists "users manage own applications" on public.suivi_candidatures;
create policy "users manage own applications"
  on public.suivi_candidatures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
