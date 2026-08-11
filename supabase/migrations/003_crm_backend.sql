-- DormUp Studio CRM backend
-- Additive migration: no existing CRM or CMS data is removed.

create extension if not exists "pgcrypto";

alter table public.profiles add column if not exists admin_locale text not null default 'ru';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('owner', 'editor', 'sales', 'manager', 'specialist', 'viewer')) not valid;
alter table public.profiles validate constraint profiles_role_check;

create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  color text not null default '#64748b',
  sort_order integer not null default 0,
  is_closed boolean not null default false,
  is_won boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.pipeline_stages (key, name, color, sort_order, is_closed, is_won)
values
  ('intake', 'Intake', '#64748b', 10, false, false),
  ('discovery', 'Discovery', '#3b82f6', 20, false, false),
  ('proposal', 'Proposal', '#8b5cf6', 30, false, false),
  ('active', 'Active', '#f59e0b', 40, false, false),
  ('review', 'Review', '#06b6d4', 50, false, false),
  ('completed', 'Completed', '#22c55e', 60, true, true),
  ('cancelled', 'Cancelled', '#ef4444', 70, true, false)
on conflict (key) do nothing;

create sequence if not exists public.crm_case_number_seq start 1000;

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number bigint not null default nextval('public.crm_case_number_seq') unique,
  title text not null,
  description text,
  lead_id uuid unique references public.leads(id) on delete set null,
  stage_id uuid references public.pipeline_stages(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  client_name text,
  client_email text,
  company_name text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  currency text not null default 'EUR',
  estimated_value numeric(12,2),
  due_date date,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_members (
  case_id uuid not null references public.cases(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'member',
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (case_id, profile_id)
);

create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  default_priority text not null default 'normal',
  created_by uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.task_templates(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  default_assignee_role text,
  due_offset_days integer
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  template_id uuid references public.task_templates(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_checklist_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  body text not null,
  is_done boolean not null default false,
  sort_order integer not null default 0,
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.task_watchers (
  task_id uuid not null references public.tasks(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, profile_id)
);

create table if not exists public.case_events (
  id bigint generated by default as identity primary key,
  case_id uuid references public.cases(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.prevent_case_event_mutation()
returns trigger language plpgsql as $$
begin
  -- Foreign-key cascades and ON DELETE SET NULL run as nested triggers. They
  -- must be allowed so a case or profile can be deleted cleanly.
  if pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception 'case_events is append-only';
end;
$$;

drop trigger if exists case_events_append_only on public.case_events;
create trigger case_events_append_only
before update or delete on public.case_events
for each row execute function public.prevent_case_event_mutation();

create table if not exists public.case_decisions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  body text,
  status text not null default 'proposed' check (status in ('proposed', 'approved', 'rejected', 'superseded')),
  decided_by uuid references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_questions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  question text not null,
  answer text,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  asked_by uuid references public.profiles(id) on delete set null,
  answered_by uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_requirements (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  details text,
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'met', 'waived')),
  priority text not null default 'normal',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  bucket text not null default 'crm-private',
  path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  category text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  document_type text not null default 'document',
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
  current_version integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.case_documents(id) on delete cascade,
  version integer not null,
  body text,
  file_id uuid references public.case_files(id) on delete set null,
  change_summary text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create table if not exists public.document_comments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.case_documents(id) on delete cascade,
  version_id uuid references public.document_versions(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  anchor jsonb,
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_type text not null,
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  enabled boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references public.automation_rules(id) on delete set null,
  case_id uuid references public.cases(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_milestones (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  status text not null default 'planned' check (status in ('planned', 'invoiced', 'paid', 'overdue', 'cancelled')),
  due_date date,
  invoice_reference text,
  paid_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null default current_date,
  minutes integer not null check (minutes > 0 and minutes <= 1440),
  description text,
  billable boolean not null default true,
  hourly_rate numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integration_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  enabled boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  secret_reference text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  token_hash text not null unique,
  label text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.client_approvals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  document_id uuid references public.case_documents(id) on delete cascade,
  requested_by uuid references public.profiles(id) on delete set null,
  client_name text,
  client_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  comment text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists pipeline_stages_order_idx on public.pipeline_stages(sort_order);
create index if not exists cases_stage_idx on public.cases(stage_id) where archived_at is null;
create index if not exists cases_owner_idx on public.cases(owner_id) where archived_at is null;
create index if not exists cases_updated_idx on public.cases(updated_at desc);
create index if not exists case_members_profile_idx on public.case_members(profile_id);
create index if not exists tasks_case_status_idx on public.tasks(case_id, status);
create index if not exists tasks_assignee_due_idx on public.tasks(assignee_id, due_at);
create index if not exists task_comments_task_idx on public.task_comments(task_id, created_at);
create index if not exists case_events_case_idx on public.case_events(case_id, created_at desc);
create index if not exists case_decisions_case_idx on public.case_decisions(case_id);
create index if not exists case_questions_case_idx on public.case_questions(case_id, status);
create index if not exists case_requirements_case_idx on public.case_requirements(case_id, status);
create index if not exists case_files_case_idx on public.case_files(case_id, created_at desc);
create index if not exists case_documents_case_idx on public.case_documents(case_id, updated_at desc);
create index if not exists document_versions_document_idx on public.document_versions(document_id, version desc);
create index if not exists automation_runs_rule_idx on public.automation_runs(rule_id, created_at desc);
create index if not exists notifications_recipient_idx on public.notifications(recipient_id, read_at, created_at desc);
create index if not exists finance_milestones_case_idx on public.finance_milestones(case_id, status);
create index if not exists time_entries_case_date_idx on public.time_entries(case_id, entry_date desc);
create index if not exists time_entries_profile_date_idx on public.time_entries(profile_id, entry_date desc);
create index if not exists portal_tokens_case_idx on public.client_portal_tokens(case_id, expires_at);

alter table public.pipeline_stages enable row level security;
alter table public.cases enable row level security;
alter table public.case_members enable row level security;
alter table public.task_templates enable row level security;
alter table public.task_template_items enable row level security;
alter table public.tasks enable row level security;
alter table public.task_checklist_items enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_watchers enable row level security;
alter table public.case_events enable row level security;
alter table public.case_decisions enable row level security;
alter table public.case_questions enable row level security;
alter table public.case_requirements enable row level security;
alter table public.case_files enable row level security;
alter table public.case_documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_comments enable row level security;
alter table public.automation_rules enable row level security;
alter table public.automation_runs enable row level security;
alter table public.notifications enable row level security;
alter table public.finance_milestones enable row level security;
alter table public.time_entries enable row level security;
alter table public.integration_settings enable row level security;
alter table public.client_portal_tokens enable row level security;
alter table public.client_approvals enable row level security;

-- CRM tables intentionally have no anonymous policies. Studio APIs authenticate a
-- user, check capabilities, then use the server-only service client.
insert into storage.buckets (id, name, public)
values ('crm-private', 'crm-private', false)
on conflict (id) do update set public = false;
