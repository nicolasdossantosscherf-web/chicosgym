import { tourAreas } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { TiltImage } from "./tilt-image"

export function TourSection() {
  return (
    <section id="academia" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="A Academia"
          title="Um espaço industrial feito pra treinar pesado"
          description="Pé-direito alto, concreto exposto e luz em losango guiando cada ambiente. Passe o mouse pelas áreas."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tourAreas.map((area, i) => (
            <Reveal key={area.id} delay={i * 70}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line bg-carbon">
                <div className="relative aspect-[4/3]">
                  <TiltImage
                    src={area.image}
                    alt={area.title}
                    label={`Foto — ${area.title}`}
                    className="h-full w-full"
                  />
                  <span className="absolute left-4 top-4 z-10 font-display text-xs uppercase tracking-[0.3em] text-offwhite/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">{area.title}</h3>
                  <p className="text-sm leading-relaxed text-offwhite/60">{area.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {area.equipment.map((eq) => (
                      <li
                        key={eq}
                        className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-offwhite/50"
                      >
                        {eq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
