-- CVAfrik : campagnes plein écran dans l'application
-- Exécuter ce script une seule fois dans Supabase SQL Editor.

create table if not exists public.in_app_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '' check (char_length(body) <= 600),
  image_url text not null,
  action_label text not null default 'Découvrir',
  action_href text not null default '/dashboard' check (action_href like '/%' and action_href not like '//%'),
  audience text not null default 'all' check (audience in ('all', 'starter', 'pro')),
  frequency text not null default 'once' check (frequency in ('once', 'daily', 'every_launch')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint in_app_campaigns_dates_valid check (ends_at is null or ends_at > starts_at)
);

create index if not exists in_app_campaigns_active_dates_idx
  on public.in_app_campaigns (is_active, starts_at, ends_at);

create table if not exists public.in_app_campaign_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.in_app_campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('viewed', 'dismissed', 'clicked')),
  created_at timestamptz not null default now()
);

create index if not exists in_app_campaign_events_user_campaign_idx
  on public.in_app_campaign_events (user_id, campaign_id, created_at desc);
create index if not exists in_app_campaign_events_campaign_idx
  on public.in_app_campaign_events (campaign_id, event_type);

alter table public.in_app_campaigns enable row level security;
alter table public.in_app_campaign_events enable row level security;

-- Les routes serveur CVAfrik utilisent le client administrateur pour les opérations.
-- Les utilisateurs ne peuvent ni lire ni modifier ces tables directement depuis le navigateur.
drop policy if exists "No direct campaign access" on public.in_app_campaigns;
create policy "No direct campaign access" on public.in_app_campaigns for all using (false) with check (false);
drop policy if exists "No direct campaign event access" on public.in_app_campaign_events;
create policy "No direct campaign event access" on public.in_app_campaign_events for all using (false) with check (false);

-- La première campagne de démonstration sera créée depuis Admin > Campagnes in-app.
