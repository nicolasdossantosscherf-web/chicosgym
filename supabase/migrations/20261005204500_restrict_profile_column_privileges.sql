-- O Supabase dá privilégios amplos por padrão ao papel "authenticated".
-- Remove tudo e libera só o necessário: ler o perfil e mudar o próprio nome.
-- (Em toda tabela nova: revogar tudo primeiro e liberar coluna por coluna.)
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
