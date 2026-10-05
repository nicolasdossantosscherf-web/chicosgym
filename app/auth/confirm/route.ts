import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { safeNextPath } from "@/lib/auth-errors"
import { createClient } from "@/lib/supabase/server"

// Destino dos links enviados por e-mail (confirmar conta, trocar senha).
// Aceita os dois formatos do Supabase: token_hash (template SSR) e code (PKCE).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"))

  const supabase = await createClient()
  let ok = false

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    ok = !error
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    ok = !error
  }

  const url = request.nextUrl.clone()
  url.search = ""
  if (ok) {
    url.pathname = next
    return NextResponse.redirect(url)
  }

  // O e-mail pode ter sido confirmado mesmo assim (ex.: link aberto em outro
  // aparelho). O login com senha resolve; pra troca de senha, pede um novo link.
  if (next === "/redefinir-senha") {
    url.pathname = "/esqueci-senha"
    url.searchParams.set("expirado", "1")
  } else {
    url.pathname = "/entrar"
    url.searchParams.set("erro", "link")
  }
  return NextResponse.redirect(url)
}
