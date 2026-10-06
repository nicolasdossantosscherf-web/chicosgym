"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, RotateCw, Search, Trash2, X } from "lucide-react"
import {
  PLAN_OPTIONS,
  addMonths,
  daysLabel,
  formatDate,
  membershipStatus,
  planLabel,
  planMonths,
} from "@/lib/aluno"
import { createClient } from "@/lib/supabase/client"
import type { Membership } from "./types"

export type StaffStudent = {
  id: string
  full_name: string
  email: string | null
  membership: Membership | null
  lastTrainedOn: string | null
  trainedLast30: number
}

type Filter = "todos" | "vencendo" | "vencidos" | "sem-plano"

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "vencendo", label: "Vencendo" },
  { id: "vencidos", label: "Vencidos" },
  { id: "sem-plano", label: "Sem plano" },
]

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

function MembershipBadge({ membership, today }: { membership: Membership | null; today: string }) {
  if (!membership) {
    return <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-offwhite/50">Sem plano</span>
  }
  const { state, daysLeft } = membershipStatus(membership.expires_on, today)
  const tone =
    state === "expired"
      ? "border-red-500/50 text-red-400"
      : state === "expiring"
        ? "border-amber-400/50 text-amber-400"
        : "border-emerald-500/40 text-emerald-400"
  const detail =
    state === "expired" ? `venceu há ${daysLabel(Math.abs(daysLeft))}` : daysLeft === 0 ? "vence hoje" : `vence em ${daysLabel(daysLeft)}`
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${tone}`}>
      {planLabel(membership.plan)} · {detail}
    </span>
  )
}

function PlanEditor({
  student,
  staffId,
  today,
  onClose,
}: {
  student: StaffStudent
  staffId: string
  today: string
  onClose: () => void
}) {
  const router = useRouter()
  const current = student.membership
  const [plan, setPlan] = useState(current?.plan ?? "mensal")
  const [startsOn, setStartsOn] = useState(current?.starts_on ?? today)
  const [expiresOn, setExpiresOn] = useState(current?.expires_on ?? addMonths(today, planMonths("mensal")))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changePlan = (next: string) => {
    setPlan(next)
    setExpiresOn(addMonths(startsOn, planMonths(next)))
  }
  const changeStart = (next: string) => {
    setStartsOn(next)
    if (next) setExpiresOn(addMonths(next, planMonths(plan)))
  }
  // Renovar: o novo período começa no vencimento atual (ou hoje, se já venceu).
  const renew = () => {
    const start = current && current.expires_on > today ? current.expires_on : today
    setStartsOn(start)
    setExpiresOn(addMonths(start, planMonths(plan)))
  }

  const run = async (action: () => PromiseLike<{ error: unknown }>) => {
    setPending(true)
    setError(null)
    const { error } = await action()
    setPending(false)
    if (error) {
      setError("Não foi possível salvar. Confira os dados e tente de novo.")
      return
    }
    onClose()
    router.refresh()
  }

  const save = () => {
    if (!startsOn || !expiresOn || expiresOn < startsOn) {
      setError("O vencimento precisa ser depois do início.")
      return
    }
    const values = { plan, starts_on: startsOn, expires_on: expiresOn, updated_by: staffId }
    const supabase = createClient()
    return run(() =>
      current
        ? supabase.from("memberships").update(values).eq("user_id", student.id)
        : supabase.from("memberships").insert({ ...values, user_id: student.id })
    )
  }

  const remove = () => {
    if (!window.confirm(`Remover o plano de ${student.full_name}?`)) return
    return run(() => createClient().from("memberships").delete().eq("user_id", student.id))
  }

  const input =
    "rounded-sm border border-line bg-ink px-3 py-2.5 text-sm text-offwhite outline-none [color-scheme:dark] focus:border-orange"

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-sm border border-line bg-ink/60 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Plano</span>
          <select value={plan} onChange={(e) => changePlan(e.target.value)} className={input}>
            {PLAN_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.months} {p.months === 1 ? "mês" : "meses"})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Início</span>
          <input type="date" value={startsOn} onChange={(e) => changeStart(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Vencimento</span>
          <input type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} className={input} />
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-gold disabled:opacity-60"
        >
          {pending && <Loader2 size={13} className="animate-spin" />}
          Salvar plano
        </button>
        {current && (
          <button
            type="button"
            onClick={renew}
            className="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/80 hover:border-orange hover:text-orange"
          >
            <RotateCw size={13} />
            Preparar renovação
          </button>
        )}
        {current && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="inline-flex items-center gap-2 px-2 text-xs text-offwhite/40 hover:text-red-400"
          >
            <Trash2 size={13} />
            Remover plano
          </button>
        )}
        <button type="button" onClick={onClose} className="ml-auto inline-flex items-center gap-1 text-xs text-offwhite/50 hover:text-offwhite">
          <X size={13} />
          Fechar
        </button>
      </div>
    </div>
  )
}

export function StaffPanel({ students, staffId, today }: { students: StaffStudent[]; staffId: string; today: string }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("todos")
  const [editing, setEditing] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c = { todos: students.length, vencendo: 0, vencidos: 0, "sem-plano": 0 }
    for (const s of students) {
      if (!s.membership) c["sem-plano"]++
      else {
        const { state } = membershipStatus(s.membership.expires_on, today)
        if (state === "expired") c.vencidos++
        if (state === "expiring") c.vencendo++
      }
    }
    return c
  }, [students, today])

  const visible = students.filter((s) => {
    const q = normalize(query.trim())
    if (q && !normalize(`${s.full_name} ${s.email ?? ""}`).includes(q)) return false
    if (filter === "sem-plano") return !s.membership
    if (filter === "vencendo") return !!s.membership && membershipStatus(s.membership.expires_on, today).state === "expiring"
    if (filter === "vencidos") return !!s.membership && membershipStatus(s.membership.expires_on, today).state === "expired"
    return true
  })

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative flex-1 md:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou e-mail"
            aria-label="Buscar aluno"
            className="w-full rounded-sm border border-line bg-carbon py-3 pl-10 pr-3 text-sm text-offwhite outline-none placeholder:text-offwhite/30 focus:border-orange"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              data-cursor-hover
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                filter === f.id ? "border-orange bg-orange text-ink" : "border-line text-offwhite/70 hover:border-orange"
              }`}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-sm border border-line bg-carbon p-6 text-sm text-offwhite/60">Nenhum aluno encontrado.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-sm border border-line bg-carbon">
          {visible.map((s) => (
            <li key={s.id} className="px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-offwhite">{s.full_name}</p>
                  <p className="truncate text-xs text-offwhite/50">{s.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <MembershipBadge membership={s.membership} today={today} />
                  <span className="text-[11px] text-offwhite/50">
                    {s.lastTrainedOn
                      ? `Último treino ${formatDate(s.lastTrainedOn, { day: "2-digit", month: "2-digit" })} · ${s.trainedLast30} em 30 dias`
                      : "Sem treinos registrados"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing(editing === s.id ? null : s.id)}
                    data-cursor-hover
                    className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-offwhite/80 hover:border-orange hover:text-orange"
                  >
                    <Pencil size={12} />
                    {s.membership ? "Plano" : "Registrar plano"}
                  </button>
                </div>
              </div>
              {editing === s.id && (
                <PlanEditor student={s} staffId={staffId} today={today} onClose={() => setEditing(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
