"use client"

import { FormEvent, useState } from "react"
import { Send } from "lucide-react"
import { brand } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

export function Contact() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [goal, setGoal] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const message = `Olá! Meu nome é ${name}, meu WhatsApp é ${phone} e meu objetivo é: ${goal}.`
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Contato"
          title="Vem treinar com a gente"
          description="Preenche os três campos abaixo e a conversa já começa direto no WhatsApp."
          align="center"
        />

        <Reveal delay={100}>
          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col items-center gap-4 rounded-sm border border-line bg-carbon p-8"
          >
            <div className="flex w-full flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">Nome</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                placeholder="Seu nome completo"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">WhatsApp</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                placeholder="(55) 99999-0000"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">Objetivo</label>
              <input
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                placeholder="Ex: emagrecer, ganhar massa, condicionamento..."
              />
            </div>
            <Magnetic className="mt-2 w-fit">
              <button
                type="submit"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-sm bg-orange px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold"
              >
                <Send size={14} />
                Enviar pelo WhatsApp
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
