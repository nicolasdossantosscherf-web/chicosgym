"use client"

import { useState } from "react"
import { machineCategories, machines } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { TiltImage } from "./tilt-image"

export function MachineCatalog() {
  const [active, setActive] = useState<string>("Todas")
  const categories = ["Todas", ...machineCategories]
  const filtered = active === "Todas" ? machines : machines.filter((m) => m.category === active)

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Máquinas"
          title="O equipamento certo pra cada objetivo"
          description="Filtre por grupo muscular e veja o que já está te esperando na academia."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActive(cat)}
              data-cursor-hover
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                active === cat
                  ? "border-orange bg-orange text-ink"
                  : "border-line text-offwhite/60 hover:border-orange hover:text-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((machine, i) => (
            <Reveal key={machine.id} delay={(i % 6) * 60}>
              <div className="flex h-full flex-col overflow-hidden rounded-sm border border-line bg-carbon">
                <div className="relative aspect-[4/3]">
                  <TiltImage
                    src={machine.image}
                    alt={machine.name}
                    label={machine.category}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-orange">{machine.muscle}</span>
                  <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{machine.name}</h3>
                  <p className="mt-auto text-sm leading-relaxed text-offwhite/60">{machine.tip}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
