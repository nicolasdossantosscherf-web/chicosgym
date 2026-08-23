import Link from "next/link"
import * as Icons from "lucide-react"
import { sitePages } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function ExploreGrid() {
  return (
    <section className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Explore"
          title="Cada parte da Chico's Gym, em detalhe"
          description="Navegue pelas páginas da academia — do espaço físico aos planos disponíveis."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sitePages.map((page, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[page.icon] ?? Icons.ArrowUpRight
            return (
              <Reveal key={page.href} delay={i * 60}>
                <Link
                  href={page.href}
                  data-cursor-hover
                  className="group flex h-full flex-col gap-4 rounded-sm border border-line bg-ink p-7 transition-colors hover:border-orange"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-orange/10 text-orange">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <Icons.ArrowUpRight
                      size={18}
                      className="text-offwhite/30 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange"
                    />
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">{page.label}</h3>
                  <p className="text-sm leading-relaxed text-offwhite/60">{page.description}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
