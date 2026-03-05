-- Run this in Supabase SQL editor (for fresh setup)
-- For existing databases, use migration.sql instead

-- Create tables
create table if not exists profiles (
  id uuid primary key,
  email text,
  first_name text,
  last_name text,
  is_pro boolean default false,
  credits_remaining int default 0,
  credits_reset_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('immigration','property')),
  title text not null,
  input_json jsonb not null,
  output_json jsonb not null,
  share_id uuid unique,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table reports enable row level security;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles select own" ON profiles;
DROP POLICY IF EXISTS "profiles upsert own" ON profiles;
DROP POLICY IF EXISTS "profiles update own" ON profiles;
DROP POLICY IF EXISTS "reports select own" ON reports;
DROP POLICY IF EXISTS "reports insert own" ON reports;
DROP POLICY IF EXISTS "reports update own" ON reports;

-- Profiles policies
create policy "profiles select own" on profiles
  for select using (auth.uid() = id);

create policy "profiles upsert own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles update own" on profiles
  for update using (auth.uid() = id);

-- Reports policies
create policy "reports select own" on reports
  for select using (auth.uid() = user_id);

create policy "reports insert own" on reports
  for insert with check (auth.uid() = user_id);

create policy "reports update own" on reports
  for update using (auth.uid() = user_id);

-- Public share read (by share_id) via RPC to avoid exposing full table
create or replace function public_get_report_by_share(share uuid)
returns table (
  id uuid,
  type text,
  title text,
  output_json jsonb,
  created_at timestamptz
) as $$
  select r.id, r.type, r.title, r.output_json, r.created_at
  from reports r
  where r.share_id = share
$$ language sql security definer;

grant execute on function public_get_report_by_share(uuid) to anon;

-- credits_remaining: decremented per AI run; auto-reset by app logic when credits_reset_at is in the past.
