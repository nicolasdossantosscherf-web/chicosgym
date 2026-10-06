"use client"

import { CalendarClock, CreditCard, MessageCircle } from "lucide-react"
import { brand } from "@/lib/data"
import { daysLabel, formatDate, membershipStatus, planLabel } from "@/lib/aluno"
import type { Membership } from "./types"

const TONE = {
  active: { box: "border-emerald-500/40 bg-emerald-500/5", text: "text-emerald-400", label: "Ativo" },
  expiring: { box: "border-amber-400/50 bg-amber-400/5", text: "text-amber-400", label: "Vence em breve" },
  expired: { box: "border-red-500/50 bg-red-500/5", text: "text-red-400", label: "Vencido" },
}

export function PlanTab({ membership, today, firstName }: { membership: Membership | null; today: string; firstName: string }) {
  const whatsapp = (text: string) => `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`

  if (!membership) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-sm border border-line bg-carbon p-6 md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-orange/10 text-orange">
          <CreditCard size={24} />
        </div>
        <p className="font-display text-3xl uppercase tracking-wide text-offwhite">Nenhum plano registrado</p>
        <p className="max-w-lg text-sm text-offwhite/60">
          O plano é registrado pela recepção da academia, junto com sua matrícula. Já é aluno? Peça pra recepção ativar
          seu plano aqui na Área do Aluno.
        </p>
        <a
          href={whatsapp(`Olá! Sou ${firstName}, criei minha conta na Área do Aluno e quero ativar meu plano.`)}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
        >
          <MessageCircle size={14} />
          Falar com a recepção
        </a>
      </div>
    )
  }

  const { state, daysLeft } = membershipStatus(membership.expires_on, today)
  const tone = TONE[state]

  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-sm border p-6 md:p-8 ${tone.box}`}>
        <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${tone.text}`}>{tone.label}</span>
        <p className="mt-2 font-display text-5xl uppercase tracking-wide text-offwhite">Plano {planLabel(membership.plan)}</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarClock size={18} className="mt-0.5 shrink-0 text-orange" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Vencimento</p>
              <p className="text-lg font-semibold text-offwhite">{formatDate(membership.expires_on)}</p>
              <p className={`text-sm ${tone.text}`}>
                {state === "expired"
                  ? `Venceu há ${daysLabel(Math.abs(daysLeft))}`
                  : daysLeft === 0
                    ? "Vence hoje"
                    : `Faltam ${daysLabel(daysLeft)}`}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard size={18} className="mt-0.5 shrink-0 text-orange" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Início do período</p>
              <p className="text-lg font-semibold text-offwhite">{formatDate(membership.starts_on)}</p>
            </div>
          </div>
        </div>
      </div>

      {state !== "active" && (
        <div className="flex flex-col items-start gap-3 rounded-sm border border-line bg-carbon p-5">
          <p className="text-sm text-offwhite/75">
            {state === "expired"
              ? "Seu plano venceu. Renove na recepção ou pelo WhatsApp pra continuar treinando."
              : "Seu plano está perto de vencer. Renove antes pra não ficar sem treinar."}
          </p>
          <a
            href={whatsapp(`Olá! Sou ${firstName} e quero renovar meu plano ${planLabel(membership.plan)}.`)}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
          >
            <MessageCircle size={14} />
            Renovar pelo WhatsApp
          </a>
        </div>
      )}
      <p className="text-xs text-offwhite/40">O plano e o vencimento são atualizados pela recepção da academia.</p>
    </div>
  )
}
