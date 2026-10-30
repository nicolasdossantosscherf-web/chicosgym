"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { stats } from "@/lib/data"

function CountUp({ target, decimals = 0, suffix = "" }: { target: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(target * eased)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Cada metade da faixa repete os números até ter pelo menos isso de itens,
// pra cobrir telas largas mesmo com poucos números cadastrados.
const MIN_ITEMS_PER_HALF = 10
const SECONDS_PER_ITEM = 5

export function StatsBar() {
  const repeats = Math.ceil(MIN_ITEMS_PER_HALF / stats.length)
  const half = Array.from({ length: repeats }, () => stats).flat()
  const items = [...half, ...half]
  const duration = { "--marquee-duration": `${half.length * SECONDS_PER_ITEM}s` } as CSSProperties

  return (
    <section className="relative overflow-hidden border-y border-line bg-carbon">
      <div className="marquee [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <ul aria-label="Números da Chico's Gym" className="marquee-track flex w-max" style={duration}>
          {items.map((stat, i) => {
            // Só a primeira aparição de cada número é lida por leitores de tela.
            const isCopy = i >= stats.length
            return (
              <li
                key={i}
                aria-hidden={isCopy || undefined}
                data-marquee-copy={isCopy || undefined}
                className="flex shrink-0 items-center"
              >
                <div className="flex flex-col gap-1 px-10 py-10 sm:px-14 sm:py-12">
                  <span className="font-display text-4xl text-gradient-ember sm:text-5xl">
                    <CountUp target={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
                  </span>
                  <span className="whitespace-nowrap text-xs uppercase tracking-[0.2em] text-offwhite/50">
                    {stat.label}
                  </span>
                </div>
                <span aria-hidden className="diamond opacity-50" />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
