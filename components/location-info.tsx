import Image from "next/image"
import { Clock } from "lucide-react"
import { brand } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { LocationMap } from "./location-map"

export function LocationInfo() {
  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Local e Horários"
          title="Onde a gente treina"
          description="Endereço, horário de funcionamento e como chegar até a Chico's Gym."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
              <Image
                src="/images/tour/fachada.jpg"
                alt="Fachada da Chico's Gym"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                <span className="text-xs uppercase tracking-[0.2em] text-offwhite/70">{brand.address}</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <LocationMap />
          </Reveal>
        </div>

        <Reveal delay={200} className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-sm border border-orange/40 bg-carbon px-6 py-10 md:px-10">
            <div className="flex items-center justify-center gap-3 text-orange">
              <Clock size={20} />
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">Horário de funcionamento</span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {brand.hours.map((h) => (
                <div key={h.label} className="flex flex-col items-center gap-2 text-center sm:px-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">{h.label}</span>
                  {h.times.map((time) => (
                    <span key={time} className="font-display text-4xl uppercase leading-none text-offwhite md:text-5xl">
                      {time}
                    </span>
                  ))}
                  {h.note && <span className="text-xs text-orange">{h.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
