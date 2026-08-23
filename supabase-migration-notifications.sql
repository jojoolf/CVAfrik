-- CVAfrik — Préférences, centre et appareils de notifications
-- À exécuter dans Supabase SQL Editor avant de déployer les notifications.

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  push_enabled boolean not null default true,
  email_enabled boolean not null default true,
  applications_enabled boolean not null default true,
  opportunities_enabled boolean not null default true,
  payments_enabled boolean not null default true,
  announcements_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('android', 'ios')),
  is_active boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_devices_user_active_idx
  on public.push_devices (user_id, is_active, last_seen_at desc);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('application', 'opportunity', 'payment', 'announcement')),
  title text not null check (char_length(title) between 1 and 180),
  body text not null check (char_length(body) between 1 and 600),
  href text,
  read_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_notifications_user_created_idx
  on public.user_notifications (user_id, created_at desc);

alter table public.notification_preferences enable row level security;
alter table public.push_devices enable row level security;
alter table public.user_notifications enable row level security;

drop policy if exists "users manage own notification preferences" on public.notification_preferences;
create policy "users manage own notification preferences"
  on public.notification_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users manage own push devices" on public.push_devices;
create policy "users manage own push devices"
  on public.push_devices for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users manage own inbox notifications" on public.user_notifications;
create policy "users manage own inbox notifications"
  on public.user_notifications for select
  using (auth.uid() = user_id);

drop policy if exists "users mark own inbox notifications as read" on public.user_notifications;
create policy "users mark own inbox notifications as read"
  on public.user_notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
