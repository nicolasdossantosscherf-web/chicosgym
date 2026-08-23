import { ArrowRight } from "lucide-react"
import { brand } from "@/lib/data"
import { Magnetic } from "./magnetic"
import { Reveal } from "./reveal"

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,101,34,0.16),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <Reveal>
          <span className="diamond-lg inline-block" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-5xl uppercase leading-[0.95] text-offwhite sm:text-6xl md:text-7xl">
            Pronto para <span className="text-gradient-ember">começar?</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-md text-sm text-offwhite/60 md:text-base">
            Sua primeira aula é por nossa conta. Vem sentir a estrutura da Chico&apos;s Gym de perto.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <Magnetic>
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-sm bg-orange px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold"
            >
              Agendar treino experimental
              <ArrowRight size={16} />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
