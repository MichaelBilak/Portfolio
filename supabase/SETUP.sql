-- Wipe Payload leftovers + apply DormUp Studio schema cleanly.
-- Run in Supabase SQL Editor (as postgres).

-- â”€â”€ Drop legacy Payload / mixed tables â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
drop table if exists public.payload_locked_documents_rels cascade;
drop table if exists public.payload_locked_documents cascade;
drop table if exists public.payload_preferences_rels cascade;
drop table if exists public.payload_preferences cascade;
drop table if exists public.payload_migrations cascade;
drop table if exists public.payload_kv cascade;
drop table if exists public.users_sessions cascade;
drop table if exists public.users cascade;

drop table if exists public.services_tiers_locales cascade;
drop table if exists public.services_tiers cascade;
drop table if exists public.services_what_you_get cascade;
drop table if exists public.services_locales cascade;
drop table if exists public.services cascade;

drop table if exists public.projects_tech cascade;
drop table if exists public.projects_locales cascade;
drop table if exists public.projects cascade;

drop table if exists public.addon_categories_items_locales cascade;
drop table if exists public.addon_categories_items cascade;
drop table if exists public.addon_categories_locales cascade;
drop table if exists public.addon_categories cascade;

drop table if exists public.process_steps_locales cascade;
drop table if exists public.process_steps cascade;

drop table if exists public.before_after_cases_changes cascade;
drop table if exists public.before_after_cases_locales cascade;
drop table if exists public.before_after_cases cascade;

drop table if exists public.leads_notes cascade;
drop table if exists public.leads_selected_addons cascade;
drop table if exists public.leads_selected_service_slugs cascade;
drop table if exists public.leads_selected_services cascade;
drop table if exists public.leads_tags cascade;
drop table if exists public.lead_events cascade;
drop table if exists public.leads cascade;

drop table if exists public.site_copy_locales cascade;
drop table if exists public.site_copy cascade;
drop table if exists public.site_settings_locales cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.seo_defaults_locales cascade;
drop table if exists public.seo_defaults cascade;
drop table if exists public.integrations cascade;
drop table if exists public.redirects cascade;
drop table if exists public.media_locales cascade;
drop table if exists public.media cascade;
drop table if exists public.audit_logs cascade;

-- Our new names if partially created
drop table if exists public.service_tier_i18n cascade;
drop table if exists public.service_tiers cascade;
drop table if exists public.service_i18n cascade;
drop table if exists public.project_i18n cascade;
drop table if exists public.addon_item_i18n cascade;
drop table if exists public.addon_items cascade;
drop table if exists public.addon_category_i18n cascade;
drop table if exists public.process_step_i18n cascade;
drop table if exists public.before_after_i18n cascade;
drop table if exists public.lead_notes cascade;
drop table if exists public.profiles cascade;

-- Keep auth.users â€” profiles will recreate via trigger


-- DormUp Studio CMS schema (Supabase Postgres)
-- Apply in Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

