import Image from "next/image"
import { Clock, Mail, MapPin } from "lucide-react"
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
          <Reveal className="flex flex-col gap-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
              <Image
                src="/images/contact/entrada-noite.jpg"
                alt="Entrada da Chico's Gym à noite"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                <span className="text-xs uppercase tracking-[0.2em] text-offwhite/70">{brand.address}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-sm border border-line bg-carbon p-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-orange" />
                <span className="text-sm text-offwhite/70">{brand.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-orange" />
                <span className="text-sm text-offwhite/70">{brand.email}</span>
              </div>
              <div className="col-span-full flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-orange" />
                <div className="flex flex-col gap-0.5 text-sm text-offwhite/70">
                  {brand.hours.map((h) => (
                    <span key={h.label}>
                      <span className="text-offwhite/45">{h.label}:</span> {h.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <LocationMap />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
