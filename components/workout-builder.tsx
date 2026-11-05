"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  Bike,
  Check,
  ChevronDown,
  CircleCheck,
  Flame,
  Heart,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Timer,
  Trash2,
  X,
} from "lucide-react"
import { brand } from "@/lib/data"
import { lenisStore } from "@/lib/lenis-store"
import { clearSavedWorkout, saveWorkout, useSavedWorkout } from "@/lib/saved-workout"
import {
  LIMITS,
  TRAINING_DAYS,
  buildWorkout,
  equipmentPreferences,
  exerciseCatalog,
  exerciseSections,
  focusAreas,
  getExercise,
  parseDecimal,
  parseHeight,
  prescription,
  swapExercise,
  swapOptions,
  trainingTimes,
  type EquipmentPreference,
  type ExerciseId,
  type FocusArea,
  type GeneratedWorkout,
  type Goal,
  type Sex,
  type TrainingDays,
  type TrainingTime,
  type WorkoutProfile,
} from "@/lib/workout-engine"
import { WORKOUT_REST, WORKOUT_WARMUP, exerciseRisks, workoutExperiences, workoutGoals } from "@/lib/workouts"
import { SectionHeading } from "./section-heading"

type Draft = {
  name: string
  age: string
  weight: string
  height: string
  sex?: Sex
  goal?: Goal
  trained?: boolean
  time?: TrainingTime
  active?: boolean
  days?: TrainingDays
  hasInjury?: boolean
  injury: string
  equipment: EquipmentPreference
  focus: FocusArea[]
  avoid: ExerciseId[]
  favorites: ExerciseId[]
  notes: string
}

const EMPTY_DRAFT: Draft = {
  name: "",
  age: "",
  weight: "",
  height: "",
  injury: "",
  equipment: "tanto-faz",
  focus: [],
  avoid: [],
  favorites: [],
  notes: "",
}

const TOTAL_STEPS = 8
const BUILD_DELAY = 1200
const SEX_LABEL: Record<Sex, string> = { feminino: "Feminino", masculino: "Masculino" }

// Mesmas cores dos cartazes da academia: Dia 1 azul, 2 laranja, 3 verde, 4 rosa, 5 vermelho.
const DAY_COLORS = ["bg-[#3b78c4]", "bg-[#e8691f]", "bg-[#2e9a52]", "bg-[#cf5f93]", "bg-[#d24b40]", "bg-[#7a5bc4]"]

const inputClass =
  "w-full rounded-sm border border-line bg-ink px-4 py-3 text-base text-offwhite outline-none transition-colors placeholder:text-offwhite/30 focus:border-orange"
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-line px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"

function scrollToTop(el: HTMLElement | null) {
  if (!el) return
  if (lenisStore.instance) lenisStore.instance.scrollTo(el, { offset: -110 })
  else el.scrollIntoView({ behavior: "smooth", block: "start" })
}

function cleanName(name: string) {
  // Só o nome digitado, sem espaços sobrando nem caracteres de controle.
  return name.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim()
}

function firstName(name: string) {
  return name.split(" ")[0] ?? name
}

function formatHeight(cm: number) {
  return `${(cm / 100).toFixed(2).replace(".", ",")} m`
}

function formatNumber(value: number) {
  return String(value).replace(".", ",")
}

function profileToDraft(profile: WorkoutProfile): Draft {
  return {
    name: profile.name,
    age: String(profile.age),
    weight: formatNumber(profile.weight),
    height: String(profile.height),
    sex: profile.sex,
    goal: profile.goal,
    trained: profile.experience.trained,
    time: profile.experience.trained ? profile.experience.time : undefined,
    active: profile.experience.trained ? profile.experience.active : undefined,
    days: profile.days,
    hasInjury: profile.injury !== null,
    injury: profile.injury ?? "",
    equipment: profile.equipment,
    focus: profile.focus,
    avoid: profile.avoid,
    favorites: profile.favorites,
    notes: profile.notes,
  }
}

function validateBody(draft: Draft) {
  const age = parseDecimal(draft.age)
  const weight = parseDecimal(draft.weight)
  const height = parseHeight(draft.height)
  if (age === null || !Number.isInteger(age) || age < LIMITS.age.min || age > LIMITS.age.max)
    return `Informe a idade em anos (de ${LIMITS.age.min} a ${LIMITS.age.max}).`
  if (weight === null || weight < LIMITS.weight.min || weight > LIMITS.weight.max)
    return "Informe o peso em quilos, por exemplo 70 ou 70,5."
  if (height === null || height < LIMITS.height.min || height > LIMITS.height.max)
    return "Informe a altura, por exemplo 1,75 ou 175."
  return null
}

