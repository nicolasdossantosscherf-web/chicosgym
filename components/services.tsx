import * as Icons from "lucide-react"
import { services } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function Services() {
  return (
    <section id="modalidades" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Modalidades"
          title="Serviços pensados pra cada fase da sua evolução"
          description="De quem está começando à musculação pesada — a estrutura acompanha o seu ritmo."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Dumbbell
            return (
              <Reveal key={service.id} delay={i * 60} className="bg-ink p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-orange/10 text-orange">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-offwhite/60">{service.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
