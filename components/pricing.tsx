"use client"

import { Check } from "lucide-react"
import { plans, brand } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function Pricing() {
  const basePlan = plans[0]

  return (
    <section id="planos" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha seu ritmo de treino"
          description="Valores de referência para validar o layout — a tabela oficial da Chico's Gym substitui estes números antes da publicação."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const total = plan.monthlyPrice * plan.months
            const baseTotal = basePlan.monthlyPrice * plan.months
            const savings = baseTotal - total
            const savingsPercent = Math.round((savings / baseTotal) * 100)

            return (
              <Reveal key={plan.id} delay={i * 80} className="h-full">
                <div
                  className={`relative flex h-full flex-col gap-6 rounded-sm border p-7 ${
                    plan.highlight ? "border-orange bg-carbon-2" : "border-line bg-carbon"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-7 rounded-full bg-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                      Mais popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">{plan.label}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-display text-4xl text-offwhite">{formatBRL(plan.monthlyPrice)}</span>
                      <span className="text-xs text-offwhite/50">/mês</span>
                    </div>
                    {plan.months > 1 ? (
                      <p className="mt-2 text-xs text-offwhite/50">
                        {formatBRL(total)} cobrados a cada {plan.months} meses
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-offwhite/50">Sem fidelidade</p>
                    )}
                    {savings > 0 && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-orange">
                        Economize {formatBRL(savings)} ({savingsPercent}%) vs. mensal
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-offwhite/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-orange" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Magnetic className="w-full">
                    <a
                      href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                        `Quero o plano ${plan.label} da Chico's Gym`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-hover
                      className={`flex w-full items-center justify-center rounded-sm px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                        plan.highlight
                          ? "bg-orange text-ink hover:bg-gold"
                          : "border border-line text-offwhite/80 hover:border-orange hover:text-orange"
                      }`}
                    >
                      Matricular
                    </a>
                  </Magnetic>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
