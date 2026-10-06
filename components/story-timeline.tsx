import Image from "next/image"
import Link from "next/link"
import { Camera, PenLine } from "lucide-react"
import { brand, timeline } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

// Enquanto a academia não envia a história oficial, a página mostra que ela
// está sendo escrita — sem inventar fatos.
function StoryInProgress() {
  const instagram = brand.socials.find((s) => s.label === "Instagram")
  return (
    <section id="historia" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center md:px-10">
        <Reveal>
          <div className="relative">
            <Image src={brand.logo} alt="Chico's Gym" width={120} height={120} className="h-28 w-28 rounded-full" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
              Est. {brand.founded}
            </span>
          </div>
        </Reveal>
        <div className="mt-10">
          <SectionHeading
            eyebrow="Nossa História"
            title="Nossa história está sendo escrita"
            align="center"
            description={`A Chico's Gym nasceu em ${brand.founded}, em Três de Maio. Em breve, a gente conta aqui como tudo começou — pelas palavras de quem fez acontecer.`}
          />
        </div>
        <Reveal delay={200}>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-orange/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange">
            <PenLine size={14} />
            Em construção
          </span>
        </Reveal>
        {instagram && (
          <Reveal delay={260}>
            <Link
              href={instagram.href}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="mt-6 inline-flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-orange"
            >
              <Camera size={16} />
              Enquanto isso, siga no Instagram
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function StoryTimeline() {
  if (timeline.length === 0) return <StoryInProgress />

  return (
    <section id="historia" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Nossa História"
          title="Nossa história"
          align="center"
          description={`Desde ${timeline[0].year}, a Chico's Gym cresce um degrau por vez.`}
        />

        <div className="relative mt-16 flex flex-col gap-12 pl-8 md:pl-0">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 90} className="relative md:grid md:grid-cols-2 md:gap-10">
              <span className="absolute -left-8 top-1 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-orange shadow-[0_0_16px_2px_rgba(242,101,34,0.6)] md:left-1/2" />
              <div className={i % 2 === 0 ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                <span className="font-display text-3xl text-gradient-ember">{item.year}</span>
                <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-offwhite">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-offwhite/60">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
