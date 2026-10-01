-- FreeChess sync (Oct 2026): run once in Supabase, SQL Editor > New query > Run.
-- One table: each linked set of devices shares one row, found by a long random
-- sync code. The app never reads the table directly: it can only call the two
-- functions below with a code it already knows, so nobody can list anyone
-- else's progress.

create table if not exists public.sync (
  code text primary key check (char_length(code) >= 24),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Locked: no direct reading or writing at all.
alter table public.sync enable row level security;
revoke all on public.sync from anon, authenticated;

-- Read the progress for a code (nothing comes back for a code that doesn't exist).
create or replace function public.sync_get(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select data from public.sync where code = p_code and char_length(p_code) >= 24;
$$;

-- Save the progress for a code (made the first time, replaced after that).
create or replace function public.sync_put(p_code text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(p_code) < 24 then
    raise exception 'That sync code is too short.';
  end if;
  if pg_column_size(p_data) > 8000000 then
    raise exception 'Too much to save.';
  end if;
  insert into public.sync (code, data, updated_at)
  values (p_code, p_data, now())
  on conflict (code) do update set data = excluded.data, updated_at = now();
end;
$$;

revoke all on function public.sync_get(text) from public;
revoke all on function public.sync_put(text, jsonb) from public;
grant execute on function public.sync_get(text) to anon;
grant execute on function public.sync_put(text, jsonb) to anon;
