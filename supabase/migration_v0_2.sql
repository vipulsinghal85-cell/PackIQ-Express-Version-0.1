-- Run ONCE in the EXISTING Supabase project. Non-destructive: v0.1 tables remain untouched.
create table if not exists questionnaires (id uuid primary key default gen_random_uuid(),study_id uuid not null unique references studies(id) on delete cascade,draft jsonb not null default '{"questions":[]}'::jsonb,published jsonb,version integer not null default 0,updated_at timestamptz not null default now());
create table if not exists questionnaire_responses(id uuid primary key default gen_random_uuid(),session uuid not null unique references assignments(session),study_id uuid not null references studies(id),pack_id uuid not null references packs(id),version integer not null,answers jsonb not null,created_at timestamptz not null default now());
create index if not exists idx_questionnaire_responses_study on questionnaire_responses(study_id);
alter table questionnaires enable row level security;
alter table questionnaire_responses enable row level security;
-- Access only through authenticated server-side service role routes.
