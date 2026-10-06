"use client"

import { useState } from "react"
import { CalendarCheck, CreditCard, Dumbbell, LineChart } from "lucide-react"
import { formatDate, membershipStatus, planLabel, weekStart } from "@/lib/aluno"
import { FrequencyTab } from "./frequency-tab"
import { PlanTab } from "./plan-tab"
import { ProgressTab } from "./progress-tab"
import { WorkoutTab } from "./workout-tab"
import type { AlunoTab, LoadEntry, Membership, SessionItem, StudentWorkout } from "./types"

const SEX_LABEL: Record<string, string> = { feminino: "Feminino", masculino: "Masculino" }

export function AlunoDashboard({
  initialTab,
  firstName,
  today,
  workout,
  membership,
  sessions,
  loads,
}: {
  initialTab: AlunoTab
  firstName: string
  today: string
  workout: StudentWorkout | null
  membership: Membership | null
  sessions: SessionItem[]
  loads: LoadEntry[]
}) {
  const [tab, setTab] = useState<AlunoTab>(initialTab)

  const select = (next: AlunoTab) => {
    setTab(next)
    // Guarda a aba no endereço (voltar/atualizar mantém), sem recarregar a página.
    const url = new URL(window.location.href)
    url.searchParams.set("aba", next)
    url.searchParams.delete("treino")
    window.history.replaceState(null, "", url)
  }

  const week = weekStart(today)
  const weekCount = new Set(sessions.filter((s) => s.trained_on >= week).map((s) => s.trained_on)).size
  const exercisesWithLoad = new Set(loads.filter((l) => l.load_kg !== null).map((l) => l.exercise)).size
  const status = membership ? membershipStatus(membership.expires_on, today) : null

  const cards: { id: AlunoTab; icon: typeof Dumbbell; title: string; value: string; tone?: string }[] = [
    {
      id: "treino",
      icon: Dumbbell,
      title: "Seus treinos",
      value: workout ? `Treino ${SEX_LABEL[workout.sex]} ${workout.frequency}x` : "Escolha sua ficha",
    },
    {
      id: "evolucao",
      icon: LineChart,
      title: "Cargas e evolução",
      value: exercisesWithLoad
        ? `${exercisesWithLoad} ${exercisesWithLoad === 1 ? "exercício" : "exercícios"} com carga`
        : "Nenhuma carga anotada",
    },
    {
      id: "plano",
      icon: CreditCard,
      title: "Plano e vencimento",
      value: membership
        ? `${planLabel(membership.plan)} · ${status?.state === "expired" ? "venceu" : "vence"} ${formatDate(membership.expires_on, { day: "2-digit", month: "2-digit" })}`
        : "Sem plano registrado",
      tone: status?.state === "expired" ? "text-red-400" : status?.state === "expiring" ? "text-amber-400" : undefined,
    },
    {
      id: "frequencia",
      icon: CalendarCheck,
      title: "Frequência",
      value: workout ? `${weekCount} de ${workout.frequency} nesta semana` : `${weekCount} nesta semana`,
    },
  ]

  return (
    <div className="mt-10 flex flex-col gap-8">
      <div role="tablist" aria-label="Área do Aluno" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ id, icon: Icon, title, value, tone }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => select(id)}
              data-cursor-hover
              className={`flex flex-col items-start gap-3 rounded-sm border p-4 text-left transition-colors md:p-5 ${
                active ? "border-orange bg-orange/10" : "border-line bg-carbon hover:border-orange/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-sm ${
                  active ? "bg-orange text-ink" : "bg-orange/10 text-orange"
                }`}
              >
                <Icon size={20} />
              </div>
              <span>
                <span className="block font-display text-lg uppercase leading-tight tracking-wide text-offwhite md:text-xl">
                  {title}
                </span>
                <span className={`mt-1 block text-xs ${tone ?? "text-offwhite/60"}`}>{value}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" key={tab} className="animate-step-in">
        {tab === "treino" && <WorkoutTab workout={workout} sessions={sessions} today={today} />}
        {tab === "evolucao" && <ProgressTab loads={loads} workout={workout} />}
        {tab === "frequencia" && <FrequencyTab sessions={sessions} workout={workout} today={today} />}
        {tab === "plano" && <PlanTab membership={membership} today={today} firstName={firstName} />}
      </div>
    </div>
  )
}
