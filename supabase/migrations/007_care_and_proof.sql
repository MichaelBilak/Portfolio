-- Care retainers + optional portfolio link on cases

alter table public.cases
  add column if not exists project_id uuid references public.projects(id) on delete set null;

create index if not exists cases_project_idx on public.cases(project_id) where project_id is not null;

create table if not exists public.care_retainers (
  id uuid primary key default gen_random_uuid(),
  case_id uuid unique references public.cases(id) on delete set null,
  client_name text,
  client_email text,
  company_name text,
  monthly_amount numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  next_review_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists care_retainers_status_idx
  on public.care_retainers (status, next_review_at);

alter table public.care_retainers enable row level security;
