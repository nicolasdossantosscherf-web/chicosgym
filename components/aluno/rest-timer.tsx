"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Timer } from "lucide-react"

const REST_SECONDS = 120

function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    gain.gain.value = 0.15
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.35)
    osc.onended = () => ctx.close()
  } catch {
    // Sem áudio disponível: o aviso na tela já basta.
  }
}

// Cronômetro dos 2 minutos de descanso entre séries.
export function RestTimer() {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [finished, setFinished] = useState(false)
  const alerted = useRef(false)

  useEffect(() => {
    if (endsAt === null) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [endsAt])

  const remaining = endsAt === null ? REST_SECONDS : Math.max(0, Math.ceil((endsAt - now) / 1000))

  useEffect(() => {
    if (endsAt !== null && remaining === 0 && !alerted.current) {
      alerted.current = true
      beep()
      navigator.vibrate?.([200, 100, 200])
      setFinished(true)
      setEndsAt(null)
    }
  }, [endsAt, remaining])

  const start = () => {
    alerted.current = false
    setFinished(false)
    setNow(Date.now())
    setEndsAt(Date.now() + REST_SECONDS * 1000)
  }

  const running = endsAt !== null
  const label = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-sm border p-4 transition-colors ${
        finished ? "border-emerald-500/50 bg-emerald-500/10" : running ? "border-orange bg-orange/10" : "border-line bg-carbon"
      }`}
    >
      <div className="flex items-center gap-3">
        <Timer size={22} className={finished ? "text-emerald-400" : "text-orange"} />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Descanso</p>
          <p className="font-display text-3xl leading-none tracking-wide text-offwhite" aria-live="polite">
            {finished ? "Bora!" : label}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={running ? () => setEndsAt(null) : start}
        data-cursor-hover
        className={`inline-flex items-center gap-2 rounded-sm px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
          running ? "border border-line text-offwhite/80 hover:border-orange" : "bg-orange text-ink hover:bg-gold"
        }`}
      >
        {running ? <Pause size={14} /> : <Timer size={14} />}
        {running ? "Parar" : finished ? "De novo" : "Iniciar 2:00"}
      </button>
    </div>
  )
}
