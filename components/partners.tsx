import Image from "next/image"
import { partners, type Partner } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

// Todo parceiro ocupa um espaço do mesmo tamanho (4:5), então tudo fica
// alinhado: cartazes e fotos preenchem o espaço, logos ficam centralizadas.
function PartnerImage({ partner }: { partner: Partner }) {
  const isLogo = partner.kind === "logo"
  return (
    <div
      className={`aspect-[4/5] ${isLogo ? "flex items-center justify-center p-[12%]" : "overflow-hidden rounded-sm"}`}
    >
      <Image
        src={partner.image.src}
        alt={partner.name}
        width={partner.image.width}
        height={partner.image.height}
        sizes="(min-width: 1024px) 22vw, 45vw"
        className={isLogo ? "h-auto max-h-full w-full object-contain" : "h-full w-full object-cover"}
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
              <PartnerImage partner={partner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
