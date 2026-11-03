import Image from "next/image"
import { partners, type Partner } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

// Fração do espaço de cada parceiro que a logo ocupa (em área). Igualar a área,
// em vez da largura, deixa logos largas e quadradas com o mesmo peso visual.
const LOGO_AREA = 0.25
const MAX_WIDTH = 0.88
// Altura do espaço em relação à largura (formato 3:2).
const SLOT_HEIGHT = 2 / 3

function PartnerLogo({ partner }: { partner: Partner }) {
  const ratio = partner.image.width / partner.image.height
  const width = Math.min(MAX_WIDTH, Math.sqrt(LOGO_AREA * ratio), SLOT_HEIGHT * 0.9 * ratio)
  return (
    <div className="flex aspect-[3/2] items-center justify-center">
      <Image
        src={partner.image.src}
        alt={partner.name}
        width={partner.image.width}
        height={partner.image.height}
        sizes="(min-width: 1024px) 22vw, 45vw"
        style={{ width: `${(width * 100).toFixed(1)}%` }}
        className="h-auto"
      />
    </div>
  )
}

export function Partners() {
  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow="Parcerias" title="Nossos Parceiros" align="center" />

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <Reveal key={partner.id} delay={i * 80}>
              <PartnerLogo partner={partner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
