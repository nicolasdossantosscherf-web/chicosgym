"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { testimonials } from "@/lib/data"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

const AUTOPLAY_MS = 7000
const SWIPE_PX = 50

export function Testimonials() {
  const count = testimonials.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const swipeStartX = useRef<number | null>(null)

  const go = (next: number) => setIndex((next + count) % count)

  // Troca sozinho; qualquer troca manual reinicia a contagem.
  useEffect(() => {
    if (paused || reduced || count < 2) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, paused, reduced, count])

  if (count === 0) return null

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipeStartX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStartX.current === null) return
    const dx = e.clientX - swipeStartX.current
    swipeStartX.current = null
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? index + 1 : index - 1)
  }

  return (
    <section className="relative overflow-hidden bg-carbon py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow="Depoimentos" title="Feedbacks de nossos alunos" align="center" />

        <Reveal className="mx-auto mt-12 max-w-4xl">
          <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="Feedbacks de alunos"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* Todos os slides ocupam a mesma célula: a altura fica a do maior feedback. */}
            <div
              aria-live={paused ? "polite" : "off"}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipeStartX.current = null)}
              className="grid touch-pan-y overflow-hidden rounded-sm border border-line bg-ink"
            >
              {testimonials.map((t, i) => {
                const position =
                  i === index ? "translate-x-0 opacity-100" : i < index ? "-translate-x-10 opacity-0" : "translate-x-10 opacity-0"
                return (
                  <figure
                    key={t.name}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} de ${count}`}
                    inert={i !== index}
                    className={`col-start-1 row-start-1 flex flex-col items-center justify-center gap-6 px-7 py-12 text-center transition-all duration-700 ease-out md:px-16 md:py-14 ${position}`}
                  >
                    <Quote className="text-orange" size={28} />
                    <blockquote className="text-base leading-relaxed text-offwhite/80 md:text-xl">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption>
                      <p className="font-display text-xl uppercase tracking-wide text-offwhite">{t.name}</p>
                      {t.since && <p className="text-xs uppercase tracking-[0.15em] text-offwhite/40">{t.since}</p>}
                    </figcaption>
                  </figure>
                )
              })}
            </div>

            {count > 1 && (
              <div className="mt-6 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Feedback anterior"
                  data-cursor-hover
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Ver feedback de ${t.name}`}
                      aria-current={i === index}
                      data-cursor-hover
                      className="flex h-6 items-center"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-500 ${
                          i === index ? "w-8 bg-orange" : "w-3 bg-offwhite/25 hover:bg-offwhite/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Próximo feedback"
                  data-cursor-hover
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
