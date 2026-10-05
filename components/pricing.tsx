"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { plans, brand, trialClass } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function PlanCard({
  label,
  price,
  priceNote,
  details,
  badge,
  features,
  cta,
  message,
  highlight,
}: {
  label: string
  price: string
  priceNote?: string
  details: ReactNode
  badge?: string
  features: string[]
  cta: string
  message: string
  highlight?: boolean
}) {
  return (
    <div
      className={`relative flex h-full flex-col gap-6 rounded-sm border p-7 ${
        highlight ? "border-orange bg-carbon-2" : "border-line bg-carbon"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-7 rounded-full bg-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
          {badge}
        </span>
      )}
      <div>
        <h3 className="font-display text-2xl uppercase tracking-wide text-offwhite">{label}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-4xl text-offwhite">{price}</span>
          {priceNote && <span className="text-xs text-offwhite/50">{priceNote}</span>}
        </div>
        {details}
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-offwhite/70">
            <Check size={15} className="mt-0.5 shrink-0 text-orange" />
            {feature}
          </li>
        ))}
      </ul>

      <Magnetic className="w-full">
        <a
          href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className={`flex w-full items-center justify-center rounded-sm px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
            highlight
              ? "bg-orange text-ink hover:bg-gold"
              : "border border-line text-offwhite/80 hover:border-orange hover:text-orange"
          }`}
        >
          {cta}
        </a>
      </Magnetic>
    </div>
  )
}

export function Pricing() {
  const basePlan = plans[0]

  return (
    <section id="planos" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha seu ritmo de treino"
          description="Sem taxa de matrícula em nenhum plano. Alunos ainda ganham desconto em nutricionista e massoterapeuta parceiros, com atendimento presencial na própria academia."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Reveal className="h-full">
            <PlanCard
              label={trialClass.label}
              price="Grátis"
              details={
                <>
                  <p className="mt-2 text-xs text-offwhite/50">Experimente antes de escolher</p>
                  <Link
                    href="/treino"
                    data-cursor-hover
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange transition-colors hover:text-gold"
                  >
                    Não sabe por onde começar? Descubra seu treino
                    <ArrowRight size={12} className="shrink-0" />
                  </Link>
                </>
              }
              features={trialClass.features}
              cta="Agendar"
              message="Olá! Quero agendar minha aula experimental gratuita na Chico's Gym."
            />
          </Reveal>

          {plans.map((plan, i) => {
            const total = plan.monthlyPrice * plan.months
            const baseTotal = basePlan.monthlyPrice * plan.months
            const savings = baseTotal - total
            const savingsPercent = Math.round((savings / baseTotal) * 100)

            return (
              <Reveal key={plan.id} delay={(i + 1) * 80} className="h-full">
                <PlanCard
                  label={plan.label}
                  price={formatBRL(plan.monthlyPrice)}
                  priceNote="/mês"
                  badge={plan.highlight ? "Mais popular" : undefined}
                  highlight={plan.highlight}
                  features={plan.features}
                  cta="Matricular"
                  message={`Quero o plano ${plan.label} da Chico's Gym`}
                  details={
                    <>
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
                    </>
                  }
                />
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
