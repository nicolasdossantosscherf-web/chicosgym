"use client"

import { useSyncExternalStore } from "react"
import { isGeneratedWorkout, normalizeWorkout, type GeneratedWorkout } from "./workout-engine"

// Treino salvo no próprio aparelho (localStorage). Nada sai do celular: quando
// a Área do Aluno entrar no ar, o treino passa a ser salvo na conta.
const STORAGE_KEY = "chicos-gym:meu-treino"

const listeners = new Set<() => void>()
let cache: { raw: string | null; workout: GeneratedWorkout | null } = { raw: null, workout: null }

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Navegação privada ou armazenamento bloqueado: segue sem treino salvo.
    return null
  }
}

function getSnapshot(): GeneratedWorkout | null {
  const raw = readRaw()
  if (raw === cache.raw) return cache.workout
  let workout: GeneratedWorkout | null = null
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)
      workout = isGeneratedWorkout(parsed) ? normalizeWorkout(parsed) : null
    } catch {
      workout = null
    }
  }
  cache = { raw, workout }
  return workout
}

// No servidor (e durante a hidratação) ainda não dá pra saber se há treino salvo.
function getServerSnapshot(): undefined {
  return undefined
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

/** `undefined` enquanto não carregou, `null` se não há treino salvo. */
export function useSavedWorkout(): GeneratedWorkout | null | undefined {
  return useSyncExternalStore<GeneratedWorkout | null | undefined>(subscribe, getSnapshot, getServerSnapshot)
}

/** Retorna `false` se o aparelho não deixou salvar. */
export function saveWorkout(workout: GeneratedWorkout) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workout))
    notify()
    return true
  } catch {
    return false
  }
}

export function clearSavedWorkout() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nada a fazer.
  }
  notify()
}
