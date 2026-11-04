"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { LedClock, LedClockCompact } from "./led-clock"

// Relógio do cabeçalho: compacto (hora + aberta/fechada); ao tocar, abre logo
// abaixo o relógio completo, igual ao da parede da academia.
// A temperatura só é buscada quando o relógio completo abre (e de novo se a
// última leitura tiver mais de 10 minutos).
const TEMPERATURE_MAX_AGE = 10 * 60 * 1000

export function HeaderClock({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [temperature, setTemperature] = useState<number | null>(null)
  const fetchedAt = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!open || Date.now() - fetchedAt.current < TEMPERATURE_MAX_AGE) return
    fetchedAt.current = Date.now()
    const controller = new AbortController()
    fetch("/api/clima", { signal: controller.signal })
      .then((response) => response.json() as Promise<{ temperature: number | null }>)
      .then((data) => setTemperature(data.temperature))
      .catch(() => {
        // Sem conexão ou cancelado: tenta de novo na próxima vez que abrir.
        fetchedAt.current = 0
      })
    return () => controller.abort()
  }, [open])

  useEffect(() => {
    // Mesmo padrão do menu: trocar de página fecha o painel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="header-clock-panel"
        aria-label={open ? "Fechar relógio da academia" : "Ver relógio da academia"}
        onClick={() => setOpen((value) => !value)}
        data-cursor-hover
        className="block rounded-[10px] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
      >
        <LedClockCompact className="h-11 w-auto md:h-[52px]" />
      </button>

      <div
        id="header-clock-panel"
        hidden={!open}
        className="absolute left-1/2 top-full z-10 mt-3 w-[min(380px,calc(100vw-2rem))] -translate-x-1/2"
      >
        <div className="rounded-2xl border border-line bg-ink p-3 shadow-2xl">
          <LedClock className="h-auto w-full" temperature={temperature} />
          <Link
            href="/local"
            data-cursor-hover
            className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
          >
            Ver todos os horários
            <ArrowRight size={14} />
          </Link>
          {/* Crédito exigido pela licença dos dados (CC BY 4.0). */}
          <p className="mt-2 text-center text-[10px] text-offwhite/35">
            Temperatura em Três de Maio:{" "}
            <a href="https://www.met.no/en" target="_blank" rel="noreferrer" className="underline hover:text-offwhite/60">
              MET Norway
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
