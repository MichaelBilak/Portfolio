-- Wipe Payload leftovers + apply DormUp Studio schema cleanly.
-- Run in Supabase SQL Editor (as postgres).

-- ── Drop legacy Payload / mixed tables ───────────────────────
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

-- Keep auth.users — profiles will recreate via trigger
