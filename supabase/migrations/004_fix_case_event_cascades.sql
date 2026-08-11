-- Keep the case journal append-only for direct mutations while allowing
-- foreign-key cascades and ON DELETE SET NULL during case/profile cleanup.
create or replace function public.prevent_case_event_mutation()
returns trigger language plpgsql as $$
begin
  if pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception 'case_events is append-only';
end;
$$;

-- Remove the disposable records created while reproducing the cascade issue.
-- The predicates are deliberately tied to the generated IDs and marker.
delete from public.cases
where id = '7ec7be37-51d4-4f86-b399-ceaf08ba621a'
  and title = '[cleanup pending migration 004]';

delete from auth.users
where id = '78c0f977-5d5f-4606-8a6a-1e72d3ff66ca'
  and email = 'crm-smoke-1786460435626@example.com';
