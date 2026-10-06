import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { DeleteAccount, SignOutButton } from "@/components/auth/account-actions"
import { FormMessage } from "@/components/auth/auth-ui"
import { AlunoDashboard } from "@/components/aluno/dashboard"
import { ALUNO_TABS, type AlunoTab, type LoadEntry } from "@/components/aluno/types"
import { todayISO } from "@/lib/aluno"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Área do Aluno — Chico's Gym",
  robots: { index: false },
}

const NOTICES: Record<string, string> = {
  salvo: "Treino registrado! Bom trabalho.",
  ficha: "Ficha salva na sua conta.",
}

export default async function AlunoPage(props: PageProps<"/aluno">) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const claims = auth?.claims
  if (!claims?.sub) redirect("/entrar?next=/aluno")
  const userId = claims.sub

  // Sempre filtrando pelo próprio aluno: quem é da equipe enxerga mais linhas
  // pelo RLS, mas esta página mostra só os dados da própria pessoa.
  const [profile, staff, workout, membership, sessions, logs] = await Promise.all([
    supabase.from("profiles").select("full_name, created_at").eq("id", userId).single(),
    supabase.from("staff").select("user_id").eq("user_id", userId).maybeSingle(),
    supabase
      .from("student_workouts")
      .select("sex, frequency, goal, experience, injury_note")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("memberships").select("plan, starts_on, expires_on").eq("user_id", userId).maybeSingle(),
    supabase
      .from("workout_sessions")
      .select("id, trained_on, day_index, day_focus, plan_sex, plan_frequency")
      .eq("user_id", userId)
      .order("trained_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("exercise_logs")
      .select("exercise, load_kg, workout_sessions(trained_on)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(5000),
  ])

  const params = await props.searchParams
  const aba = typeof params.aba === "string" && ALUNO_TABS.includes(params.aba as AlunoTab) ? (params.aba as AlunoTab) : "treino"
  const notice = typeof params.treino === "string" ? NOTICES[params.treino] : null
  const firstName = profile.data?.full_name.split(" ")[0] ?? "aluno"
  const memberSince = profile.data
    ? new Date(profile.data.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : null

  const loads: LoadEntry[] = (logs.data ?? []).flatMap((l) =>
    l.workout_sessions ? [{ exercise: l.exercise, load_kg: l.load_kg, trained_on: l.workout_sessions.trained_on }] : []
  )

  return (
    <main className="pt-24 md:pt-28">
      <section className="relative bg-ink py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
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
            </div>
            {staff.data && (
              <Link
                href="/aluno/equipe"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-sm border border-orange/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-orange transition-colors hover:bg-orange/10"
              >
                <ShieldCheck size={14} />
                Painel da equipe
              </Link>
            )}
          </div>

          {(notice || params.senha === "nova") && (
            <div className="mt-6 max-w-md">
              <FormMessage tone="success">{notice ?? "Senha alterada com sucesso."}</FormMessage>
            </div>
          )}

          <AlunoDashboard
            initialTab={aba}
            firstName={firstName}
            today={todayISO()}
            workout={workout.data}
            membership={membership.data}
            sessions={sessions.data ?? []}
            loads={loads}
          />

          <div className="mt-14 flex flex-col items-start gap-6 border-t border-line pt-8">
            <SignOutButton />
            <DeleteAccount />
          </div>
        </div>
      </section>
    </main>
  )
}