function draftToProfile(draft: Draft): WorkoutProfile | null {
  const age = parseDecimal(draft.age)
  const weight = parseDecimal(draft.weight)
  const height = parseHeight(draft.height)
  const name = cleanName(draft.name)
  if (validateBody(draft) || age === null || weight === null || height === null) return null
  if (name.length < LIMITS.name.min || !draft.sex || !draft.goal || !draft.days || draft.trained === undefined) return null
  if (draft.trained && (!draft.time || draft.active === undefined)) return null
  const injury = draft.hasInjury ? draft.injury.trim() : ""
  return {
    name: name.slice(0, LIMITS.name.max),
    age,
    weight: Math.round(weight * 10) / 10,
    height,
    sex: draft.sex,
    goal: draft.goal,
    experience: draft.trained ? { trained: true, time: draft.time!, active: draft.active! } : { trained: false },
    days: draft.days,
    injury: injury.length >= 3 ? injury : null,
    equipment: draft.equipment,
    focus: draft.focus,
    avoid: draft.avoid,
    favorites: draft.favorites.filter((id) => !draft.avoid.includes(id)),
    notes: draft.notes.trim(),
  }
}

function workoutText(workout: GeneratedWorkout) {
  const rules = prescription(workout.profile)
  const lines = [
    `*Meu treino Chico's Gym — ${workout.profile.name}*`,
    `${workout.profile.days} dias por semana · ${rules.sets} séries de ${rules.reps} repetições`,
    "",
  ]
  workout.days.forEach((day, i) => {
    lines.push(`*Dia ${i + 1} — ${day.title}*`)
    day.exercises.forEach((e) => {
      const risky = exerciseRisks(e.name, rules.injuryRegions).length > 0
      lines.push(`• ${e.name}${risky ? " ⚠️ cuidado com a lesão" : ""}`)
    })
    lines.push("")
  })
  lines.push(`*Aquecimento:* ${WORKOUT_WARMUP}`)
  lines.push(`*Descanso:* ${WORKOUT_REST}`)
  lines.push(`*Cardio no final:* ${rules.cardio}`)
  return lines.join("\n")
}

function gymMessage(workout: GeneratedWorkout) {
  const { profile } = workout
  const rules = prescription(profile)
  const goal = workoutGoals.find((g) => g.id === profile.goal)
  const lines = [
    `Oi! Sou ${profile.name} e montei meu treino no "Monte seu Treino" do site da Chico's Gym.`,
    `*Treino:* ${profile.days} dias por semana (${workout.days.map((d) => d.title).join(", ")})`,
  ]
  if (goal) lines.push(`*Objetivo:* ${goal.label}`)
  lines.push(`*Nível:* ${rules.levelLabel}`, `*Lesão/restrição:* ${profile.injury ?? "nenhuma"}`)
  if (profile.notes) lines.push(`*Observações:* ${profile.notes}`)
  lines.push("", "Tenho algumas dúvidas, pode me ajudar?")
  return lines.join("\n")
}

