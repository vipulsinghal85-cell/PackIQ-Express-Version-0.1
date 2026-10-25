-- Run in Supabase SQL editor. Pilot uses server-side service role access only.
create extension if not exists pgcrypto;
create table if not exists studies(id uuid primary key default gen_random_uuid(),slug text unique not null,title text not null,status text not null default 'live' check(status in ('live','closed')),created_at timestamptz default now());
create table if not exists packs(id uuid primary key default gen_random_uuid(),study_id uuid not null references studies(id) on delete cascade,name text not null,image_url text,position integer not null);
create table if not exists assignments(session uuid primary key,study_id uuid not null references studies(id) on delete cascade,pack_id uuid not null references packs(id),created_at timestamptz default now());
create table if not exists responses(id uuid primary key default gen_random_uuid(),session uuid not null unique references assignments(session),study_id uuid not null references studies(id),pack_id uuid not null references packs(id),appeal integer not null check(appeal between 1 and 5),purchase_intent integer not null check(purchase_intent between 1 and 5),likes text,improvements text,created_at timestamptz default now());
create index if not exists idx_assignments_study on assignments(study_id);
create index if not exists idx_responses_study on responses(study_id);
alter table studies enable row level security;alter table packs enable row level security;alter table assignments enable row level security;alter table responses enable row level security;
-- No public table policies: all database access occurs in server-only API routes.
