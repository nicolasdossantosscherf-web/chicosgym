import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-ui"
import { LoginForm } from "@/components/auth/login-form"
import { safeNextPath } from "@/lib/auth-errors"
import { getUserId } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Entrar — Área do Aluno — Chico's Gym",
  robots: { index: false },
}

const NOTICES: Record<string, string> = {
  confirmado: "E-mail confirmado! Agora é só entrar com sua senha.",
  "conta-excluida": "Sua conta foi excluída.",
}

const ERRORS: Record<string, string> = {
  link: "Esse link expirou ou já foi usado. Entre com sua senha ou peça um novo link.",
}

export default async function EntrarPage(props: PageProps<"/entrar">) {
  const params = await props.searchParams
  const next = safeNextPath(typeof params.next === "string" ? params.next : null)
  if (await getUserId()) redirect(next)

  const aviso = typeof params.aviso === "string" ? NOTICES[params.aviso] : null
  const erro = typeof params.erro === "string" ? ERRORS[params.erro] : null

  return (
    <main className="pt-24 md:pt-28">
      <AuthCard
        eyebrow="Área do Aluno"
        title="Entrar"
        description="Acesse seus treinos, cargas, plano e frequência."
        footer={
          <>
            <p className="text-offwhite/60">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" data-cursor-hover className="font-semibold text-orange hover:text-gold">
                Criar conta
              </Link>
            </p>
            <Link href="/" data-cursor-hover className="text-xs uppercase tracking-[0.2em] text-offwhite/50 hover:text-orange">
              Continuar sem conta
            </Link>
          </>
        }
      >
        <LoginForm next={next} notice={erro ? null : aviso} />
        {erro && <p className="mt-4 text-xs text-red-400">{erro}</p>}
      </AuthCard>
    </main>
  )
}
