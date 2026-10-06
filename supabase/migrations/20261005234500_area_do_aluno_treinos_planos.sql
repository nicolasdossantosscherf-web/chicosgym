-- Área do Aluno — etapas 2 a 4: ficha, treinos registrados (cargas e
-- frequência) e plano. Regra geral: revogar tudo do papel "authenticated"
-- e liberar só o necessário; o RLS limita cada aluno às próprias linhas.

-- E-mail no perfil, para a equipe encontrar o aluno no painel.
alter table public.profiles add column email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)), 80),
    new.email
  );
  return new;
end;
$$;

-- O aluno pode saber se ele mesmo é da equipe (para abrir o painel).
grant select on public.staff to authenticated;
create policy "Membro da equipe vê o próprio registro"
  on public.staff for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Ficha escolhida pelo aluno no Descubra seu Treino.
create table public.student_workouts (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  sex text not null check (sex in ('feminino', 'masculino')),
  frequency smallint not null check (frequency in (3, 4, 5)),
  goal text check (goal in ('massa', 'emagrecer', 'condicionamento', 'saude')),
  experience text check (experience in ('nunca', 'parei', 'treino')),
  -- Dado de saúde: só é gravado com consentimento explícito na hora de salvar.
  injury_note text check (char_length(injury_note) <= 200),
  updated_at timestamptz not null default now()
);

-- Cada treino registrado no modo treino (é o que conta a frequência).
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trained_on date not null,
  plan_sex text not null check (plan_sex in ('feminino', 'masculino')),
  plan_frequency smallint not null check (plan_frequency in (3, 4, 5)),
  day_index smallint not null check (day_index between 0 and 4),
  day_focus text not null check (char_length(day_focus) <= 40),
  created_at timestamptz not null default now(),
  unique (user_id, trained_on, day_index)
);
create index workout_sessions_user_date on public.workout_sessions (user_id, trained_on desc);

-- Carga usada em cada exercício de um treino.
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  exercise text not null check (char_length(exercise) <= 60),
  load_kg numeric(5, 1) check (load_kg >= 0 and load_kg <= 999),
  created_at timestamptz not null default now(),
  unique (session_id, exercise)
);
create index exercise_logs_user_exercise on public.exercise_logs (user_id, exercise, created_at desc);

-- Plano do aluno — só a equipe registra; o aluno só vê o dele.
create table public.memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null check (plan in ('mensal', 'semestral', 'anual', 'grupo')),
  starts_on date not null,
  expires_on date not null check (expires_on >= starts_on),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);
create index memberships_updated_by on public.memberships (updated_by);

alter table public.student_workouts enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.memberships enable row level security;

revoke all on public.student_workouts, public.workout_sessions, public.exercise_logs, public.memberships
  from anon, authenticated;

grant select, insert, delete on public.student_workouts to authenticated;
grant update (sex, frequency, goal, experience, injury_note) on public.student_workouts to authenticated;
grant select, insert, delete on public.workout_sessions to authenticated;
grant select, insert, delete on public.exercise_logs to authenticated;
grant update (load_kg) on public.exercise_logs to authenticated;
grant select, insert, delete on public.memberships to authenticated;
grant update (plan, starts_on, expires_on, updated_by) on public.memberships to authenticated;

create policy "Aluno gerencia a própria ficha"
  on public.student_workouts for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Aluno vê os próprios treinos; equipe vê todos"
  on public.workout_sessions for select
  to authenticated
  using (user_id = (select auth.uid()) or (select private.is_staff()));

create policy "Aluno registra os próprios treinos"
  on public.workout_sessions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Aluno apaga os próprios treinos"
  on public.workout_sessions for delete
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Aluno vê as próprias cargas"
  on public.exercise_logs for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Aluno registra cargas nos próprios treinos"
  on public.exercise_logs for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.workout_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

create policy "Aluno corrige as próprias cargas"
  on public.exercise_logs for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Aluno apaga as próprias cargas"
  on public.exercise_logs for delete
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Aluno vê o próprio plano; equipe vê todos"
  on public.memberships for select
  to authenticated
  using (user_id = (select auth.uid()) or (select private.is_staff()));

create policy "Equipe registra planos"
  on public.memberships for insert
  to authenticated
  with check ((select private.is_staff()));

create policy "Equipe altera planos"
  on public.memberships for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "Equipe remove planos"
  on public.memberships for delete
  to authenticated
  using ((select private.is_staff()));

create trigger student_workouts_touch_updated_at
  before update on public.student_workouts
  for each row execute function public.touch_updated_at();

create trigger memberships_touch_updated_at
  before update on public.memberships
  for each row execute function public.touch_updated_at();
