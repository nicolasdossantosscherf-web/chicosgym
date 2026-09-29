import { Quote } from "lucide-react"
import { testimonials } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function Testimonials() {
  if (testimonials.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-carbon py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow="Depoimentos" title="Feedbacks de nossos alunos" align="center" />
        {/* Até 3 por linha; com menos de 3, os cards ficam centralizados. */}
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90} className="md:basis-[calc((100%-3rem)/3)]">
              <div className="flex h-full flex-col gap-4 rounded-sm border border-line bg-ink p-7">
                <Quote className="text-orange" size={22} />
                <p className="flex-1 text-sm leading-relaxed text-offwhite/70">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-display text-lg uppercase tracking-wide text-offwhite">{t.name}</p>
                  {t.since && <p className="text-xs uppercase tracking-[0.15em] text-offwhite/40">{t.since}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
