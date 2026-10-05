import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CalendarCheck, CreditCard, Dumbbell, LineChart } from "lucide-react"
import { DeleteAccount, SignOutButton } from "@/components/auth/account-actions"
import { FormMessage } from "@/components/auth/auth-ui"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Área do Aluno — Chico's Gym",
  robots: { index: false },
}

// O que vem nas próximas etapas da Área do Aluno.
const UPCOMING = [
  { icon: Dumbbell, title: "Seus treinos", text: "A ficha escolhida no Descubra seu Treino, salva na sua conta." },
  { icon: LineChart, title: "Cargas e evolução", text: "Anote a carga de cada exercício e acompanhe sua evolução." },
  { icon: CreditCard, title: "Plano e vencimento", text: "Seu plano ativo, a data de vencimento e o aviso de renovação." },
  { icon: CalendarCheck, title: "Frequência", text: "Quantos dias você treinou na semana e no mês." },
]

export default async function AlunoPage(props: PageProps<"/aluno">) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const claims = auth?.claims
  if (!claims?.sub) redirect("/entrar?next=/aluno")

  const { data: profile } = await supabase.from("profiles").select("full_name, created_at").eq("id", claims.sub).single()
  const params = await props.searchParams
  const firstName = profile?.full_name.split(" ")[0] ?? "aluno"
  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : null

  return (
    <main className="pt-24 md:pt-28">
      <section className="relative bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="flex items-center gap-3">
            <span className="diamond" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">Área do Aluno</span>
          </div>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-wide text-offwhite md:text-6xl">
            Olá, {firstName}!
          </h1>
          <p className="mt-3 text-sm text-offwhite/60">
            {claims.email as string}
            {memberSince && ` · conta criada em ${memberSince}`}
          </p>

          {params.senha === "nova" && (
            <div className="mt-6 max-w-md">
              <FormMessage tone="success">Senha alterada com sucesso.</FormMessage>
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {UPCOMING.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-sm border border-line bg-carbon p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-orange/10 text-orange">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-xl uppercase tracking-wide text-offwhite">{title}</p>
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-offwhite/50">
                      Em breve
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-offwhite/60">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-6 border-t border-line pt-8">
            <SignOutButton />
            <DeleteAccount />
          </div>
        </div>
      </section>
    </main>
  )
}
