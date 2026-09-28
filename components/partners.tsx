import Image from "next/image"
import { Camera, Check, MapPin, MessageCircle, Percent } from "lucide-react"
import { brand, partners, type Partner } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

function PartnerVisual({ partner }: { partner: Partner }) {
  if (partner.image) {
    return (
      <Image
        src={partner.image.src}
        alt={`Cartaz da parceria da Chico's Gym com ${partner.name}`}
        width={partner.image.width}
        height={partner.image.height}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="h-auto w-full rounded-sm border border-line"
      />
    )
  }
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-sm border border-line bg-carbon p-10">
      {partner.logo && (
        <Image src={partner.logo} alt={partner.name} width={300} height={70} className="h-auto w-3/4 max-w-xs" />
      )}
    </div>
  )
}

function PartnerRow({ partner, index }: { partner: Partner; index: number }) {
  const message = `Olá! Vi no site a parceria com ${partner.name} (${partner.role}) e quero agendar um horário.`

  return (
    <article className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal className={index % 2 === 1 ? "lg:order-2" : ""}>
        <PartnerVisual partner={partner} />
      </Reveal>

      <Reveal delay={120} className="flex flex-col gap-6">
        <div>
          <span className="inline-block rounded-full bg-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
            {partner.role}
          </span>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-wide text-offwhite md:text-5xl">
            {partner.name}
          </h2>
          {partner.registry && (
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-offwhite/45">{partner.registry}</p>
          )}
          {partner.description && <p className="mt-3 text-sm text-offwhite/60">{partner.description}</p>}
        </div>

        {partner.highlights && (
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {partner.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-offwhite/75">
                <Check size={16} className="mt-0.5 shrink-0 text-orange" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {partner.benefit && (
          <div className="flex items-start gap-3 rounded-sm border border-orange/40 bg-orange/10 p-4">
            <Percent size={18} className="mt-0.5 shrink-0 text-orange" />
            <p className="text-sm text-offwhite">{partner.benefit}</p>
          </div>
        )}

        {partner.schedule && (
          <p className="flex items-start gap-2 text-sm text-offwhite/60">
            <MapPin size={16} className="mt-0.5 shrink-0 text-orange" />
            {partner.schedule}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-5">
          {partner.bookable && (
            <Magnetic>
              <a
                href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
              >
                <MessageCircle size={14} />
                Agendar pelo WhatsApp
              </a>
            </Magnetic>
          )}
          {partner.instagram && (
            <a
              href={`https://www.instagram.com/${partner.instagram}`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/70 transition-colors hover:text-orange"
            >
              <Camera size={16} />@{partner.instagram}
            </a>
          )}
        </div>
      </Reveal>
    </article>
  )
}

export function Partners() {
  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Parcerias"
          title="Parceiros da Chico's Gym"
          description="Profissionais e marcas parceiras, com condições especiais pra quem treina com a gente."
        />

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {partners.map((partner, i) => (
            <PartnerRow key={partner.id} partner={partner} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
