import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-ui"
import { ResetPasswordForm } from "@/components/auth/password-forms"
import { getUserId } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Nova senha — Chico's Gym",
  robots: { index: false },
}

// Só chega aqui quem abriu o link de "esqueci minha senha" (que já faz o login).
export default async function RedefinirSenhaPage() {
  if (!(await getUserId())) redirect("/esqueci-senha?expirado=1")

  return (
    <main className="pt-24 md:pt-28">
      <AuthCard eyebrow="Área do Aluno" title="Nova senha" description="Escolha uma nova senha para sua conta.">
        <ResetPasswordForm />
      </AuthCard>
    </main>
  )
}
