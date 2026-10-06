// Nome do cookie de sessão que o Supabase grava (pode vir em partes: .0, .1…).
const SESSION_COOKIE = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]}-auth-token`

// Checagem rápida no navegador, sem carregar o Supabase: só diz se *parece*
// haver um login. Quem garante o acesso de verdade são as páginas /aluno.
export function hasSessionCookie() {
  return document.cookie.split("; ").some((c) => c.startsWith(SESSION_COOKIE))
}
