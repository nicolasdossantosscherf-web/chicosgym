import { MessageCircle } from "lucide-react"
import { team, brand } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { TiltImage } from "./tilt-image"

export function Team() {
  return (
    <section id="equipe" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Equipe"
          title="Profissionais que treinam junto com você"
          description="Passe o mouse: a foto em preto e branco ganha cor. Cada profissional com CREF ativo e especialidade própria."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 90}>
              <div className="group flex flex-col overflow-hidden rounded-sm border border-line bg-carbon">
                <div className="relative aspect-[3/4]">
                  <TiltImage src={member.image} alt={member.name} label="Foto do profissional" desaturate className="h-full w-full" />
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{member.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">{member.role}</span>
                  <p className="mt-1 text-sm text-offwhite/60">{member.specialty}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-offwhite/35">
                    {member.cref ?? "CREF a confirmar"}
                  </p>
                  <a
                    href={`https://wa.me/${brand.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/70 transition-colors hover:text-orange"
                  >
                    <MessageCircle size={14} />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
