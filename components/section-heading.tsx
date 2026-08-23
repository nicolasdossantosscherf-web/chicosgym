import { SplitReveal } from "./split-reveal"
import { Reveal } from "./reveal"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
}) {
  const isCenter = align === "center"
  return (
    <div className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : "items-start text-left"}`}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="diamond" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">{eyebrow}</span>
        </div>
      </Reveal>
      <SplitReveal
        as="h2"
        text={title}
        mode="word"
        className={`font-display text-4xl uppercase leading-[0.95] tracking-wide text-offwhite sm:text-5xl md:text-6xl ${
          isCenter ? "mx-auto max-w-3xl" : "max-w-2xl"
        }`}
      />
      {description && (
        <Reveal delay={150} className={isCenter ? "max-w-xl" : "max-w-lg"}>
          <p className="text-base leading-relaxed text-offwhite/60">{description}</p>
        </Reveal>
      )}
    </div>
  )
}
