import { timeline } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function StoryTimeline() {
  return (
    <section id="historia" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Nossa História"
          title="De galpão abandonado a referência da região"
          align="center"
          description={`Desde ${timeline[0].year}, a Chico's Gym cresce um degrau por vez — sempre com o mesmo propósito: dar estrutura de verdade pra quem decide treinar sério.`}
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
