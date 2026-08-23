"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import { Clock, Mail, MapPin, Send } from "lucide-react"
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
    <section id="contato" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Contato"
          title="Vem treinar com a gente"
          description="Preenche os três campos abaixo e a conversa já começa direto no WhatsApp."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-sm border border-line bg-carbon p-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">Nome</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">WhatsApp</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-sm border border-line bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange"
                  placeholder="(55) 99999-0000"
                />
              </div>
              <div className="flex flex-col gap-2">
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

          <Reveal delay={120} className="flex flex-col gap-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
              <Image
                src="/images/contact/entrada-noite.jpg"
                alt="Entrada da Chico's Gym à noite"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                <span className="text-xs uppercase tracking-[0.2em] text-offwhite/70">{brand.address}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-sm border border-line bg-carbon p-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-orange" />
                <span className="text-sm text-offwhite/70">{brand.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-orange" />
                <span className="text-sm text-offwhite/70">{brand.email}</span>
              </div>
              <div className="col-span-full flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-orange" />
                <div className="flex flex-col gap-0.5 text-sm text-offwhite/70">
                  {brand.hours.map((h) => (
                    <span key={h.label}>
                      <span className="text-offwhite/45">{h.label}:</span> {h.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
