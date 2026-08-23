import { Quote } from "lucide-react"
import { testimonials } from "@/lib/data"
import { Reveal } from "./reveal"

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-carbon py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="diamond-row mb-12">
          <span className="diamond-lg" />
          <span className="diamond-lg opacity-60" />
          <span className="diamond-lg opacity-30" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="flex h-full flex-col gap-4 rounded-sm border border-line bg-ink p-7">
                <Quote className="text-orange" size={22} />
                <p className="flex-1 text-sm leading-relaxed text-offwhite/70">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-display text-lg uppercase tracking-wide text-offwhite">{t.name}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-offwhite/40">{t.since}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
