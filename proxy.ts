import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

// Só nas rotas da Área do Aluno: o resto do site continua estático e rápido.
export const config = {
  matcher: ["/aluno/:path*", "/entrar", "/cadastro", "/esqueci-senha", "/redefinir-senha", "/auth/:path*"],
}
