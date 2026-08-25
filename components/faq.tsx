"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { faqs } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" align="center" />

        <div className="mt-12 flex flex-col divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.question} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor-hover
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-lg uppercase tracking-wide text-offwhite">
                    {item.question}
                  </span>
                  <Plus size={18} className={`shrink-0 text-orange transition-transform ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-offwhite/60">{item.answer}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
