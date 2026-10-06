"use client"

import { FormEvent, InputHTMLAttributes, useState } from "react"
import { Camera, Send } from "lucide-react"
import { brand } from "@/lib/data"
import { formatPhone, sanitize, validateName, validatePhone } from "@/lib/validation"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

type Key = "name" | "phone" | "goal"

function ContactField({ label, error, ...props }: { label: string; error?: string | null } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/50">{label}</span>
      <input
        {...props}
        className={`rounded-sm border bg-ink px-4 py-3 text-sm text-offwhite outline-none transition-colors placeholder:text-offwhite/30 focus:border-orange ${
          error ? "border-red-500/70" : "border-line"
        }`}
      />
      {error && (
        <span role="alert" className="text-[11px] text-red-400">
          {error}
        </span>
      )}
    </label>
  )
}

export function Contact() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [goal, setGoal] = useState("")
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [showErrors, setShowErrors] = useState(false)
  const instagram = brand.socials.find((social) => social.label === "Instagram")
  const instagramHandle = instagram ? `@${instagram.href.replace(/\/$/, "").split("/").pop()}` : ""

  const errors: Record<Key, string | null> = {
    name: validateName(name),
    phone: validatePhone(phone),
    goal: goal.trim().length >= 3 ? null : "Conte em poucas palavras o seu objetivo (ex.: emagrecer).",
  }
  const errorFor = (key: Key) => (showErrors || touched[key] ? errors[key] : null)
  const blur = (key: Key) => () => setTouched((t) => ({ ...t, [key]: true }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (Object.values(errors).some(Boolean)) {
      setShowErrors(true)
      return
    }
    const message = `Olá! Meu nome é ${name.trim()}, meu WhatsApp é ${formatPhone(phone)} e meu objetivo é: ${goal.trim()}.`
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
            noValidate
            className="mt-12 flex flex-col items-center gap-4 rounded-sm border border-line bg-carbon p-8"
          >
            <ContactField
              label="Nome"
              value={name}
              onChange={(e) => setName(sanitize.name(e.target.value))}
              onBlur={blur("name")}
              autoComplete="name"
              placeholder="Seu nome completo"
              error={errorFor("name")}
            />
            <ContactField
              label="WhatsApp com DDD"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(sanitize.phone(e.target.value))}
              onBlur={blur("phone")}
              autoComplete="tel-national"
              placeholder="55999990000"
              error={errorFor("phone")}
            />
            <ContactField
              label="Objetivo"
              value={goal}
              onChange={(e) => setGoal(sanitize.text(e.target.value))}
              onBlur={blur("goal")}
              placeholder="Ex: emagrecer, ganhar massa, condicionamento..."
              error={errorFor("goal")}
            />
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

        {instagram && (
          <Reveal delay={160}>
            <a
              href={instagram.href}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-offwhite/60 transition-colors hover:text-orange"
            >
              <Camera size={16} />
              Siga no Instagram {instagramHandle}
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
