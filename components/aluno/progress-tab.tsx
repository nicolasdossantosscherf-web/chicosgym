"use client"

import { useState } from "react"
import { ChevronDown, LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { formatDate, formatKg } from "@/lib/aluno"
import { findWorkoutPlan, type WorkoutFrequency, type WorkoutSex } from "@/lib/workouts"
import type { LoadEntry, StudentWorkout } from "./types"

type ExerciseProgress = {
  exercise: string
  history: { load: number; date: string }[]
}

function buildProgress(loads: LoadEntry[], workout: StudentWorkout | null): ExerciseProgress[] {
  const byExercise = new Map<string, { load: number; date: string }[]>()
  for (const entry of loads) {
    if (entry.load_kg === null) continue
    const list = byExercise.get(entry.exercise) ?? []
    list.push({ load: Number(entry.load_kg), date: entry.trained_on })
    byExercise.set(entry.exercise, list)
  }
  // Exercícios da ficha atual primeiro, na ordem da ficha; depois os antigos.
  const plan = workout ? findWorkoutPlan(workout.sex as WorkoutSex, workout.frequency as WorkoutFrequency) : null
  const order = plan ? plan.days.flatMap((d) => d.exercises.map((e) => e.name)) : []
  const rank = (name: string) => {
    const i = order.indexOf(name)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  return [...byExercise.entries()]
    .map(([exercise, history]) => ({ exercise, history: history.sort((a, b) => a.date.localeCompare(b.date)) }))
    .sort((a, b) => rank(a.exercise) - rank(b.exercise) || a.exercise.localeCompare(b.exercise))
}

export function ProgressTab({ loads, workout }: { loads: LoadEntry[]; workout: StudentWorkout | null }) {
  const progress = buildProgress(loads, workout)
  const [open, setOpen] = useState<string | null>(null)

  if (progress.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-sm border border-line bg-carbon p-6 md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-orange/10 text-orange">
          <LineChart size={24} />
        </div>
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Nenhuma carga anotada ainda</p>
        <p className="max-w-lg text-sm text-offwhite/60">
          Na aba Treino, toque em &ldquo;Treinar este dia&rdquo; e anote a carga de cada exercício. A cada treino, sua
          evolução aparece aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-offwhite/60">Carga usada nas séries válidas de cada exercício, treino a treino.</p>
      <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-sm border border-line bg-carbon">
        {progress.map(({ exercise, history }) => {
          const first = history[0]
          const last = history[history.length - 1]
          const best = Math.max(...history.map((h) => h.load))
          const delta = last.load - first.load
          const isOpen = open === exercise
          return (
            <li key={exercise}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : exercise)}
                aria-expanded={isOpen}
                data-cursor-hover
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/40"
              >
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-offwhite">{exercise}</span>
                  <span className="mt-0.5 block text-xs text-offwhite/50">
                    Última: {formatKg(last.load)} em {formatDate(last.date, { day: "2-digit", month: "2-digit" })} ·
                    Recorde: {formatKg(best)}
                  </span>
                </span>
                {history.length > 1 && delta !== 0 ? (
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 text-xs font-semibold ${
                      delta > 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {delta > 0 ? "+" : "−"}
                    {formatKg(Math.abs(delta))}
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-offwhite/40">
                    {history.length === 1 ? "1º registro" : "Mantida"}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-offwhite/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="flex flex-col gap-1 border-t border-line bg-ink/40 px-5 py-3 text-sm">
                  {[...history]
                    .reverse()
                    .slice(0, 12)
                    .map((h, i) => (
                      <li key={`${h.date}-${i}`} className="flex justify-between text-offwhite/70">
                        <span>{formatDate(h.date)}</span>
                        <span className="font-semibold text-offwhite">{formatKg(h.load)}</span>
                      </li>
                    ))}
                  {history.length > 1 && (
                    <li className="mt-1 text-xs text-offwhite/40">
                      Desde {formatDate(first.date)}: de {formatKg(first.load)} para {formatKg(last.load)}.
                    </li>
                  )}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
