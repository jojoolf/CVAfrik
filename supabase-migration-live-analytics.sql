-- CVAfrik — Présence et analytique administrateur en direct
-- Exécuter ce script une fois dans Supabase SQL Editor.
-- Les données de présence sont limitées au compte connecté, au pays et à la dernière activité.
-- Aucune adresse IP, ville précise, coordonnées ou historique de navigation n’est stocké.

alter table public.profiles
  add column if not exists last_seen_at timestamptz,
  add column if not exists last_seen_country text;

alter table public.manual_payments
  add column if not exists validated_at timestamptz;

create table if not exists public.user_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  country_code text,
  platform text not null default 'web' check (platform in ('web', 'android', 'ios')),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_presence_last_seen_idx
  on public.user_presence (last_seen_at desc);

create index if not exists profiles_last_seen_country_idx
  on public.profiles (last_seen_country, last_seen_at desc);

alter table public.user_presence enable row level security;

drop policy if exists "users manage own live presence" on public.user_presence;
create policy "users manage own live presence"
  on public.user_presence for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
