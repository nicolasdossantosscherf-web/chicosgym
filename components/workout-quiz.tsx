"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { AlertTriangle, ArrowLeft, Bike, Check, Flame, MessageCircle, RotateCcw, Send, Timer } from "lucide-react"
import { brand } from "@/lib/data"
import { lenisStore } from "@/lib/lenis-store"
import {
  WORKOUT_CARDIO,
  WORKOUT_REST,
  WORKOUT_WARMUP,
  detectInjuryRegions,
  exerciseRisks,
  findWorkoutPlan,
  workoutExperiences,
  workoutGoals,
  type InjuryRegion,
  type WorkoutFrequency,
  type WorkoutPlan,
  type WorkoutSex,
} from "@/lib/workouts"
import { SectionHeading } from "./section-heading"
import { PENDING_QUIZ_KEY, SaveWorkoutBox, type QuizAnswers } from "./save-workout-box"

type Answers = QuizAnswers

type Option<T> = { value: T; label: string }

const TOTAL_STEPS = 5
const INJURY_LIMIT = 200
const FREQUENCIES: WorkoutFrequency[] = [3, 4, 5]
const SEX_LABEL: Record<WorkoutSex, string> = { feminino: "Feminino", masculino: "Masculino" }

// Mesmas cores dos cartazes da academia: Dia 1 azul, 2 laranja, 3 verde, 4 rosa, 5 vermelho.
const DAY_COLORS = ["bg-[#3b78c4]", "bg-[#e8691f]", "bg-[#2e9a52]", "bg-[#cf5f93]", "bg-[#d24b40]"]

function scrollToTop(el: HTMLElement | null) {
  if (!el) return
  if (lenisStore.instance) lenisStore.instance.scrollTo(el, { offset: -110 })
  else el.scrollIntoView({ behavior: "smooth", block: "start" })
}

function planTitle(plan: WorkoutPlan) {
  return `Treino ${SEX_LABEL[plan.sex]} ${plan.frequency}x`
}

function workoutText(plan: WorkoutPlan, regions: InjuryRegion[]) {
  const lines = [`*Meu treino Chico's Gym — ${planTitle(plan)}*`, ""]
  plan.days.forEach((day, i) => {
    lines.push(`*Dia ${i + 1} — ${day.focus}*`)
    day.exercises.forEach((e) => {
      const risky = exerciseRisks(e.name, regions).length > 0
      lines.push(`• ${e.name} — ${e.sets}x ${e.reps}${risky ? " ⚠️ cuidado com a lesão" : ""}`)
    })
    lines.push("")
  })
  lines.push(`*Aquecimento:* ${WORKOUT_WARMUP}`)
  lines.push(`*Descanso:* ${WORKOUT_REST}`)
  lines.push(`*Cardio:* ${WORKOUT_CARDIO}`)
  return lines.join("\n")
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-cursor-hover
      className={`flex w-full items-center justify-between gap-3 rounded-sm border px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${
        selected ? "border-orange bg-orange/10 text-orange" : "border-line text-offwhite/80 hover:border-orange/60"
      }`}
    >
      {label}
      {selected && <Check size={16} className="shrink-0" />}
    </button>
  )
}

