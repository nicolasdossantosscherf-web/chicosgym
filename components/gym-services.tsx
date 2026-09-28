import Link from "next/link"
import * as Icons from "lucide-react"
import { brand, gymServices } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

const linkClass =
  "mt-auto inline-flex items-center gap-2 pt-2 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/70 transition-colors hover:text-orange"

export function GymServices() {
  return (
    <section className="relative border-t border-line bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Serviços"
          title="Além do treino"
          description="Serviços extras pra acompanhar sua evolução, com condições especiais pra alunos da academia."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {gymServices.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Sparkles
            return (
              <Reveal key={service.id} delay={i * 70} className="flex bg-ink p-7">
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-orange/10 text-orange">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-offwhite/60">{service.description}</p>
                  {service.partnerId ? (
                    <Link href="/parcerias" data-cursor-hover className={linkClass}>
                      Ver parceria
                      <Icons.ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <a
                      href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                        `Olá! Quero saber mais sobre: ${service.title}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-hover
                      className={linkClass}
                    >
                      <Icons.MessageCircle size={14} />
                      Falar no WhatsApp
                    </a>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}
