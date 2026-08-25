"use client"

import { FormEvent, useState } from "react"
import { Send, Wand2 } from "lucide-react"
import { brand, exercisePool, type MuscleGroup, type WorkoutExercise } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

type Goal = "hipertrofia" | "emagrecimento" | "condicionamento"

const GOALS: { id: Goal; label: string; setsReps: string; note?: string }[] = [
  { id: "hipertrofia", label: "Hipertrofia", setsReps: "4 séries x 8-12 repetições" },
  {
    id: "emagrecimento",
    label: "Emagrecimento",
    setsReps: "3 séries x 15-20 repetições",
    note: "Feche cada treino com 15-20 minutos de cardio.",
  },
  {
    id: "condicionamento",
    label: "Condicionamento",
    setsReps: "3 séries x 12-15 repetições",
    note: "Descanso curto entre séries: 30-45 segundos.",
  },
]

const DAY_OPTIONS = [2, 3, 4, 5, 6]

type WorkoutDay = { label: string; exercises: WorkoutExercise[] }

function buildSplit(days: number): { label: string; groups: MuscleGroup[] }[] {
  const letter = (i: number) => String.fromCharCode(65 + i)
  if (days <= 3) {
    const groups: MuscleGroup[] = ["peito", "costas", "pernas", "ombros", "bracos", "core"]
    return Array.from({ length: days }, (_, i) => ({ label: `Dia ${letter(i)} — Corpo Inteiro`, groups }))
  }
  if (days <= 5) {
    const upper: MuscleGroup[] = ["peito", "costas", "ombros", "bracos"]
    const lower: MuscleGroup[] = ["pernas", "core"]
    return Array.from({ length: days }, (_, i) => ({
      label: `Dia ${letter(i)} — ${i % 2 === 0 ? "Superior" : "Inferior"}`,
      groups: i % 2 === 0 ? upper : lower,
    }))
  }
  const pattern: { label: string; groups: MuscleGroup[] }[] = [
    { label: "Push — Peito, Ombro e Tríceps", groups: ["peito", "ombros", "bracos"] },
    { label: "Pull — Costas e Bíceps", groups: ["costas", "bracos"] },
    { label: "Legs — Pernas e Core", groups: ["pernas", "core"] },
  ]
  return Array.from({ length: 6 }, (_, i) => ({
    label: `Dia ${letter(i)} — ${pattern[i % 3].label}`,
    groups: pattern[i % 3].groups,
  }))
}

function pickExercises(group: MuscleGroup, count: number, offset: number): WorkoutExercise[] {
  const pool = exercisePool.filter((e) => e.group === group)
  if (pool.length === 0) return []
  return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length])
}

function buildWorkout(goal: Goal, days: number): WorkoutDay[] {
  const split = buildSplit(days)
  return split.map((day, i) => {
    const perGroup = day.groups.length <= 3 ? 2 : 1
    const exercises = day.groups.flatMap((group) => pickExercises(group, perGroup, i))
    if (goal === "emagrecimento") exercises.push(...pickExercises("cardio", 1, 0))
    return { label: day.label, exercises }
  })
}

export function WorkoutBuilder() {
  const [name, setName] = useState("")
  const [goal, setGoal] = useState<Goal>("hipertrofia")
  const [days, setDays] = useState(3)
  const [plan, setPlan] = useState<WorkoutDay[] | null>(null)

  const goalConfig = GOALS.find((g) => g.id === goal)!

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault()
    setPlan(buildWorkout(goal, days))
  }

  const handleSendWhatsapp = () => {
    if (!plan) return
    const lines = [
      `Oi! Sou ${name || "um visitante do site"} e montei um treino sugerido no site da Chico's Gym.`,
      `Objetivo: ${goalConfig.label} · ${days}x por semana`,
      "",
      ...plan.flatMap((day) => [
        `${day.label}:`,
        ...day.exercises.map((ex) => `- ${ex.name} (${goalConfig.setsReps})`),
        "",
      ]),
      "Pode me ajudar a ajustar isso com um personal trainer?",
    ]
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank")
  }

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Monte seu Treino"
          title="Sua sugestão de treino em 3 respostas"
          description="Um ponto de partida pra sua primeira semana — a equipe ajusta a carga e a execução com você no local."
        />

        <Reveal delay={100}>
          <form
            onSubmit={handleGenerate}
            className="mt-12 flex flex-col gap-8 rounded-sm border border-line bg-carbon p-8"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                Seu nome (opcional)
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                placeholder="Como podemos te chamar?"
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">Objetivo</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {GOALS.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    data-cursor-hover
                    className={`rounded-sm border px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.05em] transition-colors ${
                      goal === g.id
                        ? "border-orange bg-orange/10 text-orange"
                        : "border-line text-offwhite/70 hover:border-orange/50"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                Dias por semana
              </span>
              <div className="flex flex-wrap gap-3">
                {DAY_OPTIONS.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDays(d)}
                    data-cursor-hover
                    className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                      days === d
                        ? "border-orange bg-orange text-ink"
                        : "border-line text-offwhite/70 hover:border-orange/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Magnetic className="w-fit">
              <button
                type="submit"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-sm bg-orange px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold"
              >
                <Wand2 size={14} />
                Gerar meu treino
              </button>
            </Magnetic>
          </form>
        </Reveal>

        {plan && (
          <Reveal delay={0} className="mt-10">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {plan.map((day) => (
                  <div key={day.label} className="rounded-sm border border-line bg-carbon p-6">
                    <h3 className="font-display text-lg uppercase tracking-wide text-orange">{day.label}</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {day.exercises.map((ex, idx) => (
                        <li key={`${ex.name}-${idx}`} className="text-sm text-offwhite/75">
                          {ex.name}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs uppercase tracking-[0.1em] text-offwhite/40">{goalConfig.setsReps}</p>
                  </div>
                ))}
              </div>
              {goalConfig.note && <p className="text-sm text-offwhite/60">{goalConfig.note}</p>}
              <p className="text-xs text-offwhite/40">
                Sugestão automática, não substitui avaliação de um profissional. Ajuste cargas e execução com a
                equipe da Chico&apos;s Gym.
              </p>
              <Magnetic className="w-fit">
                <button
                  type="button"
                  onClick={handleSendWhatsapp}
                  data-cursor-hover
                  className="inline-flex items-center gap-2 rounded-sm border border-line px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
                >
                  <Send size={14} />
                  Mandar treino pro WhatsApp
                </button>
              </Magnetic>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
