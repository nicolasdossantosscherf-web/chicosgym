"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, Check, Flame, Loader2 } from "lucide-react"
import { formatDate, formatKg } from "@/lib/aluno"
import { createClient } from "@/lib/supabase/client"
import { WORKOUT_CARDIO, detectInjuryRegions, exerciseRisks, type WorkoutDay } from "@/lib/workouts"
import { FormMessage } from "@/components/auth/auth-ui"
import { RestTimer } from "./rest-timer"

type Entry = { done: boolean; load: string }

const DAY_COLORS = ["bg-[#3b78c4]", "bg-[#e8691f]", "bg-[#2e9a52]", "bg-[#cf5f93]", "bg-[#d24b40]"]

function parseLoad(value: string) {
  const n = Number(value.replace(",", "."))
  return value.trim() !== "" && Number.isFinite(n) && n >= 0 && n <= 999 ? Math.round(n * 10) / 10 : null
}

export function WorkoutLogger({
  userId,
  today,
  planSex,
  planFrequency,
  dayIndex,
  day,
  lastLoads,
  existing,
  injuryNote,
}: {
  userId: string
  today: string
  planSex: string
  planFrequency: number
  dayIndex: number
  day: WorkoutDay
  lastLoads: Record<string, { load: number; date: string }>
  existing: { sessionId: string; loads: Record<string, number | null> } | null
  injuryNote: string | null
}) {
  const router = useRouter()
  const draftKey = `chicos-treino-${today}-${planSex}-${planFrequency}-${dayIndex}`
  const regions = useMemo(() => (injuryNote ? detectInjuryRegions(injuryNote) : []), [injuryNote])

  const initial = () => {
    const base: Record<string, Entry> = {}
    for (const e of day.exercises) {
      const saved = existing?.loads[e.name]
      base[e.name] = existing && e.name in existing.loads
        ? { done: true, load: saved === null || saved === undefined ? "" : String(saved).replace(".", ",") }
        : { done: false, load: "" }
    }
    return base
  }

  const [entries, setEntries] = useState<Record<string, Entry>>(initial)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Rascunho no celular: se a tela bloquear ou a página recarregar, nada se perde.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setEntries((current) => ({ ...current, ...JSON.parse(raw) }))
    } catch {
      // Sem acesso ao armazenamento: segue sem rascunho.
    }
  }, [draftKey])

  const update = (name: string, patch: Partial<Entry>) => {
    setEntries((current) => {
      const next = { ...current, [name]: { ...current[name], ...patch } }
      try {
        localStorage.setItem(draftKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const doneCount = day.exercises.filter((e) => entries[e.name]?.done).length

  const save = async () => {
    setError(null)
    const done = day.exercises.filter((e) => entries[e.name]?.done)
    if (done.length === 0) {
      setError("Marque pelo menos um exercício como feito.")
      return
    }
    const invalid = done.find((e) => entries[e.name].load.trim() !== "" && parseLoad(entries[e.name].load) === null)
    if (invalid) {
      setError(`Confira a carga de "${invalid.name}" — use só números, como 40 ou 12,5.`)
      return
    }

    setPending(true)
    const supabase = createClient()
    let sessionId = existing?.sessionId ?? null

    if (sessionId) {
      // Corrigindo um treino de hoje: troca as cargas antigas pelas novas.
      const { error } = await supabase.from("exercise_logs").delete().eq("session_id", sessionId)
      if (error) return fail()
    } else {
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({ trained_on: today, plan_sex: planSex, plan_frequency: planFrequency, day_index: dayIndex, day_focus: day.focus })
        .select("id")
        .single()
      if (error || !data) {
        // Já registrado (ex.: em outra aba): reaproveita o mesmo treino.
        const { data: found } = await supabase
          .from("workout_sessions")
          .select("id")
          .eq("user_id", userId)
          .eq("trained_on", today)
          .eq("day_index", dayIndex)
          .maybeSingle()
        if (!found) return fail()
        sessionId = found.id
        await supabase.from("exercise_logs").delete().eq("session_id", sessionId)
      } else {
        sessionId = data.id
      }
    }

    const { error: logError } = await supabase.from("exercise_logs").insert(
      done.map((e) => ({ session_id: sessionId!, exercise: e.name, load_kg: parseLoad(entries[e.name].load) }))
    )
    if (logError) return fail()

    try {
      localStorage.removeItem(draftKey)
    } catch {}
    router.replace("/aluno?aba=frequencia&treino=salvo")
    router.refresh()

    function fail() {
      setPending(false)
      setError("Não foi possível salvar agora. Confira sua internet e tente de novo — suas anotações continuam aqui.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-sm border border-line">
        <div className={`${DAY_COLORS[dayIndex]} px-5 py-4`}>
          <p className="font-display text-3xl uppercase leading-none tracking-wide text-white">Dia {dayIndex + 1}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90">{day.focus}</p>
        </div>
        <div className="flex items-center justify-between bg-carbon px-5 py-3 text-xs text-offwhite/60">
          <span>{formatDate(today, { weekday: "long", day: "2-digit", month: "long" })}</span>
          <span>
            {doneCount} de {day.exercises.length} feitos
          </span>
        </div>
      </div>

      {existing && (
        <FormMessage tone="success">Você já registrou este treino hoje. Pode corrigir as cargas e salvar de novo.</FormMessage>
      )}

      <div className="flex items-start gap-3 rounded-sm border border-line bg-carbon p-4 text-xs leading-relaxed text-offwhite/60">
        <Flame size={16} className="mt-0.5 shrink-0 text-orange" />
        <span>
          1ª série de cada exercício com pouca carga, só pra aquecer. Anote a carga das séries válidas. Descanso de 2
          minutos entre séries e exercícios.
        </span>
      </div>

      <div className="sticky top-20 z-10">
        <RestTimer />
      </div>

      <ul className="flex flex-col gap-3">
        {day.exercises.map((e) => {
          const entry = entries[e.name]
          const last = lastLoads[e.name]
          const risky = exerciseRisks(e.name, regions).length > 0
          return (
            <li
              key={e.name}
              className={`rounded-sm border p-4 transition-colors ${entry.done ? "border-orange/60 bg-orange/5" : "border-line bg-carbon"}`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => update(e.name, { done: !entry.done })}
                  aria-pressed={entry.done}
                  aria-label={entry.done ? `Desmarcar ${e.name}` : `Marcar ${e.name} como feito`}
                  data-cursor-hover
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                    entry.done ? "border-orange bg-orange text-ink" : "border-line text-transparent hover:border-orange"
                  }`}
                >
                  <Check size={16} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-offwhite">{e.name}</p>
                  <p className="text-xs text-offwhite/50">
                    {e.sets}x {e.reps}
                    {last && ` · Última: ${formatKg(last.load)} (${formatDate(last.date, { day: "2-digit", month: "2-digit" })})`}
                  </p>
                  {risky && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400">
                      <AlertTriangle size={12} />
                      Menos carga e mais calma
                    </p>
                  )}
                </div>
                <label className="flex shrink-0 items-center gap-1.5">
                  <input
                    value={entry.load}
                    onChange={(ev) => {
                      const value = ev.target.value.replace(/[^\d.,]/g, "").slice(0, 5)
                      update(e.name, { load: value, done: value !== "" ? true : entry.done })
                    }}
                    inputMode="decimal"
                    placeholder={last ? String(last.load).replace(".", ",") : "0"}
                    aria-label={`Carga em kg de ${e.name}`}
                    className="w-16 rounded-sm border border-line bg-ink px-2 py-2 text-center text-sm text-offwhite outline-none placeholder:text-offwhite/25 focus:border-orange"
                  />
                  <span className="text-xs text-offwhite/50">kg</span>
                </label>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-offwhite/40">Cardio no final: {WORKOUT_CARDIO.toLowerCase()}.</p>

      {error && <FormMessage tone="error">{error}</FormMessage>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/aluno"
          data-cursor-hover
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/60 hover:text-orange"
        >
          <ArrowLeft size={14} />
          Voltar sem salvar
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          data-cursor-hover
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {existing ? "Salvar correção" : "Finalizar treino"}
        </button>
      </div>
    </div>
  )
}
