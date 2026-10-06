"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { addMonths, formatDate, weekStart } from "@/lib/aluno"
import { createClient } from "@/lib/supabase/client"
import type { SessionItem, StudentWorkout } from "./types"

const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"]

function monthGrid(monthISO: string) {
  // monthISO = "AAAA-MM-01"; grade começa na segunda-feira.
  const [y, m] = monthISO.split("-").map(Number)
  const first = new Date(Date.UTC(y, m - 1, 1, 12))
  const daysInMonth = new Date(Date.UTC(y, m, 0, 12)).getUTCDate()
  const offset = (first.getUTCDay() + 6) % 7
  const cells: (string | null)[] = Array.from({ length: offset }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${monthISO.slice(0, 8)}${String(d).padStart(2, "0")}`)
  return cells
}

export function FrequencyTab({
  sessions,
  workout,
  today,
}: {
  sessions: SessionItem[]
  workout: StudentWorkout | null
  today: string
}) {
  const router = useRouter()
  const [month, setMonth] = useState(`${today.slice(0, 7)}-01`)
  const [removing, setRemoving] = useState<string | null>(null)

  const trainedDates = new Set(sessions.map((s) => s.trained_on))
  const thisWeek = weekStart(today)
  const weekCount = new Set(sessions.filter((s) => s.trained_on >= thisWeek && s.trained_on <= today).map((s) => s.trained_on)).size
  const monthPrefix = today.slice(0, 7)
  const monthCount = new Set(sessions.filter((s) => s.trained_on.startsWith(monthPrefix)).map((s) => s.trained_on)).size
  const target = workout?.frequency ?? null
  const last = sessions[0]

  const remove = async (id: string) => {
    if (!window.confirm("Remover este treino do seu histórico? As cargas anotadas nele também saem.")) return
    setRemoving(id)
    await createClient().from("workout_sessions").delete().eq("id", id)
    setRemoving(null)
    router.refresh()
  }

  const stats = [
    { label: "Nesta semana", value: target ? `${weekCount} de ${target}` : String(weekCount) },
    { label: "Neste mês", value: `${monthCount} ${monthCount === 1 ? "dia" : "dias"}` },
    { label: "Total", value: `${trainedDates.size} ${trainedDates.size === 1 ? "dia" : "dias"}` },
    { label: "Último treino", value: last ? formatDate(last.trained_on, { day: "2-digit", month: "2-digit" }) : "—" },
  ]

  const cells = monthGrid(month)
  const monthTitle = new Date(`${month}T12:00:00Z`).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-line bg-carbon p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">{s.label}</p>
            <p className="mt-1 font-display text-3xl uppercase tracking-wide text-offwhite">{s.value}</p>
          </div>
        ))}
      </div>

      {target && (
        <div className="rounded-sm border border-line bg-carbon p-4">
          <div className="flex items-center justify-between text-xs text-offwhite/60">
            <span>Meta da semana ({target} treinos)</span>
            <span>{Math.min(100, Math.round((weekCount / target) * 100))}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-orange transition-all"
              style={{ width: `${Math.min(100, (weekCount / target) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="rounded-sm border border-line bg-carbon p-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, -1))}
            aria-label="Mês anterior"
            data-cursor-hover
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-offwhite/70 hover:border-orange hover:text-orange"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="font-display text-2xl uppercase tracking-wide text-offwhite">{monthTitle}</p>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            disabled={month >= `${monthPrefix}-01`}
            aria-label="Próximo mês"
            data-cursor-hover
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-offwhite/70 hover:border-orange hover:text-orange disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-offwhite/40">
              {d}
            </span>
          ))}
          {cells.map((date, i) =>
            date ? (
              <span
                key={date}
                aria-label={`${formatDate(date)}${trainedDates.has(date) ? ", treinou" : ""}`}
                className={`flex aspect-square items-center justify-center rounded-sm text-sm ${
                  trainedDates.has(date)
                    ? "bg-orange font-semibold text-ink"
                    : date === today
                      ? "border border-orange/60 text-offwhite"
                      : "text-offwhite/50"
                }`}
              >
                {Number(date.slice(8))}
              </span>
            ) : (
              <span key={`empty-${i}`} />
            )
          )}
        </div>
      </div>

      {sessions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">Últimos treinos</p>
          <ul className="mt-3 flex flex-col divide-y divide-line overflow-hidden rounded-sm border border-line bg-carbon">
            {sessions.slice(0, 10).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span>
                  <span className="font-semibold text-offwhite">{formatDate(s.trained_on)}</span>
                  <span className="text-offwhite/60">
                    {" "}
                    · Dia {s.day_index + 1} — {s.day_focus}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  disabled={removing === s.id}
                  aria-label={`Remover treino de ${formatDate(s.trained_on)}`}
                  data-cursor-hover
                  className="text-offwhite/30 transition-colors hover:text-red-400 disabled:opacity-40"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