-- â”€â”€ Profiles (linked to auth.users) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text not null default 'editor' check (role in ('owner', 'editor', 'sales')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- â”€â”€ Projects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  project_id text not null unique,
  slug text not null unique,
  index_label text not null default '01',
  tag text not null default '',
  sort_order int not null default 0,
  image_path text,
  image_position text default 'top',
  tech jsonb not null default '[]'::jsonb,
  url text not null default '#',
  display_url text not null default '',
  is_live boolean not null default false,
  featured boolean not null default true,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_i18n (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  name text not null default '',
  name_tagline text,
  subtitle text not null default '',
  problem text not null default '',
  solution text not null default '',
  business_impact text not null default '',
  unique (project_id, locale)
);

-- â”€â”€ Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  service_id text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  icon text not null default 'Monitor',
  image_path text,
  published boolean not null default true,
  base_price numeric not null default 0,
  is_monthly boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_i18n (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  title text not null default '',
  description text not null default '',
  details text not null default '',
  what_you_get jsonb not null default '[]'::jsonb,
  portfolio_url text,
  portfolio_link_label text,
  portfolio_url_2 text,
  portfolio_link_label_2 text,
  pricing_section_title text,
  pricing_footnote text,
  unique (service_id, locale)
);

create table if not exists public.service_tiers (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  tier_id text not null,
  price numeric not null default 0,
  monthly boolean not null default false,
  featured boolean not null default false,
  sort_order int not null default 0,
  unique (service_id, tier_id)
);

create table if not exists public.service_tier_i18n (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid not null references public.service_tiers (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  name text not null default '',
  detail text not null default '',
  unique (tier_id, locale)
);

-- â”€â”€ Addons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.addon_categories (
  id uuid primary key default gen_random_uuid(),
  category_id text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.addon_category_i18n (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.addon_categories (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  title text not null default '',
  unique (category_id, locale)
);

create table if not exists public.addon_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.addon_categories (id) on delete cascade,
  item_id text not null,
  price_type text not null default 'from',
  price numeric,
  enabled boolean not null default true,
  sort_order int not null default 0,
  unique (category_id, item_id)
);

create table if not exists public.addon_item_i18n (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.addon_items (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  label text not null default '',
  info text not null default '',
  unique (item_id, locale)
);

-- â”€â”€ Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  step_id text not null unique,
  number_label text not null,
  sort_order int not null default 0,
  icon text not null default 'Search'
);

create table if not exists public.process_step_i18n (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.process_steps (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  title text not null default '',
  summary text not null default '',
  description text not null default '',
  unique (step_id, locale)
);

-- â”€â”€ Before / after â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.before_after_cases (
  id uuid primary key default gen_random_uuid(),
  case_id text not null unique,
  sort_order int not null default 0,
  published boolean not null default true,
  before_src text not null,
  after_src text not null
);

create table if not exists public.before_after_i18n (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.before_after_cases (id) on delete cascade,
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  tab text not null default '',
  headline text not null default '',
  changes jsonb not null default '[]'::jsonb,
  before_alt text not null default '',
  after_alt text not null default '',
  unique (case_id, locale)
);

-- â”€â”€ Site copy (section JSON per locale) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.site_copy (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('it','en','fr','ru','de','es')),
  section text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (locale, section)
);

-- â”€â”€ Settings / SEO / redirects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  brand_name text,
  brand_tagline text,
  site_url text,
  contact_email text,
  instagram_url text,
  instagram_bio_link text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict do nothing;

create table if not exists public.seo_defaults (
  id uuid primary key default gen_random_uuid(),
  locale text not null unique check (locale in ('it','en','fr','ru','de','es')),
  default_title text,
  default_description text,
  og_image_path text,
  organization_logo_path text,
  ga_measurement_id text,
  plausible_domain text,
  updated_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  permanent boolean not null default true,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- â”€â”€ Leads CRM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new','in_progress','won','lost','spam')),
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  full_name text,
  email text,
  business_name text,
  business_type text,
  site_url text,
  brief text,
  source text,
  intent text,
  locale text,
  selected_services jsonb not null default '[]'::jsonb,
  selected_service_slugs jsonb not null default '[]'::jsonb,
  selected_addons jsonb not null default '[]'::jsonb,
  ip text,
  user_agent text,
  raw_payload jsonb,
  assignee_id uuid references public.profiles(id) on delete set null,
  first_responded_at timestamptz,
  next_action_at timestamptz,
  qualified_at timestamptz,
  closed_at timestamptz,
  lost_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_created_idx on public.leads (status, created_at desc);
create index if not exists leads_assignee_status_idx on public.leads (assignee_id, status) where assignee_id is not null;
create index if not exists leads_next_action_idx on public.leads (next_action_at) where next_action_at is not null and status in ('new', 'in_progress');

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id bigint generated by default as identity primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  bucket text not null default 'media',
  alt text,
  mime_type text,
  size_bytes int,
  created_at timestamptz not null default now()
);

-- â”€â”€ RLS (public read of published content; writes via service role) â”€â”€
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_i18n enable row level security;
alter table public.services enable row level security;
alter table public.service_i18n enable row level security;
alter table public.service_tiers enable row level security;
alter table public.service_tier_i18n enable row level security;
alter table public.addon_categories enable row level security;
alter table public.addon_category_i18n enable row level security;
alter table public.addon_items enable row level security;
alter table public.addon_item_i18n enable row level security;
alter table public.process_steps enable row level security;
alter table public.process_step_i18n enable row level security;
alter table public.before_after_cases enable row level security;
alter table public.before_after_i18n enable row level security;
alter table public.site_copy enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_defaults enable row level security;
alter table public.redirects enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.lead_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.media enable row level security;

-- Anon can read published catalog + copy + redirects + seo
create policy "public read published projects" on public.projects for select using (published = true);
create policy "public read project i18n" on public.project_i18n for select using (true);
create policy "public read published services" on public.services for select using (published = true);
create policy "public read service i18n" on public.service_i18n for select using (true);
create policy "public read tiers" on public.service_tiers for select using (true);
create policy "public read tier i18n" on public.service_tier_i18n for select using (true);
create policy "public read addons" on public.addon_categories for select using (true);
create policy "public read addon cat i18n" on public.addon_category_i18n for select using (true);
create policy "public read addon items" on public.addon_items for select using (enabled = true);
create policy "public read addon item i18n" on public.addon_item_i18n for select using (true);
create policy "public read process" on public.process_steps for select using (true);
create policy "public read process i18n" on public.process_step_i18n for select using (true);
create policy "public read ba" on public.before_after_cases for select using (published = true);
create policy "public read ba i18n" on public.before_after_i18n for select using (true);
create policy "public read site copy" on public.site_copy for select using (true);
create policy "public read settings" on public.site_settings for select using (true);
create policy "public read seo" on public.seo_defaults for select using (true);
create policy "public read redirects" on public.redirects for select using (enabled = true);
create policy "public read media" on public.media for select using (true);

-- Authenticated users can read own profile
create policy "read own profile" on public.profiles for select using (auth.uid() = id);

-- Storage bucket (run in dashboard if needed):
-- insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;

