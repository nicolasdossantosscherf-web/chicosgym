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
          title="Quem faz a Chico's Gym acontecer"
          description="As pessoas que recebem você, orientam seu treino e cuidam da academia no dia a dia."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={(i % 3) * 90} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-carbon">
                <div className="relative aspect-[3/4]">
                  <TiltImage
                    src={member.image}
                    alt={`Ilustração de ${member.name}`}
                    label="Foto do profissional"
                    desaturate
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">{member.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">{member.role}</span>
                  {member.cref && (
                    <span className="text-[11px] uppercase tracking-[0.15em] text-offwhite/45">{member.cref}</span>
                  )}
                  {member.description && <p className="mt-2 text-sm text-offwhite/60">{member.description}</p>}
                  <a
                    href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                      `Olá! Gostaria de falar com ${member.name}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/70 transition-colors hover:text-orange"
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
