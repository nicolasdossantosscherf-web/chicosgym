"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2, Save } from "lucide-react"
import { hasSessionCookie } from "@/lib/session-cookie"
import type { WorkoutExperience, WorkoutFrequency, WorkoutGoal, WorkoutSex } from "@/lib/workouts"

export const PENDING_QUIZ_KEY = "chicos-quiz-pendente"

export type QuizAnswers = {
  sex?: WorkoutSex
  goal?: WorkoutGoal
  experience?: WorkoutExperience
  frequency?: WorkoutFrequency
  injury?: string | null
}

// Salva a ficha do Descubra seu Treino na conta do aluno (Área do Aluno).
export function SaveWorkoutBox({ answers, frequency }: { answers: QuizAnswers; frequency: WorkoutFrequency }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(hasSessionCookie())
  }, [])

  const keepForLater = () => {
    try {
      sessionStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify({ ...answers, frequency }))
    } catch {}
  }

  const save = async () => {
    if (!answers.sex) return
    setStatus("saving")
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setLoggedIn(false)
      setStatus("idle")
      return
    }
    const values = {
      sex: answers.sex,
      frequency,
      goal: answers.goal ?? null,
      experience: answers.experience ?? null,
      // Lesão é dado de saúde: só vai pro banco com o consentimento marcado.
      injury_note: consent && answers.injury ? answers.injury.slice(0, 200) : null,
    }
    const { data: updated, error } = await supabase
      .from("student_workouts")
      .update(values)
      .eq("user_id", auth.user.id)
      .select("user_id")
    let failed = !!error
    if (!error && (updated?.length ?? 0) === 0) {
      const { error: insertError } = await supabase.from("student_workouts").insert(values)
      failed = !!insertError
    }
    if (failed) {
      setStatus("error")
      return
    }
    try {
      sessionStorage.removeItem(PENDING_QUIZ_KEY)
    } catch {}
    setStatus("saved")
  }

  if (loggedIn === null) return null

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-orange/40 bg-carbon p-6 md:p-8">
      <div>
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Salve na sua Área do Aluno</p>
        <p className="mt-1 text-sm text-offwhite/60">
          Com a ficha salva, você treina pelo celular, anota as cargas de cada exercício e acompanha sua evolução e
          frequência.
        </p>
      </div>

      {status === "saved" ? (
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Check size={16} />
            Ficha salva na sua conta!
          </span>
          <Link
            href="/aluno?aba=treino&treino=ficha"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink hover:bg-gold"
          >
            Ir pra minha área
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : loggedIn ? (
        <>
          {answers.injury && (
            <label className="flex items-start gap-3 text-sm text-offwhite/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-orange"
              />
              <span>
                Guardar também a lesão que informei, pra destacar os exercícios no modo treino. É um dado de saúde: fica
                só na sua conta e dá pra remover quando quiser.
              </span>
            </label>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">Não foi possível salvar agora. Tente de novo em instantes.</p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            data-cursor-hover
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold disabled:opacity-60 sm:w-fit"
          >
            {status === "saving" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar na minha conta
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cadastro"
            onClick={keepForLater}
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink hover:bg-gold"
          >
            Criar minha conta
          </Link>
          <Link
            href={`/entrar?next=${encodeURIComponent("/treino?salvar=1")}`}
            onClick={keepForLater}
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-line px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 hover:border-orange hover:text-orange"
          >
            Já tenho conta
          </Link>
        </div>
      )}
    </div>
  )
}
