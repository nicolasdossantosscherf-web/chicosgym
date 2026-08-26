"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Magnetic } from "./magnetic"
import { brand } from "@/lib/data"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="top" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-aisle.jpg"
          alt="Piso de treino da Chico's Gym, iluminação em losango"
          fill
          priority
          sizes="100vw"
          className="photo-grade animate-hero-zoom object-cover object-center"
        />
      </div>

      {!reduced && (
        <div
          aria-hidden="true"
          className="glow-ember pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 md:px-10">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange">
          Academia · Est. {brand.founded}
        </span>

        <h1 className="font-display text-[16vw] uppercase leading-[0.86] tracking-tight text-offwhite sm:text-[11vw] md:text-[7.2vw]">
          ONDE DISCIPLINA
          <br />
          <span className="text-gradient-ember">VIRA RESULTADO.</span>
        </h1>

        <p className="mt-6 max-w-md text-sm text-offwhite/60 md:text-base">
          Estrutura industrial, equipamentos completos e uma equipe pronta para te levar mais longe. Bem-vindo à
          Chico&apos;s Gym.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-sm bg-orange px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold"
            >
              Agende seu treino experimental
            </a>
          </Magnetic>
          <Magnetic>
            <Link
              href="/academia"
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-sm border border-line px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
            >
              Conheça o espaço
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-offwhite/40">
        <span className="text-[10px] uppercase tracking-[0.3em]">Role para explorar</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}
