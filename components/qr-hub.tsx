"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera, Check, ChevronDown, ChevronRight, Copy, Globe, MessageCircle, Star, Wifi } from "lucide-react"
import { brand, guestWifi } from "@/lib/data"

const OPTION_CLASS =
  "flex w-full items-center gap-4 rounded-xl border border-line bg-carbon p-4 text-left transition-colors hover:border-orange/60 active:bg-carbon-2"

const SOCIAL_CLASS =
  "flex items-center justify-center gap-2.5 rounded-xl border border-line bg-carbon px-4 py-4 font-display text-xl uppercase tracking-wide text-offwhite transition-colors hover:border-orange/60 active:bg-carbon-2"

const INSTAGRAM_URL = brand.socials.find((social) => social.label === "Instagram")?.href
// A mensagem pronta mostra para a academia que a pessoa chegou pelo QR Code.
const WHATSAPP_URL = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo QR Code da Chico's Gym.")}`

export function QrHub() {
  const [wifiOpen, setWifiOpen] = useState(false)

  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-md flex-col overflow-hidden px-5 pb-10 pt-14">
      <div
        aria-hidden
        className="glow-ember pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/3 opacity-60"
      />

      <header className="relative flex flex-col items-center text-center">
        <Image
          src={brand.logoWhite}
          alt="Chico's Gym"
          width={560}
          height={558}
          priority
          className="h-36 w-auto"
        />
        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange">Bem-vindo à</p>
        <h1 className="mt-1 font-display text-5xl uppercase tracking-wide text-offwhite">Chico&apos;s Gym</h1>
        <p className="mt-2 text-sm font-medium text-orange">Você quer ser um vencedor?</p>
      </header>

      <nav aria-label="Opções" className="relative mt-9 flex flex-col gap-3">
        <div className={`rounded-xl border bg-carbon transition-colors ${wifiOpen ? "border-orange/60" : "border-line"}`}>
          <button
            type="button"
            aria-expanded={wifiOpen}
            aria-controls="wifi-info"
            onClick={() => setWifiOpen((open) => !open)}
            data-cursor-hover
            className="flex w-full items-center gap-4 p-4 text-left"
          >
            <OptionIcon>
              <Wifi size={22} />
            </OptionIcon>
            <OptionText title="Conectar no Wi-Fi" description="Veja o nome da rede e a senha" />
            <ChevronDown
              size={20}
              className={`ml-auto shrink-0 text-offwhite/50 transition-transform ${wifiOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div id="wifi-info" hidden={!wifiOpen} className="border-t border-line p-4">
            <WifiDetails />
          </div>
        </div>

        <Link href="/" data-cursor-hover className={OPTION_CLASS}>
          <OptionIcon>
            <Globe size={22} />
          </OptionIcon>
          <OptionText title="Conhecer o site" description="Planos, treinos, loja e horários" />
          <ChevronRight size={20} className="ml-auto shrink-0 text-offwhite/50" />
        </Link>

        <a href={brand.googleReviewUrl} rel="noreferrer" data-cursor-hover className={OPTION_CLASS}>
          <OptionIcon>
            <Star size={22} />
          </OptionIcon>
          <OptionText title="Avaliar no Google" description="Sua opinião ajuda a academia a crescer" />
          <ChevronRight size={20} className="ml-auto shrink-0 text-offwhite/50" />
        </a>

        <div className="grid grid-cols-2 gap-3">
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Seguir a Chico's Gym no Instagram"
              data-cursor-hover
              className={SOCIAL_CLASS}
            >
              <Camera size={20} className="shrink-0 text-orange" />
              Instagram
            </a>
          )}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com a Chico's Gym no WhatsApp"
            data-cursor-hover
            className={SOCIAL_CLASS}
          >
            <MessageCircle size={20} className="shrink-0 text-orange" />
            WhatsApp
          </a>
        </div>
      </nav>

      {/* Mesma frase e estilo do título da página inicial, numa linha só: o tamanho
          acompanha a largura da tela para caber até em celular de 320px. */}
      <p className="relative mt-auto whitespace-nowrap pt-12 text-center font-display text-[min(8.4vw,36px)] uppercase leading-none tracking-tight text-offwhite">
        Onde disciplina <span className="text-gradient-ember">vira resultado.</span>
      </p>
    </div>
  )
}

function OptionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
      {children}
    </span>
  )
}

function OptionText({ title, description }: { title: string; description: string }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="font-display text-2xl uppercase leading-none tracking-wide text-offwhite">{title}</span>
      <span className="mt-1.5 text-sm text-offwhite/55">{description}</span>
    </span>
  )
}

function WifiDetails() {
  if (!guestWifi.network) {
    return <p className="text-sm text-offwhite/70">Peça o nome da rede e a senha na recepção.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-3">
        <WifiField label="Rede" value={guestWifi.network} />
        {guestWifi.password ? (
          <WifiField label="Senha" value={guestWifi.password} />
        ) : (
          <WifiField label="Senha" value="Rede aberta, sem senha" />
        )}
      </dl>

      {guestWifi.password && <CopyPasswordButton password={guestWifi.password} />}

      <ol className="list-decimal space-y-1 pl-5 text-sm text-offwhite/60">
        {guestWifi.password && <li>Toque em &ldquo;Copiar senha&rdquo;.</li>}
        <li>Abra o Wi-Fi nas configurações do celular.</li>
        <li>
          Escolha a rede <span className="font-semibold text-offwhite">{guestWifi.network}</span>
          {guestWifi.password ? " e cole a senha." : "."}
        </li>
      </ol>
    </div>
  )
}

function WifiField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink/60 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-offwhite/40">{label}</dt>
      <dd className="mt-1 select-all break-all font-mono text-lg text-offwhite">{value}</dd>
    </div>
  )
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Navegadores embutidos (leitor de QR Code, Instagram) às vezes bloqueiam a
    // API nova de copiar; o jeito antigo, com um campo invisível, ainda funciona neles.
    const field = document.createElement("textarea")
    field.value = text
    field.setAttribute("readonly", "")
    field.style.position = "fixed"
    field.style.opacity = "0"
    document.body.appendChild(field)
    field.select()
    field.setSelectionRange(0, text.length)
    const copied = document.execCommand("copy")
    field.remove()
    return copied
  }
}

function CopyPasswordButton({ password }: { password: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  async function copy() {
    if (await copyText(password)) {
      setStatus("copied")
      setTimeout(() => setStatus("idle"), 2500)
    } else {
      setStatus("failed")
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={copy}
        data-cursor-hover
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
      >
        {status === "copied" ? <Check size={16} /> : <Copy size={16} />}
        {status === "copied" ? "Senha copiada" : "Copiar senha"}
      </button>
      <p role="status" className="mt-2 text-center text-xs text-offwhite/50">
        {status === "failed" && "Não deu para copiar. Toque e segure a senha acima para copiar."}
      </p>
    </div>
  )
}
