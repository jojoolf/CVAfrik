-- CVAfrik — Catalogue des opportunités
-- À exécuter dans Supabase SQL Editor avant de déployer les pages Opportunités.

create table if not exists public.opportunites (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('emploi', 'stage', 'bourse', 'programme', 'opportunite')),
  titre text not null,
  slug text not null unique,
  organisation text not null,
  description text not null,
  pays text,
  ville text,
  remote boolean not null default false,
  niveau text,
  secteur text,
  date_limite date,
  lien_candidature text,
  image_url text,
  source_nom text,
  source_url text,
  publie boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunites_public_listing_idx
  on public.opportunites (publie, type, date_limite asc, created_at desc);

create index if not exists opportunites_location_idx
  on public.opportunites (pays, ville);

alter table public.opportunites enable row level security;

drop policy if exists "published opportunities are public" on public.opportunites;
create policy "published opportunities are public"
  on public.opportunites for select
  using (publie = true);

-- Les créations, modifications et suppressions passent exclusivement par les routes
-- administrateur utilisant la service role. Elles ne sont donc pas exposées au client.
