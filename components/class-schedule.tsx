import { classSchedule } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

const DAYS_ORDER = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

export function ClassSchedule() {
  const byDay = DAYS_ORDER.map((day) => ({
    day,
    slots: classSchedule.filter((s) => s.day === day),
  })).filter((d) => d.slots.length > 0)

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Grade de Aulas"
          title="Horário das aulas em grupo"
          description="Modelo de referência — a grade oficial é confirmada na recepção."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byDay.map((d, i) => (
            <Reveal key={d.day} delay={i * 60}>
              <div className="rounded-sm border border-line bg-carbon p-6">
                <h3 className="font-display text-xl uppercase tracking-wide text-offwhite">{d.day}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {d.slots.map((slot) => (
                    <li key={slot.time} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-offwhite/70">{slot.modality}</span>
                      <span className="font-mono text-orange">{slot.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
