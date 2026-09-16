-- Run this migration in the Supabase SQL Editor, or apply it with the
-- Supabase CLI once the project is linked. All browser traffic goes through
-- the dashboard server; no public table policies are created here.

create extension if not exists pgcrypto;

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  external_run_id text not null unique,
  station_id text not null,
  status text not null default 'running',
  validator_url text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.runs(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound', 'internal')),
  kind text not null,
  request_id text,
  source_sequence bigint,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_run_id_id_desc_idx on public.events (run_id, id desc);
create index if not exists events_run_id_request_id_idx on public.events (run_id, request_id) where request_id is not null;

create table if not exists public.current_snapshots (
  run_id uuid primary key references public.runs(id) on delete cascade,
  snapshot_sequence bigint,
  world_version bigint,
  tick bigint,
  phase text,
  inventory jsonb,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.commands (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.runs(id) on delete cascade,
  request_id text not null,
  command_type text not null,
  status text not null default 'sent',
  result_code text,
  command jsonb not null,
  result jsonb,
  sent_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (run_id, request_id)
);

create table if not exists public.annotations (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.runs(id) on delete cascade,
  event_id bigint references public.events(id) on delete set null,
  body text not null check (char_length(body) between 1 and 4000),
  author_label text,
  created_at timestamptz not null default now()
);

alter table public.runs enable row level security;
alter table public.events enable row level security;
alter table public.current_snapshots enable row level security;
alter table public.commands enable row level security;
alter table public.annotations enable row level security;

revoke all on public.runs, public.events, public.current_snapshots, public.commands, public.annotations from anon, authenticated;
