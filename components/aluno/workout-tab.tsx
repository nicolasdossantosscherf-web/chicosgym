"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AlertTriangle, ArrowRight, Bike, CheckCircle2, Dumbbell, Flame, Timer } from "lucide-react"
import {
  WORKOUT_CARDIO,
  WORKOUT_REST,
  WORKOUT_WARMUP,
  findWorkoutPlan,
  workoutExperiences,
  workoutGoals,
  type WorkoutFrequency,
  type WorkoutSex,
} from "@/lib/workouts"
import type { SessionItem, StudentWorkout } from "./types"

const SEX_LABEL: Record<string, string> = { feminino: "Feminino", masculino: "Masculino" }
const DAY_COLORS = ["bg-[#3b78c4]", "bg-[#e8691f]", "bg-[#2e9a52]", "bg-[#cf5f93]", "bg-[#d24b40]"]

// LGPD: a lesão é dado de saúde, e o aluno pode apagá-la a qualquer momento.
function RemoveInjuryButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const remove = async () => {
    if (!window.confirm("Remover a lesão salva na sua conta?")) return
    setPending(true)
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    if (data.user) await supabase.from("student_workouts").update({ injury_note: null }).eq("user_id", data.user.id)
    setPending(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      data-cursor-hover
      className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-offwhite/50 hover:text-red-400 disabled:opacity-50"
    >
      Remover
    </button>
  )
}

// Dia sugerido: o seguinte ao último treino feito com a mesma ficha.
export function suggestedDayIndex(workout: StudentWorkout, sessions: SessionItem[]) {
  const last = sessions.find((s) => s.plan_sex === workout.sex && s.plan_frequency === workout.frequency)
  return last ? (last.day_index + 1) % workout.frequency : 0
}

export function WorkoutTab({
  workout,
  sessions,
  today,
}: {
  workout: StudentWorkout | null
  sessions: SessionItem[]
  today: string
}) {
  if (!workout) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-line bg-carbon p-6 md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-orange/10 text-orange">
          <Dumbbell size={24} />
        </div>
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Escolha sua ficha</p>
        <p className="max-w-lg text-sm text-offwhite/60">
          Responda as 5 perguntas do Descubra seu Treino e toque em &ldquo;Salvar na minha conta&rdquo;. A ficha fica
          aqui, pronta pra você treinar e anotar suas cargas.
        </p>
        <Link
          href="/treino"
          data-cursor-hover
          className="inline-flex items-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
        >
          Descobrir meu treino
          <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  const plan = findWorkoutPlan(workout.sex as WorkoutSex, workout.frequency as WorkoutFrequency)
  if (!plan) return null

  const goal = workoutGoals.find((g) => g.id === workout.goal)
  const experience = workoutExperiences.find((x) => x.id === workout.experience)
  const next = suggestedDayIndex(workout, sessions)
  const doneToday = new Set(
    sessions
      .filter((s) => s.trained_on === today && s.plan_sex === workout.sex && s.plan_frequency === workout.frequency)
      .map((s) => s.day_index)
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange">Sua ficha</p>
          <p className="mt-1 font-display text-4xl uppercase tracking-wide text-offwhite">
            Treino {SEX_LABEL[workout.sex]} {workout.frequency}x
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[goal?.label, experience?.label].filter(Boolean).map((chip) => (
              <span key={chip} className="rounded-full border border-line px-3 py-1 text-xs text-offwhite/70">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/treino"
          data-cursor-hover
          className="text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/60 transition-colors hover:text-orange"
        >
          Trocar ficha
        </Link>
      </div>

      {workout.injury_note && (
        <div className="flex items-start gap-3 rounded-sm border border-amber-400/40 bg-amber-400/5 p-4 text-sm text-offwhite/75">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <span className="flex-1">
            Lesão informada: &ldquo;{workout.injury_note}&rdquo;. Os exercícios que forçam essa região aparecem marcados
            no modo treino — use menos carga e mais calma neles.
          </span>
          <RemoveInjuryButton />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { icon: Flame, title: "1ª série: aquecimento", text: WORKOUT_WARMUP },
          { icon: Timer, title: "Descanso: 2 minutos", text: WORKOUT_REST },
          { icon: Bike, title: "Cardio no final", text: WORKOUT_CARDIO },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-sm border border-line bg-carbon p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-orange/10 text-orange">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-offwhite">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-offwhite/60">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plan.days.map((day, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-line bg-carbon">
            <div className={`${DAY_COLORS[i]} flex items-start justify-between gap-2 px-5 py-3`}>
              <div>
                <p className="font-display text-2xl uppercase leading-none tracking-wide text-white">Dia {i + 1}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90">{day.focus}</p>
              </div>
              {doneToday.has(i) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-ink/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  <CheckCircle2 size={12} />
                  Feito hoje
                </span>
              ) : (
                i === next && (
                  <span className="rounded-full bg-ink/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                    Próximo
                  </span>
                )
              )}
            </div>
            <ul className="flex-1 px-5 py-3 text-sm text-offwhite/70">
              {day.exercises.map((e) => (
                <li key={e.name} className="flex justify-between gap-3 py-1">
                  <span>{e.name}</span>
                  <span className="shrink-0 text-xs text-offwhite/40">
                    {e.sets}x {e.reps}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={`/aluno/treinar?dia=${i + 1}`}
              data-cursor-hover
              className={`m-4 mt-0 inline-flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                i === next && !doneToday.has(i)
                  ? "bg-orange text-ink hover:bg-gold"
                  : "border border-line text-offwhite/80 hover:border-orange hover:text-orange"
              }`}
            >
              {doneToday.has(i) ? "Ver / corrigir" : "Treinar este dia"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
