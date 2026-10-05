import type { Metadata } from "next"
import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-ui"
import { ForgotPasswordForm } from "@/components/auth/password-forms"

export const metadata: Metadata = {
  title: "Esqueci minha senha — Chico's Gym",
  robots: { index: false },
}

export default async function EsqueciSenhaPage(props: PageProps<"/esqueci-senha">) {
  const params = await props.searchParams
  const expired = params.expirado === "1"

  return (
    <main className="pt-24 md:pt-28">
      <AuthCard
        eyebrow="Área do Aluno"
        title="Esqueci minha senha"
        description={
          expired
            ? "O link para trocar a senha expirou. Peça um novo abaixo."
            : "Informe o e-mail da sua conta e enviamos um link para você criar uma nova senha."
        }
        footer={
          <Link href="/entrar" data-cursor-hover className="text-offwhite/60 hover:text-orange">
            Voltar para o login
          </Link>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </main>
  )
}
