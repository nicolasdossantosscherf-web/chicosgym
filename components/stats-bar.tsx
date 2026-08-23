"use client"

import { useEffect, useRef, useState } from "react"
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

export function StatsBar() {
  return (
    <section className="relative border-y border-line bg-carbon">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <span className="font-display text-4xl text-gradient-ember sm:text-5xl">
              <CountUp target={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-offwhite/50">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