export function WorkoutBuilder() {
  const sectionRef = useRef<HTMLElement>(null)
  const buildTimer = useRef<number | null>(null)
  const saved = useSavedWorkout()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [error, setError] = useState<string | null>(null)
  const [building, setBuilding] = useState(false)
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)
  // Depois de tocar em "Montar outro treino", o treino salvo deixa de aparecer
  // até a pessoa salvar o novo (ou recarregar a página).
  const [startedNew, setStartedNew] = useState(false)

  useEffect(
    () => () => {
      if (buildTimer.current !== null) window.clearTimeout(buildTimer.current)
    },
    []
  )

  const shown = workout ?? (startedNew ? null : (saved ?? null))
  const isSaved = !!shown && saved?.id === shown.id

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setError(null)
  }
  const goNext = () => {
    setError(null)
    setStep((s) => s + 1)
  }

  const build = () => {
    const profile = draftToProfile(draft)
    if (!profile) {
      setError("Alguma resposta ficou faltando. Volte e confira, por favor.")
      return
    }
    setBuilding(true)
    scrollToTop(sectionRef.current)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    buildTimer.current = window.setTimeout(
      () => {
        setWorkout(buildWorkout(profile))
        setBuilding(false)
        buildTimer.current = null
      },
      reduceMotion ? 200 : BUILD_DELAY
    )
  }

  const startNew = () => {
    setDraft(shown ? profileToDraft(shown.profile) : EMPTY_DRAFT)
    setWorkout(null)
    setStartedNew(true)
    setStep(0)
    setError(null)
    scrollToTop(sectionRef.current)
  }

  const swap = (dayIndex: number, exerciseIndex: number) => {
    if (!shown) return
    const next = swapExercise(shown, dayIndex, exerciseIndex)
    setWorkout(next)
    if (isSaved) saveWorkout(next)
  }

  const remove = () => {
    clearSavedWorkout()
    if (!workout) startNew()
  }

  const onEnter = (action: () => void) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      action()
    }
  }

  const nameStep = () => {
    const ok = cleanName(draft.name).length >= LIMITS.name.min
    const submit = () => (ok ? goNext() : setError("Digite seu nome pra gente personalizar o treino."))
    return (
      <>
        <label htmlFor="treino-nome" className="sr-only">
          Seu nome
        </label>
        <input
          id="treino-nome"
          value={draft.name}
          onChange={(e) => update({ name: e.target.value.slice(0, LIMITS.name.max) })}
          onKeyDown={onEnter(submit)}
          autoComplete="given-name"
          autoFocus
          placeholder="Seu nome"
          className={inputClass}
        />
        <StepFooter>
          <button type="button" onClick={submit} disabled={!ok} data-cursor-hover className={primaryButton}>
            Continuar
          </button>
        </StepFooter>
      </>
    )
  }

  const bodyStep = () => {
    const submit = () => {
      const problem = validateBody(draft)
      if (problem) setError(problem)
      else goNext()
    }
    const fields: { key: "age" | "weight" | "height"; label: string; suffix: string; placeholder: string }[] = [
      { key: "age", label: "Idade", suffix: "anos", placeholder: "25" },
      { key: "weight", label: "Peso", suffix: "kg", placeholder: "70" },
      { key: "height", label: "Altura", suffix: "m", placeholder: "1,70" },
    ]
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {fields.map((field, i) => (
            <div key={field.key} className="flex flex-col gap-2">
              <label
                htmlFor={`treino-${field.key}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={`treino-${field.key}`}
                  value={draft[field.key]}
                  onChange={(e) => update({ [field.key]: e.target.value.slice(0, 6) })}
                  onKeyDown={onEnter(submit)}
                  inputMode="decimal"
                  autoFocus={i === 0}
                  placeholder={field.placeholder}
                  className={`${inputClass} pr-14`}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-offwhite/40">
                  {field.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
        <StepFooter>
          <button
            type="button"
            onClick={submit}
            disabled={!draft.age || !draft.weight || !draft.height}
            data-cursor-hover
            className={primaryButton}
          >
            Continuar
          </button>
        </StepFooter>
      </>
    )
  }

  const experienceStep = () => (
    <>
      <OptionButton
        label="Não, nunca treinei"
        selected={draft.trained === false}
        onClick={() => {
          update({ trained: false, time: undefined, active: undefined })
          goNext()
        }}
      />
      <OptionButton label="Sim, já treinei" selected={draft.trained === true} onClick={() => update({ trained: true })} />
      {draft.trained && (
        <div className="animate-step-in flex flex-col gap-5 pt-3">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
              Há quanto tempo você treina (ou treinou)?
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {trainingTimes.map((t) => (
                <Pill key={t.id} label={t.label} selected={draft.time === t.id} onClick={() => update({ time: t.id })} />
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
              E hoje, você está treinando?
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <Pill label="Sim, treino" selected={draft.active === true} onClick={() => update({ active: true })} />
              <Pill label="Estou parado(a)" selected={draft.active === false} onClick={() => update({ active: false })} />
            </div>
          </fieldset>
          <StepFooter>
            <button
              type="button"
              onClick={goNext}
              disabled={!draft.time || draft.active === undefined}
              data-cursor-hover
              className={primaryButton}
            >
              Continuar
            </button>
          </StepFooter>
        </div>
      )}
    </>
  )

  const injuryStep = () => (
    <>
      <OptionButton
        label="Não"
        selected={draft.hasInjury === false}
        onClick={() => {
          update({ hasInjury: false })
          goNext()
        }}
      />
      <OptionButton label="Sim" selected={draft.hasInjury === true} onClick={() => update({ hasInjury: true })} />
      {draft.hasInjury && (
        <div className="animate-step-in flex flex-col gap-3 pt-2">
          <label htmlFor="treino-lesao" className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
            O que aconteceu e onde?
          </label>
          <textarea
            id="treino-lesao"
            value={draft.injury}
            onChange={(e) => update({ injury: e.target.value.slice(0, LIMITS.injury) })}
            rows={3}
            autoFocus
            placeholder="Ex.: quebrei o punho em 2022, hérnia na lombar, distensão na posterior da coxa…"
            className={`${inputClass} resize-none text-sm`}
          />
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-offwhite/40">
              {draft.injury.length}/{LIMITS.injury}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={draft.injury.trim().length < 3}
              data-cursor-hover
              className={primaryButton}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  )

  const toggleIn = <T,>(list: T[], value: T, max: number) =>
    list.includes(value) ? list.filter((v) => v !== value) : list.length >= max ? list : [...list, value]

  const preferencesStep = () => (
    <>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
          Você prefere treinar com
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {equipmentPreferences.map((p) => (
            <Pill key={p.id} label={p.label} selected={draft.equipment === p.id} onClick={() => update({ equipment: p.id })} />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
          Quer mais foco em alguma parte? (até {LIMITS.focus})
        </legend>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((area) => {
            const selected = draft.focus.includes(area.id)
            return (
              <button
                key={area.id}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ focus: toggleIn(draft.focus, area.id, LIMITS.focus) })}
                disabled={!selected && draft.focus.length >= LIMITS.focus}
                data-cursor-hover
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-35 ${
                  selected ? "border-orange bg-orange/10 text-orange" : "border-line text-offwhite/70 hover:border-orange/60"
                }`}
              >
                {area.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
          Exercícios e máquinas (opcional)
        </p>
        <p className="text-xs leading-relaxed text-offwhite/50">
          Toque em <Heart size={12} className="inline text-orange" /> no que você gosta e quer no treino, ou em{" "}
          <X size={12} className="inline text-red-400" /> no que quer tirar.
        </p>
        <div className="flex flex-col divide-y divide-line rounded-sm border border-line">
          {exerciseSections.map((section) => {
            const items = exerciseCatalog.filter((e) => section.groups.includes(e.group))
            const marked = items.filter((e) => draft.avoid.includes(e.id) || draft.favorites.includes(e.id)).length
            return (
              <details key={section.label} className="group">
                <summary
                  data-cursor-hover
                  className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-offwhite/80 [&::-webkit-details-marker]:hidden"
                >
                  <span>
                    {section.label}
                    {marked > 0 && <span className="ml-2 text-xs normal-case tracking-normal text-orange">{marked} marcado(s)</span>}
                  </span>
                  <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="flex flex-col pb-2">
                  {items.map((exercise) => {
                    const liked = draft.favorites.includes(exercise.id)
                    const avoided = draft.avoid.includes(exercise.id)
                    return (
                      <li key={exercise.id} className="flex items-center justify-between gap-3 px-4 py-1.5">
                        <span
                          className={`text-sm ${avoided ? "text-offwhite/35 line-through" : liked ? "text-orange" : "text-offwhite/80"}`}
                        >
                          {exercise.name}
                        </span>
                        <span className="flex shrink-0 gap-1.5">
                          <IconToggle
                            label={`Gosto de ${exercise.name}`}
                            pressed={liked}
                            disabled={!liked && draft.favorites.length >= LIMITS.favorites}
                            tone="like"
                            onClick={() =>
                              update({
                                favorites: toggleIn(draft.favorites, exercise.id, LIMITS.favorites),
                                avoid: draft.avoid.filter((id) => id !== exercise.id),
                              })
                            }
                          >
                            <Heart size={15} />
                          </IconToggle>
                          <IconToggle
                            label={`Tirar ${exercise.name}`}
                            pressed={avoided}
                            disabled={!avoided && draft.avoid.length >= LIMITS.avoid}
                            tone="avoid"
                            onClick={() =>
                              update({
                                avoid: toggleIn(draft.avoid, exercise.id, LIMITS.avoid),
                                favorites: draft.favorites.filter((id) => id !== exercise.id),
                              })
                            }
                          >
                            <X size={15} />
                          </IconToggle>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </details>
            )
          })}
        </div>
        {(draft.favorites.length >= LIMITS.favorites || draft.avoid.length >= LIMITS.avoid) && (
          <p className="text-xs text-offwhite/50">
            Limite de {LIMITS.favorites} favoritos e {LIMITS.avoid} exercícios tirados, pra o treino continuar completo.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="treino-obs" className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
          Algo mais que a equipe deva saber? (opcional)
        </label>
        <textarea
          id="treino-obs"
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value.slice(0, LIMITS.notes) })}
          rows={2}
          placeholder="Ex.: só consigo treinar de manhã, tenho pressão alta…"
          className={`${inputClass} resize-none text-sm`}
        />
        <span className="text-xs text-offwhite/40">Vai junto na mensagem quando você chamar a academia no WhatsApp.</span>
      </div>

      <StepFooter>
        <button type="button" onClick={build} data-cursor-hover className={primaryButton}>
          <Sparkles size={14} />
          Montar meu treino
        </button>
      </StepFooter>
    </>
  )

  const questions: { title: string; hint?: string; render: () => ReactNode }[] = [
    { title: "Como você se chama?", render: nameStep },
    { title: "Sua idade, peso e altura", hint: "Usamos só pra ajustar o treino.", render: bodyStep },
    {
      title: "Qual é o seu sexo?",
      render: () =>
        (["feminino", "masculino"] as Sex[]).map((sex) => (
          <OptionButton
            key={sex}
            label={SEX_LABEL[sex]}
            selected={draft.sex === sex}
            onClick={() => {
              update({ sex })
              goNext()
            }}
          />
        )),
    },
    {
      title: "Qual é o principal objetivo do seu treino?",
      render: () =>
        workoutGoals.map((g) => (
          <OptionButton
            key={g.id}
            label={g.label}
            selected={draft.goal === g.id}
            onClick={() => {
              update({ goal: g.id })
              goNext()
            }}
          />
        )),
    },
    { title: "Você já treinou musculação?", render: experienceStep },
    {
      title: "Quantos dias por semana você quer treinar?",
      render: () =>
        TRAINING_DAYS.map((days) => (
          <OptionButton
            key={days}
            label={`${days} dias por semana`}
            selected={draft.days === days}
            onClick={() => {
              update({ days })
              goNext()
            }}
          />
        )),
    },
    {
      title: "Já teve alguma lesão, fratura ou dor que limite algum movimento?",
      hint: "Lesão muscular, osso quebrado, cirurgia, hérnia, tendinite…",
      render: injuryStep,
    },
    {
      title: "Suas preferências",
      hint: "Tudo aqui é opcional. Se não tiver preferência, é só montar o treino.",
      render: preferencesStep,
    },
  ]

  const done = !!shown && !building
  const loading = saved === undefined && !workout && !startedNew

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Monte seu Treino"
          title={done ? "Seu treino está pronto" : "Responda e receba um treino feito pra você"}
          description="Montado na hora a partir das suas respostas, só com os exercícios e as regras da Chico's Gym. Salve no celular e use sempre que quiser."
        />

        {loading ? (
          <div className="mx-auto mt-12 min-h-[420px] max-w-2xl rounded-sm border border-line bg-carbon" aria-hidden />
        ) : building ? (
          <BuildingCard name={firstName(cleanName(draft.name))} />
        ) : shown ? (
          <WorkoutResult
            workout={shown}
            isSaved={isSaved}
            fromStorage={!workout && isSaved}
            onSave={() => saveWorkout(shown)}
            onSwap={swap}
            onNew={startNew}
            onRemove={remove}
          />
        ) : (
          <div className="mx-auto mt-12 max-w-2xl rounded-sm border border-line bg-carbon p-6 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                Pergunta {step + 1} de {TOTAL_STEPS}
              </span>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setStep((s) => s - 1)
                  }}
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
              {questions[step].hint && <p className="mt-2 text-sm text-offwhite/50">{questions[step].hint}</p>}
              <div className="mt-6 flex flex-col gap-3">{questions[step].render()}</div>
              {error && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>

            {step === 0 && (
              <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-offwhite/40">
                Suas respostas não são enviadas pra lugar nenhum: o treino é montado aqui mesmo, no seu aparelho.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function BuildingCard({ name }: { name: string }) {
  return (
    <div
      role="status"
      className="animate-step-in mx-auto mt-12 flex min-h-[320px] max-w-2xl flex-col items-center justify-center gap-6 rounded-sm border border-orange/40 bg-carbon p-10 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-orange/20" />
        <Sparkles size={28} className="relative text-orange" />
      </div>
      <div>
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Montando seu treino{name ? `, ${name}` : ""}</p>
        <p className="mt-2 text-sm text-offwhite/60">Cruzando suas respostas com os exercícios e as regras da academia…</p>
      </div>
    </div>
  )
}

function WorkoutResult({
  workout,
  isSaved,
  fromStorage,
  onSave,
  onSwap,
  onNew,
  onRemove,
}: {
  workout: GeneratedWorkout
  isSaved: boolean
  fromStorage: boolean
  onSave: () => boolean
  onSwap: (dayIndex: number, exerciseIndex: number) => void
  onNew: () => void
  onRemove: () => void
}) {
  const [saveFailed, setSaveFailed] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const { profile } = workout
  const rules = prescription(profile)
  const goal = workoutGoals.find((g) => g.id === profile.goal)
  const experience = workoutExperiences.find(
    (x) => x.id === (!profile.experience.trained ? "nunca" : profile.experience.active ? "treino" : "parei")
  )
  const focusLabels = focusAreas.filter((a) => profile.focus.includes(a.id)).map((a) => a.label)
  const inPlan = new Set(workout.days.flatMap((d) => d.exercises.map((e) => e.id)))
  const missingFavorites = profile.favorites.filter((id) => !inPlan.has(id)).map((id) => getExercise(id).name)
  const regions = rules.injuryRegions
  const riskyCount = workout.days.reduce(
    (n, d) => n + d.exercises.filter((e) => exerciseRisks(e.name, regions).length > 0).length,
    0
  )
  const regionNames = regions.map((r) => r.label)
  const regionText =
    regionNames.length > 1 ? `${regionNames.slice(0, -1).join(", ")} e ${regionNames.at(-1)}` : regionNames[0]
  const savedDate = new Date(workout.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

  const chips = [
    `${profile.age} anos`,
    `${formatNumber(profile.weight)} kg`,
    formatHeight(profile.height),
    goal?.label,
    rules.levelLabel,
    `${profile.days} dias por semana`,
    ...focusLabels.map((label) => `Foco: ${label}`),
  ].filter(Boolean) as string[]

  const preferenceLines = [
    profile.equipment === "maquinas" && "Demos prioridade a máquinas e polias.",
    profile.equipment === "livres" && "Demos prioridade a pesos livres (halteres e barras).",
    focusLabels.length > 0 &&
      `Foco em ${focusLabels.join(" e ")}: um exercício a mais nos dias que treinam essa parte.`,
    profile.avoid.length > 0 && `Ficaram de fora: ${profile.avoid.map((id) => getExercise(id).name).join(", ")}.`,
    profile.favorites.length > missingFavorites.length &&
      `Seus favoritos estão no treino: ${profile.favorites
        .filter((id) => inPlan.has(id))
        .map((id) => getExercise(id).name)
        .join(", ")}.`,
    missingFavorites.length > 0 &&
      `Não couberam na divisão de ${profile.days} dias: ${missingFavorites.join(", ")} — dá pra trocar um exercício parecido tocando em ↻.`,
    rules.lowImpact &&
      !rules.injuryLowImpact &&
      "O cardio é na bike, que tem menos impacto nas articulações.",
  ].filter(Boolean) as string[]

  const save = () => setSaveFailed(!onSave())

  return (
    <div className="animate-step-in mt-12 flex flex-col gap-8">
      {fromStorage && (
        <p className="rounded-sm border border-line bg-carbon px-5 py-4 text-sm text-offwhite/70">
          Que bom te ver de novo, <span className="font-semibold text-offwhite">{firstName(profile.name)}</span>! Este é o
          treino salvo neste aparelho.
        </p>
      )}

      {/* Perfil + salvar */}
      <div className="rounded-sm border border-orange/40 bg-carbon p-6 md:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange">Treino personalizado de</span>
        <h3 className="mt-2 break-words font-display text-4xl uppercase tracking-wide text-offwhite md:text-5xl">
          {profile.name}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-line px-3 py-1 text-xs text-offwhite/70">
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          {isSaved ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-400">
              <CircleCheck size={18} />
              Salvo neste aparelho em {savedDate}
            </p>
          ) : (
            <button type="button" onClick={save} data-cursor-hover className={primaryButton}>
              <Save size={14} />
              Salvar neste celular
            </button>
          )}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(workoutText(workout))}`}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className={secondaryButton}
          >
            <Send size={14} />
            Enviar pro meu WhatsApp
          </a>
        </div>
        <p className={`mt-3 text-xs ${saveFailed ? "text-red-400" : "text-offwhite/40"}`}>
          {saveFailed
            ? "Este navegador não deixou salvar (modo anônimo?). Use o botão do WhatsApp pra guardar seu treino."
            : isSaved
              ? "Na próxima vez que abrir esta página neste aparelho, seu treino já aparece aqui."
              : "Fica guardado só neste aparelho. Em celular ou tablet de outra pessoa, prefira o WhatsApp."}
        </p>
      </div>

      {/* Por que ficou assim */}
      <div>
        <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">Por que seu treino ficou assim</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnalysisCard title={`${profile.days} dias por semana`}>
            {workout.days.map((d, i) => `Dia ${i + 1}: ${d.title}`).join(" · ")}. A divisão segue as fichas oficiais
            da Chico&apos;s Gym pro sexo {SEX_LABEL[profile.sex].toLowerCase()}.
          </AnalysisCard>

          <AnalysisCard title={`Nível: ${rules.levelLabel}`}>
            Até {rules.perDay} exercícios por dia, {rules.sets} séries de {rules.reps} repetições.
            {rules.cautiousTechnique && " Demos preferência a máquinas, que são mais fáceis de aprender."}{" "}
            {experience?.tip}
            {rules.senior && (
              <span className="mt-2 block text-offwhite/80">
                A partir dos 60 anos, o treino tem menos exercícios e 3 séries. Antes de começar, vale ter a liberação
                do seu médico.
              </span>
            )}
            {profile.age < 18 && (
              <span className="mt-2 block text-offwhite/80">
                Menores de 18 anos treinam com acompanhamento da equipe e autorização dos responsáveis.
              </span>
            )}
            {rules.level === "iniciante" && profile.days >= 5 && (
              <span className="mt-2 block text-offwhite/80">
                Começando com {profile.days} dias? Ótimo pique! Converse com o instrutor sobre o ritmo ideal pra você.
              </span>
            )}
          </AnalysisCard>

          {goal && (
            <AnalysisCard title={`Objetivo: ${goal.label}`}>
              Repetições: {rules.reps}. Cardio no final: {rules.cardioMachine.toLowerCase()} por{" "}
              {rules.cardioMinutes}. {goal.tip}
            </AnalysisCard>
          )}

          {preferenceLines.length > 0 && (
            <AnalysisCard title="Suas preferências">
              {preferenceLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </AnalysisCard>
          )}

          {profile.injury && (
            <AnalysisCard title="Atenção à sua lesão" tone="warning">
              {regions.length > 0 ? (
                <>
                  Já que você se lesionou {regionText}, sempre que dava escolhemos exercícios que forçam menos essa
                  região{rules.injuryLowImpact ? " e o cardio é na bike, com menos impacto" : ""}. Nos {riskyCount}{" "}
                  exercícios marcados com <AlertTriangle size={13} className="inline text-amber-400" />, faça com mais
                  calma, menos intensidade e pouca carga. Se sentir dor, pare e fale com o instrutor.
                </>
              ) : (
                <>
                  Você contou: &ldquo;{profile.injury}&rdquo;. Nos exercícios que envolvem essa região, faça com mais
                  calma, menos intensidade e pouca carga, para não forçar ainda mais. Se sentir dor, pare e fale com o
                  instrutor.
                </>
              )}
              <span className="mt-2 block text-offwhite/80">
                Antes de começar, mostre sua lesão pra equipe — a 1ª avaliação física é grátis.
              </span>
            </AnalysisCard>
          )}
        </div>
      </div>

      {/* Ficha */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">Sua ficha</h3>
          <p className="inline-flex items-center gap-1.5 text-xs text-offwhite/50">
            <RefreshCw size={12} />
            Toque pra trocar um exercício por outro do mesmo grupo
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { icon: Flame, title: "1ª série: aquecimento", text: WORKOUT_WARMUP },
            { icon: Timer, title: "Descanso: 2 minutos", text: WORKOUT_REST },
            { icon: Bike, title: "Cardio no final", text: rules.cardio },
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
          {workout.days.map((day, dayIndex) => (
            <div key={dayIndex} className="overflow-hidden rounded-sm border border-line bg-carbon">
              <div className={`${DAY_COLORS[dayIndex % DAY_COLORS.length]} px-5 py-3`}>
                <p className="font-display text-2xl uppercase leading-none tracking-wide text-white">Dia {dayIndex + 1}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90">{day.title}</p>
              </div>
              {day.exercises.length === 0 ? (
                <p className="px-5 py-4 text-sm text-offwhite/60">
                  Você tirou todos os exercícios desta parte do corpo. Fale com a equipe pra montar uma alternativa.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {day.exercises.map((exercise, exerciseIndex) => {
                    const risky = exerciseRisks(exercise.name, regions).length > 0
                    const technical = rules.cautiousTechnique && getExercise(exercise.id).technical
                    const canSwap = swapOptions(workout, dayIndex, exerciseIndex).length > 1
                    return (
                      <li key={`${exercise.id}-${exerciseIndex}`} className="flex items-center justify-between gap-3 px-5 py-3">
                        <span className="flex min-w-0 flex-col">
                          <span className="text-sm font-semibold text-offwhite">{exercise.name}</span>
                          <span className="text-xs font-semibold text-orange">
                            {rules.sets}x {rules.reps}
                          </span>
                          {risky && (
                            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-400">
                              <AlertTriangle size={12} />
                              Menos carga e mais calma
                            </span>
                          )}
                          {technical && (
                            <span className="mt-0.5 text-[11px] text-offwhite/50">Peça ajuda na 1ª vez</span>
                          )}
                        </span>
                        {canSwap && (
                          <button
                            type="button"
                            onClick={() => onSwap(dayIndex, exerciseIndex)}
                            aria-label={`Trocar ${exercise.name}`}
                            title="Trocar exercício"
                            data-cursor-hover
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-offwhite/60 transition-colors hover:border-orange hover:text-orange"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col items-center gap-4 rounded-sm border border-line bg-carbon p-6 text-center md:p-8">
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Dúvidas? Nos chame!</p>
        <p className="max-w-lg text-sm text-offwhite/60">
          A equipe ajusta a carga e a execução com você na academia. Suas respostas vão junto na mensagem.
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(gymMessage(workout))}`}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className={primaryButton}
          >
            <MessageCircle size={14} />
            Falar com a academia
          </a>
          <button
            type="button"
            onClick={onNew}
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/60 transition-colors hover:text-orange"
          >
            <RotateCcw size={14} />
            Montar outro treino
          </button>
          {isSaved && (
            <button
              type="button"
              onClick={() => (confirmRemove ? onRemove() : setConfirmRemove(true))}
              onBlur={() => setConfirmRemove(false)}
              data-cursor-hover
              className={`inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                confirmRemove ? "text-red-400" : "text-offwhite/40 hover:text-red-400"
              }`}
            >
              <Trash2 size={14} />
              {confirmRemove ? "Toque de novo pra apagar" : "Apagar do aparelho"}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs leading-relaxed text-offwhite/40">
        Treino montado automaticamente com os exercícios e as regras da Chico&apos;s Gym. Ele não substitui a orientação
        de um profissional: na academia, a equipe confere tudo com você.
      </p>
    </div>
  )
}

function StepFooter({ children }: { children: ReactNode }) {
  return <div className="mt-3 flex justify-end">{children}</div>
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

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-cursor-hover
      className={`rounded-sm border px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
        selected ? "border-orange bg-orange/10 text-orange" : "border-line text-offwhite/70 hover:border-orange/60"
      }`}
    >
      {label}
    </button>
  )
}

function IconToggle({
  label,
  pressed,
  disabled,
  tone,
  onClick,
  children,
}: {
  label: string
  pressed: boolean
  disabled: boolean
  tone: "like" | "avoid"
  onClick: () => void
  children: ReactNode
}) {
  const active = tone === "like" ? "border-orange bg-orange text-ink" : "border-red-400 bg-red-400 text-ink"
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      data-cursor-hover
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-30 ${
        pressed ? active : "border-line text-offwhite/50 hover:border-offwhite/40 hover:text-offwhite"
      }`}
    >
      {children}
    </button>
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
      <div className="mt-3 text-sm leading-relaxed text-offwhite/70">{children}</div>
    </div>
  )
}