export function WorkoutQuiz() {
  const sectionRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [hasInjury, setHasInjury] = useState<boolean | null>(null)
  const [injuryText, setInjuryText] = useState("")
  const [viewFrequency, setViewFrequency] = useState<WorkoutFrequency>(3)

  // Voltando do login (/treino?salvar=1): reabre o resultado que a pessoa queria salvar.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("salvar")) return
    try {
      const raw = sessionStorage.getItem(PENDING_QUIZ_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as Answers
      if (!saved.sex || !saved.frequency) return
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(saved)
      setViewFrequency(saved.frequency)
      setStep(TOTAL_STEPS)
    } catch {}
  }, [])

  const done = step >= TOTAL_STEPS

  const next = (patch: Answers) => {
    setAnswers((a) => ({ ...a, ...patch }))
    setStep((s) => s + 1)
  }

  const finish = (injury: string | null) => {
    setAnswers((a) => ({ ...a, injury }))
    setViewFrequency(answers.frequency ?? 3)
    setStep(TOTAL_STEPS)
    scrollToTop(sectionRef.current)
  }

  const restart = () => {
    setAnswers({})
    setHasInjury(null)
    setInjuryText("")
    setStep(0)
    scrollToTop(sectionRef.current)
  }

  const questions: { title: string; render: () => ReactNode }[] = [
    {
      title: "Qual é o seu sexo?",
      render: () =>
        ([
          { value: "feminino", label: "Feminino" },
          { value: "masculino", label: "Masculino" },
        ] as Option<WorkoutSex>[]).map((o) => (
          <OptionButton key={o.value} label={o.label} selected={answers.sex === o.value} onClick={() => next({ sex: o.value })} />
        )),
    },
    {
      title: "Qual é o principal objetivo do seu treino?",
      render: () =>
        workoutGoals.map((g) => (
          <OptionButton key={g.id} label={g.label} selected={answers.goal === g.id} onClick={() => next({ goal: g.id })} />
        )),
    },
    {
      title: "Qual é a sua experiência de treino?",
      render: () =>
        workoutExperiences.map((x) => (
          <OptionButton
            key={x.id}
            label={x.label}
            selected={answers.experience === x.id}
            onClick={() => next({ experience: x.id })}
          />
        )),
    },
    {
      title: "Quantos dias por semana você vai treinar?",
      render: () =>
        FREQUENCIES.map((f) => (
          <OptionButton
            key={f}
            label={`${f} dias por semana`}
            selected={answers.frequency === f}
            onClick={() => next({ frequency: f })}
          />
        )),
    },
    {
      title: "Já teve alguma lesão ou tem alguma restrição no corpo?",
      render: () => (
        <>
          <OptionButton label="Não" selected={hasInjury === false} onClick={() => finish(null)} />
          <OptionButton label="Sim" selected={hasInjury === true} onClick={() => setHasInjury(true)} />
          {hasInjury && (
            <div className="animate-step-in flex flex-col gap-3 pt-2">
              <label htmlFor="injury" className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                O que você lesionou?
              </label>
              <textarea
                id="injury"
                value={injuryText}
                onChange={(e) => setInjuryText(e.target.value.slice(0, INJURY_LIMIT))}
                rows={3}
                autoFocus
                placeholder="Ex.: joelho direito, hérnia na lombar, tendinite no ombro…"
                className="resize-none rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors placeholder:text-offwhite/30 focus:border-orange"
              />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-offwhite/40">
                  {injuryText.length}/{INJURY_LIMIT}
                </span>
                <button
                  type="button"
                  onClick={() => finish(injuryText.trim())}
                  disabled={injuryText.trim().length < 3}
                  data-cursor-hover
                  className="rounded-sm bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ver meu treino
                </button>
              </div>
            </div>
          )}
        </>
      ),
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Descubra seu Treino"
          title={done ? "Seu treino está pronto" : "Responda 5 perguntas e receba seu treino"}
          description="Fichas oficiais da Chico's Gym, montadas pelos profissionais da academia. A gente cruza suas respostas e entrega a ficha ideal pra você."
        />

        {!done ? (
          <div className="mx-auto mt-12 max-w-2xl rounded-sm border border-line bg-carbon p-6 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                Pergunta {step + 1} de {TOTAL_STEPS}
              </span>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  data-cursor-hover
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/60 transition-colors hover:text-orange"
                >
                  <ArrowLeft size={14} />
                  Voltar
                </button>
              )}
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-orange transition-all duration-500"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            <div key={step} className="animate-step-in mt-8">
              <h3 className="font-display text-3xl uppercase leading-tight tracking-wide text-offwhite md:text-4xl">
                {questions[step].title}
              </h3>
              <div className="mt-6 flex flex-col gap-3">{questions[step].render()}</div>
            </div>
          </div>
        ) : (
          <WorkoutResult answers={answers} viewFrequency={viewFrequency} onViewFrequency={setViewFrequency} onRestart={restart} />
        )}
      </div>
    </section>
  )
}

