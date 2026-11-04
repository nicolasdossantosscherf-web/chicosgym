import { useSyncExternalStore } from "react"

// Um único relógio pro site inteiro: um intervalo só, que avisa quem estiver
// inscrito quando o segundo muda (checa 4x por segundo pra não atrasar a virada).
let currentSecond = 0
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    timer = setInterval(() => {
      const second = Math.floor(Date.now() / 1000)
      if (second === currentSecond) return
      currentSecond = second
      listeners.forEach((notify) => notify())
    }, 250)
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

function getSnapshot() {
  if (!currentSecond) currentSecond = Math.floor(Date.now() / 1000)
  return currentSecond
}

// Segundo atual (Unix). No servidor é null: não existe o "agora" de quem visita,
// então o componente mostra o relógio apagado até montar no navegador.
export function useClockSecond(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}
