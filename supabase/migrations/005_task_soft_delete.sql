-- Soft-delete for tasks (trash + restore)

alter table public.tasks
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references public.profiles(id) on delete set null;

create index if not exists tasks_deleted_at_idx
  on public.tasks (deleted_at)
  where deleted_at is not null;
