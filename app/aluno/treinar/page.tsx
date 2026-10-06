import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { WorkoutLogger } from "@/components/aluno/workout-logger"
import { suggestedDayIndex } from "@/components/aluno/workout-tab"
import { todayISO } from "@/lib/aluno"
import { createClient } from "@/lib/supabase/server"
import { findWorkoutPlan, type WorkoutFrequency, type WorkoutSex } from "@/lib/workouts"

export const metadata: Metadata = {
  title: "Modo treino — Área do Aluno — Chico's Gym",
  robots: { index: false },
}

export default async function TreinarPage(props: PageProps<"/aluno/treinar">) {
  const params = await props.searchParams
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub
  if (!userId) redirect(`/entrar?next=${encodeURIComponent(`/aluno/treinar?dia=${params.dia ?? 1}`)}`)

  const { data: workout } = await supabase
    .from("student_workouts")
    .select("sex, frequency, goal, experience, injury_note")
    .eq("user_id", userId)
    .maybeSingle()
  if (!workout) redirect("/aluno?aba=treino")

  const plan = findWorkoutPlan(workout.sex as WorkoutSex, workout.frequency as WorkoutFrequency)
  if (!plan) redirect("/aluno?aba=treino")

  const today = todayISO()
  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select("id, trained_on, day_index, day_focus, plan_sex, plan_frequency")
    .eq("user_id", userId)
    .order("trained_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)

  const requested = Number(params.dia)
  const dayIndex =
    Number.isInteger(requested) && requested >= 1 && requested <= plan.days.length
      ? requested - 1
      : suggestedDayIndex(workout, sessions ?? [])
  const day = plan.days[dayIndex]

  // Última carga de cada exercício (de qualquer treino anterior a hoje).
  const { data: logs } = await supabase
    .from("exercise_logs")
    .select("exercise, load_kg, session_id, workout_sessions(trained_on)")
    .eq("user_id", userId)
    .in("exercise", day.exercises.map((e) => e.name))
    .order("created_at", { ascending: false })
    .limit(1000)

  const todaySession = (sessions ?? []).find(
    (s) => s.trained_on === today && s.day_index === dayIndex && s.plan_sex === workout.sex && s.plan_frequency === workout.frequency
  )

  const lastLoads: Record<string, { load: number; date: string }> = {}
  const existingLoads: Record<string, number | null> = {}
  for (const log of logs ?? []) {
    const date = log.workout_sessions?.trained_on
    if (todaySession && log.session_id === todaySession.id) {
      existingLoads[log.exercise] = log.load_kg
      continue
    }
    if (date && log.load_kg !== null && !lastLoads[log.exercise]) lastLoads[log.exercise] = { load: Number(log.load_kg), date }
  }

  return (
    <main className="pt-24 md:pt-28">
      <section className="relative bg-ink py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="flex items-center gap-3">
            <span className="diamond" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">Modo treino</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.days.map((d, i) => (
              <Link
                key={i}
                href={`/aluno/treinar?dia=${i + 1}`}
                replace
                data-cursor-hover
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  i === dayIndex ? "border-orange bg-orange text-ink" : "border-line text-offwhite/70 hover:border-orange"
                }`}
              >
                Dia {i + 1}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <WorkoutLogger
              key={`${dayIndex}-${todaySession?.id ?? "novo"}`}
              userId={userId}
              today={today}
              planSex={workout.sex}
              planFrequency={workout.frequency}
              dayIndex={dayIndex}
              day={day}
              lastLoads={lastLoads}
              existing={todaySession ? { sessionId: todaySession.id, loads: existingLoads } : null}
              injuryNote={workout.injury_note}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
