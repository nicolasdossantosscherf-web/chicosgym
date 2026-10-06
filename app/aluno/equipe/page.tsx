import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { StaffPanel, type StaffStudent } from "@/components/aluno/staff-panel"
import { addDays, todayISO } from "@/lib/aluno"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Painel da equipe — Chico's Gym",
  robots: { index: false },
}

// Só para quem está na tabela "staff". O banco também bloqueia por conta
// própria (RLS): mesmo que alguém abra esta página, não vê nem altera nada.
export default async function EquipePage() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub
  if (!userId) redirect("/entrar?next=/aluno/equipe")

  const { data: staff } = await supabase.from("staff").select("user_id").eq("user_id", userId).maybeSingle()
  if (!staff) redirect("/aluno")

  const today = todayISO()
  const [profiles, memberships, sessions] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
    supabase.from("memberships").select("user_id, plan, starts_on, expires_on"),
    supabase
      .from("workout_sessions")
      .select("user_id, trained_on")
      .gte("trained_on", addDays(today, -365))
      .order("trained_on", { ascending: false })
      .limit(20000),
  ])

  const since30 = addDays(today, -30)
  const activity = new Map<string, { last: string; days: Set<string> }>()
  for (const s of sessions.data ?? []) {
    const entry = activity.get(s.user_id) ?? { last: s.trained_on, days: new Set<string>() }
    if (s.trained_on >= since30) entry.days.add(s.trained_on)
    activity.set(s.user_id, entry)
  }
  const membershipByUser = new Map((memberships.data ?? []).map((m) => [m.user_id, m]))

  const students: StaffStudent[] = (profiles.data ?? []).map((p) => {
    const m = membershipByUser.get(p.id)
    const a = activity.get(p.id)
    return {
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      membership: m ? { plan: m.plan, starts_on: m.starts_on, expires_on: m.expires_on } : null,
      lastTrainedOn: a?.last ?? null,
      trainedLast30: a?.days.size ?? 0,
    }
  })

  return (
    <main className="pt-24 md:pt-28">
      <section className="relative bg-ink py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Link
            href="/aluno"
            data-cursor-hover
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/60 hover:text-orange"
          >
            <ArrowLeft size={14} />
            Minha área
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="diamond" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">Painel da equipe</span>
          </div>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-wide text-offwhite md:text-6xl">
            Alunos e planos
          </h1>
          <p className="mt-3 max-w-xl text-sm text-offwhite/60">
            Registre o plano e o vencimento de cada aluno. Quem criou conta no site aparece aqui automaticamente.
          </p>
          <StaffPanel students={students} staffId={userId} today={today} />
        </div>
      </section>
    </main>
  )
}
