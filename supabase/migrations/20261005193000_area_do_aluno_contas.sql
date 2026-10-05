-- Área do Aluno — etapa 1: contas.

-- Perfil de cada aluno. É criado automaticamente pelo trigger abaixo quando
-- a pessoa se cadastra no site; o aluno só lê e edita o próprio perfil.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  accepted_terms_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quem é da equipe da academia (acesso ao painel da recepção). Só pode ser
-- alterado direto no banco — nenhuma tela do site consegue se promover.
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.staff enable row level security;

revoke all on public.staff from anon, authenticated;
revoke all on public.profiles from anon;
grant select, update (full_name) on public.profiles to authenticated;

create policy "Aluno edita o próprio perfil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Cria o perfil assim que a conta é criada, com o nome informado no cadastro.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)), 80)
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- LGPD: o aluno pode apagar a própria conta (e, em cascata, todos os dados dele).
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- is_staff() só é usada pelas regras de segurança (RLS); fica num schema que
-- a API do site não expõe, pra não virar uma rota /rpc pública.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()));
$$;

revoke execute on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

create policy "Aluno vê o próprio perfil; equipe vê todos"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or (select private.is_staff()));