function WorkoutResult({
  answers,
  viewFrequency,
  onViewFrequency,
  onRestart,
}: {
  answers: Answers
  viewFrequency: WorkoutFrequency
  onViewFrequency: (f: WorkoutFrequency) => void
  onRestart: () => void
}) {
  const sex = answers.sex ?? "feminino"
  const plan = findWorkoutPlan(sex, viewFrequency)
  if (!plan) return null

  const goal = workoutGoals.find((g) => g.id === answers.goal)
  const experience = workoutExperiences.find((x) => x.id === answers.experience)
  const injury = answers.injury ?? null
  const regions = injury ? detectInjuryRegions(injury) : []
  const riskyCount = plan.days.reduce(
    (n, day) => n + day.exercises.filter((e) => exerciseRisks(e.name, regions).length > 0).length,
    0
  )
  const regionNames = regions.map((r) => r.label)
  const regionText =
    regionNames.length > 1 ? `${regionNames.slice(0, -1).join(", ")} e ${regionNames.at(-1)}` : regionNames[0]

  const chips = [
    SEX_LABEL[sex],
    goal?.label,
    experience?.label,
    `${answers.frequency} dias por semana`,
    injury ? "Com lesão/restrição" : "Sem lesão",
  ].filter(Boolean) as string[]

  const gymMessage = [
    `Oi! Fiz o "Descubra seu Treino" no site da Chico's Gym.`,
    `*Ficha indicada:* ${planTitle(plan)}`,
    goal && `*Objetivo:* ${goal.label}`,
    experience && `*Experiência:* ${experience.label}`,
    `*Lesão/restrição:* ${injury ?? "nenhuma"}`,
    "",
    "Tenho algumas dúvidas, pode me ajudar?",
  ]
    .filter((line) => line !== undefined)
    .join("\n")

  return (
    <div className="animate-step-in mt-12 flex flex-col gap-8">
      {/* Perfil */}
      <div className="rounded-sm border border-orange/40 bg-carbon p-6 md:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange">Ficha indicada pra você</span>
        <h3 className="mt-2 font-display text-4xl uppercase tracking-wide text-offwhite md:text-5xl">
          {planTitle(plan)}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-line px-3 py-1 text-xs text-offwhite/70">
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Análise */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnalysisCard title="Como seu treino funciona">
          {plan.frequency} dias por semana, cada um focado em uma parte do corpo:{" "}
          {plan.days.map((d, i) => `Dia ${i + 1} ${d.focus}`).join(" · ")}. Todos os exercícios são{" "}
          {plan.days[0].exercises[0].sets} séries de {plan.days[0].exercises[0].reps} repetições (a 1ª com pouca
          carga, só de aquecimento), com 2 minutos de descanso entre as séries. O cardio fecha o treino.
        </AnalysisCard>
        {goal && <AnalysisCard title={`Objetivo: ${goal.label}`}>{goal.tip}</AnalysisCard>}
        {experience && (
          <AnalysisCard title={`Experiência: ${experience.label}`}>
            {experience.tip}
            {experience.id === "nunca" && (answers.frequency ?? 3) >= 4 && (
              <span className="mt-2 block text-offwhite/80">
                Começando agora com {answers.frequency} dias? Ótimo pique! Converse com o instrutor sobre o ritmo ideal
                pra você — dá pra comparar com as versões de menos dias logo abaixo.
              </span>
            )}
          </AnalysisCard>
        )}
        {injury && (
          <AnalysisCard title="Atenção à sua lesão" tone="warning">
            {regions.length > 0 ? (
              <>
                Já que você se lesionou {regionText}, nos {riskyCount} exercícios marcados com{" "}
                <AlertTriangle size={13} className="inline text-amber-400" /> faça com mais calma, menos intensidade e
                pouca carga, para não forçar ainda mais a região e acabar se machucando. Se sentir dor, pare e fale com
                o instrutor.
              </>
            ) : (
              <>
                Você contou: &ldquo;{injury}&rdquo;. Nos exercícios que envolvem essa região, faça com mais calma, menos
                intensidade e pouca carga, para não forçar ainda mais e acabar se machucando. Se sentir dor, pare e fale
                com o instrutor.
              </>
            )}
            <span className="mt-2 block text-offwhite/80">
              Antes de começar, mostre sua lesão pra equipe — a 1ª avaliação física é grátis.
            </span>
          </AnalysisCard>
        )}
      </div>

      {/* Ficha */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">Sua ficha</h3>
          <div className="flex items-center gap-1 rounded-full border border-line p-1" role="group" aria-label="Dias por semana">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onViewFrequency(f)}
                aria-pressed={viewFrequency === f}
                data-cursor-hover
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                  viewFrequency === f ? "bg-orange text-ink" : "text-offwhite/60 hover:text-orange"
                }`}
              >
                {f}x
              </button>
            ))}
          </div>
        </div>

        {/* Regras que valem pra todos os exercícios da ficha. */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
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

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.days.map((day, i) => (
            <div key={`${plan.frequency}-${i}`} className="overflow-hidden rounded-sm border border-line bg-carbon">
              <div className={`${DAY_COLORS[i]} px-5 py-3`}>
                <p className="font-display text-2xl uppercase leading-none tracking-wide text-white">Dia {i + 1}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90">{day.focus}</p>
              </div>
              <ul className="divide-y divide-line">
                {day.exercises.map((e) => {
                  const risks = exerciseRisks(e.name, regions)
                  return (
                    <li key={e.name} className="flex items-start justify-between gap-3 px-5 py-3">
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-offwhite">{e.name}</span>
                        {risks.length > 0 && (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-400">
                            <AlertTriangle size={12} />
                            Menos carga e mais calma
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-orange">
                        {e.sets}x {e.reps}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <SaveWorkoutBox answers={answers} frequency={viewFrequency} />

      {/* Ações */}
      <div className="flex flex-col items-center gap-4 rounded-sm border border-line bg-carbon p-6 text-center md:p-8">
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Dúvidas? Nos chame!</p>
        <p className="max-w-lg text-sm text-offwhite/60">
          A equipe ajusta a carga e a execução com você na academia. Suas respostas vão junto na mensagem.
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(gymMessage)}`}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
          >
            <MessageCircle size={14} />
            Falar com a academia
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(workoutText(plan, regions))}`}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-line px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
          >
            <Send size={14} />
            Salvar no meu WhatsApp
          </a>
          <button
            type="button"
            onClick={onRestart}
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/60 transition-colors hover:text-orange"
          >
            <RotateCcw size={14} />
            Refazer
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalysisCard({
  title,
  tone = "default",
  children,
}: {
  title: string
  tone?: "default" | "warning"
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-sm border p-6 ${
        tone === "warning" ? "border-amber-400/40 bg-amber-400/5" : "border-line bg-carbon"
      }`}
    >
      <p
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
          tone === "warning" ? "text-amber-400" : "text-orange"
        }`}
      >
        {tone === "warning" && <AlertTriangle size={14} />}
        {title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-offwhite/70">{children}</p>
    </div>
  )
}
