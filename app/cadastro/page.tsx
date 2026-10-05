import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-ui"
import { SignupForm } from "@/components/auth/signup-form"
import { getUserId } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Criar conta — Área do Aluno — Chico's Gym",
  robots: { index: false },
}

export default async function CadastroPage() {
  if (await getUserId()) redirect("/aluno")

  return (
    <main className="pt-24 md:pt-28">
      <AuthCard
        eyebrow="Área do Aluno"
        title="Criar conta"
        description="Leva menos de um minuto. Seus treinos e anotações ficam salvos e só você vê."
        footer={
          <>
            <p className="text-offwhite/60">
              Já tem conta?{" "}
              <Link href="/entrar" data-cursor-hover className="font-semibold text-orange hover:text-gold">
                Entrar
              </Link>
            </p>
            <Link href="/" data-cursor-hover className="text-xs uppercase tracking-[0.2em] text-offwhite/50 hover:text-orange">
              Continuar sem conta
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthCard>
    </main>
  )
}
