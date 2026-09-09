import Image from "next/image"
import { partners } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function Partners() {
  return (
    <section className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Parceiros"
          title="Marcas parceiras"
          description="Empresas parceiras que oferecem condições especiais para alunos da Chico's Gym."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, i) => (
            <Reveal key={partner.id} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col items-center gap-5 rounded-sm border border-line bg-ink p-8 text-center">
                <div className="relative flex h-14 w-full items-center justify-center">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={160}
                      height={56}
                      className="h-12 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-display text-xl uppercase tracking-wide text-offwhite/70">
                      {partner.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-offwhite/60">{partner.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
