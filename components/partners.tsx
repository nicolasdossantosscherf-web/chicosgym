"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { brand, partners } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

export function Partners() {
  const [selectedId, setSelectedId] = useState<string | null>(partners[0]?.id ?? null)
  const active = partners.find((partner) => partner.id === selectedId)

  return (
    <section className="relative border-t border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Parceiros"
          title="Marcas parceiras"
          description="Toque em um parceiro para ver os detalhes e falar direto sobre essa parceria."
          align="center"
        />

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {partners.map((partner) => {
            const isActive = partner.id === selectedId
            return (
              <button
                key={partner.id}
                type="button"
                onClick={() => setSelectedId(isActive ? null : partner.id)}
                data-cursor-hover
                aria-pressed={isActive}
                className={`flex h-20 w-44 items-center justify-center rounded-sm border p-5 transition-colors ${
                  isActive ? "border-orange bg-carbon" : "border-line bg-carbon/60 hover:border-orange/40"
                }`}
              >
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="font-display text-sm uppercase tracking-wide text-offwhite/70">{partner.name}</span>
                )}
              </button>
            )
          })}
        </div>

        {active && (
          <Reveal delay={80} className="mt-10">
            <div className="rounded-sm border border-line bg-carbon p-8">
              <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{active.name}</h3>

              <div className="mt-4 flex flex-col divide-y divide-line border-y border-line">
                {(active.faqs?.length ? active.faqs : [{ question: "Detalhes da parceria", answer: active.description }]).map(
                  (item) => (
                    <div key={item.question} className="py-4">
                      <span className="text-sm font-semibold uppercase tracking-[0.15em] text-offwhite/80">
                        {item.question}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-offwhite/60">{item.answer}</p>
                    </div>
                  )
                )}
              </div>

              <Magnetic className="mt-6 w-fit">
                <a
                  href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                    `Quero saber mais sobre a parceria da Chico's Gym com a ${active.name}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="inline-flex items-center gap-2 rounded-sm bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
                >
                  <MessageCircle size={14} />
                  Falar sobre essa parceria
                </a>
              </Magnetic>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
