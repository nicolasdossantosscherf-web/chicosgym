"use client"

import { ChangeEvent, FormEvent, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Check, MapPin, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { brand, shopPaymentMethods, type ShopPaymentMethodId } from "@/lib/data"
import { cartActions, formatBRL, resolveCartItem, unitPrice, useCart } from "@/lib/cart"
import { lenisStore } from "@/lib/lenis-store"
import { ProductImage } from "./product-image"

type Step = "cart" | "checkout" | "sent"

const EMPTY_FORM = { name: "", phone: "", cpf: "", email: "" }
type FormKey = keyof typeof EMPTY_FORM

const LIMITS: Record<FormKey, number> = { name: 60, phone: 11, cpf: 11, email: 100 }

// Limpa o que foi digitado: nome só com letras (acentuadas inclusive) e
// espaços simples; telefone e CPF só dígitos; e-mail sem espaços.
const SANITIZE: Record<FormKey, (value: string) => string> = {
  name: (v) => v.replace(/[^\p{L} ]|[ªº]/gu, "").replace(/ {2,}/g, " ").replace(/^ /, ""),
  phone: (v) => v.replace(/\D/g, ""),
  cpf: (v) => v.replace(/\D/g, ""),
  email: (v) => v.replace(/\s/g, ""),
}

function isValidCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false
  const checkDigit = (length: number) => {
    let sum = 0
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return checkDigit(9) === Number(cpf[9]) && checkDigit(10) === Number(cpf[10])
}

const formatCpf = (cpf: string) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
const formatPhone = (phone: string) => phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3")

function Field({ label, error, ...props }: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">{label}</span>
      <input
        {...props}
        className={`rounded-sm border bg-ink px-3 py-2.5 text-sm text-offwhite outline-none transition-colors placeholder:text-offwhite/25 focus:border-orange ${
          error ? "border-red-500/70" : "border-line"
        }`}
      />
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </label>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-cursor-hover
      className={`flex flex-col items-start rounded-sm border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
        active ? "border-orange bg-orange/10 text-offwhite" : "border-line text-offwhite/60 hover:border-orange/50"
      }`}
    >
      {children}
    </button>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange">{children}</h3>
}

export function CartDrawer() {
  const { items, open } = useCart()
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [step, setStep] = useState<Step>("cart")
  const [form, setForm] = useState(EMPTY_FORM)
  const [payment, setPayment] = useState<ShopPaymentMethodId>("pix")
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    cartActions.close()
  }, [pathname])

  useEffect(() => {
    if (!open) return
    lenisStore.instance?.stop()
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cartActions.close()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      lenisStore.instance?.start()
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const lines = items.flatMap((item) => {
    const resolved = resolveCartItem(item)
    return resolved ? [{ item, ...resolved }] : []
  })
  const count = lines.reduce((n, l) => n + l.item.qty, 0)
  const subtotalFor = (installments: boolean) =>
    lines.reduce((sum, l) => sum + unitPrice(l.product, installments) * l.item.qty, 0)

  const method = shopPaymentMethods.find((m) => m.id === payment) ?? shopPaymentMethods[0]
  const total = subtotalFor(method.installments)
  const cashSubtotal = subtotalFor(false)
  const cardSubtotal = subtotalFor(true)

  const view: Step = step === "sent" ? "sent" : lines.length === 0 ? "cart" : step

  const name = form.name.trim()
  const errors: Record<FormKey, string | undefined> = {
    name: name.split(" ").length >= 2 ? undefined : "Informe nome e sobrenome",
    phone: form.phone.length >= 10 ? undefined : "Informe o WhatsApp com DDD (10 ou 11 números)",
    cpf: isValidCpf(form.cpf) ? undefined : form.cpf.length === 11 ? "CPF inválido" : "Informe os 11 números do CPF",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? undefined : "Informe um e-mail válido",
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const fieldError = (key: FormKey) => (showErrors ? errors[key] : undefined)

  const setField = (key: FormKey) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = SANITIZE[key](e.target.value).slice(0, LIMITS[key])
    setForm((f) => ({ ...f, [key]: value }))
  }

  const close = () => {
    cartActions.close()
    if (step === "sent") setStep("cart")
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (hasErrors) {
      setShowErrors(true)
      return
    }

    const message = [
      "*Novo pedido — Loja Chico's Gym*",
      "",
      ...lines.map((l) => {
        const variant = l.variant ? ` (${l.product.variantLabel ?? "Opção"}: ${l.variant.label})` : ""
        const lineTotal = formatBRL(unitPrice(l.product, method.installments) * l.item.qty)
        return `• ${l.item.qty}x ${l.product.title}${variant} — ${lineTotal}`
      }),
      "",
      `*Total: ${formatBRL(total)}*`,
      `*Pagamento:* ${method.label}`,
      "*Retirada na academia*",
      "",
      `*Nome:* ${name}`,
      `*WhatsApp:* ${formatPhone(form.phone)}`,
      `*CPF:* ${formatCpf(form.cpf)}`,
      `*E-mail:* ${form.email}`,
    ].join("\n")

    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`, "_blank")
    setStep("sent")
  }

  const startNewOrder = () => {
    cartActions.clear()
    setStep("cart")
    cartActions.close()
  }

  const title = view === "checkout" ? "Finalizar pedido" : view === "sent" ? "Pedido pronto" : "Seu carrinho"

  return (
    <div inert={!open} className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-lenis-prevent
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-carbon shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            {view === "checkout" && (
              <button
                type="button"
                onClick={() => setStep("cart")}
                aria-label="Voltar ao carrinho"
                data-cursor-hover
                className="text-offwhite/60 transition-colors hover:text-orange"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-display text-2xl uppercase tracking-wide text-offwhite">{title}</h2>
            {view === "cart" && count > 0 && <span className="text-xs text-offwhite/40">({count})</span>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fechar carrinho"
            data-cursor-hover
            className="text-offwhite/60 transition-colors hover:text-orange"
          >
            <X size={22} />
          </button>
        </header>

        {view === "cart" && lines.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-offwhite/20" />
            <p className="text-sm text-offwhite/60">Seu carrinho está vazio.</p>
            <Link
              href="/loja"
              onClick={close}
              data-cursor-hover
              className="rounded-sm border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
            >
              Ver produtos
            </Link>
          </div>
        )}

        {view === "cart" && lines.length > 0 && (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map(({ item, product, variant }) => (
                <li key={`${item.productId}:${item.variantId ?? ""}`} className="flex gap-4 py-4">
                  <Link href={`/loja/${product.id}`} onClick={close} className="shrink-0" data-cursor-hover>
                    <ProductImage
                      product={product}
                      variant={variant}
                      highlight
                      sizes="80px"
                      className="h-24 w-20 rounded-sm"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/loja/${product.id}`}
                      onClick={close}
                      data-cursor-hover
                      className="font-display text-lg uppercase leading-tight tracking-wide text-offwhite hover:text-orange"
                    >
                      {product.title}
                    </Link>
                    {variant && (
                      <span className="text-xs text-offwhite/50">
                        {product.variantLabel ?? "Opção"}: {variant.label}
                      </span>
                    )}
                    <span className="mt-1 text-sm font-semibold text-orange">{formatBRL(product.price * item.qty)}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-sm border border-line">
                        <button
                          type="button"
                          onClick={() => cartActions.setQty(item.productId, item.variantId, item.qty - 1)}
                          aria-label="Diminuir quantidade"
                          data-cursor-hover
                          className="px-2.5 py-1.5 text-offwhite/70 hover:text-orange"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-6 text-center text-sm text-offwhite">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => cartActions.setQty(item.productId, item.variantId, item.qty + 1)}
                          aria-label="Aumentar quantidade"
                          data-cursor-hover
                          className="px-2.5 py-1.5 text-offwhite/70 hover:text-orange"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => cartActions.setQty(item.productId, item.variantId, 0)}
                        aria-label={`Remover ${product.title}`}
                        data-cursor-hover
                        className="text-offwhite/40 transition-colors hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="flex flex-col gap-3 border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-offwhite/60">Subtotal à vista</span>
                <span className="font-display text-2xl text-offwhite">{formatBRL(cashSubtotal)}</span>
              </div>
              {cardSubtotal !== cashSubtotal && (
                <p className="-mt-2 text-right text-xs text-offwhite/50">
                  ou {formatBRL(cardSubtotal)} no cartão parcelado
                </p>
              )}
              <p className="text-xs text-offwhite/40">A forma de pagamento você escolhe na próxima etapa.</p>
              <button
                type="button"
                onClick={() => {
                  setShowErrors(false)
                  setStep("checkout")
                }}
                data-cursor-hover
                className="rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
              >
                Finalizar pedido
              </button>
              <button
                type="button"
                onClick={close}
                data-cursor-hover
                className="rounded-sm border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}

        {view === "checkout" && (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-3">
                <SectionTitle>Seus dados</SectionTitle>
                <Field
                  label="Nome completo *"
                  value={form.name}
                  onChange={setField("name")}
                  autoComplete="name"
                  error={fieldError("name")}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="WhatsApp com DDD *"
                    type="tel"
                    inputMode="numeric"
                    placeholder="55999999999"
                    value={form.phone}
                    onChange={setField("phone")}
                    autoComplete="tel-national"
                    error={fieldError("phone")}
                  />
                  <Field
                    label="CPF *"
                    inputMode="numeric"
                    placeholder="Só números"
                    value={form.cpf}
                    onChange={setField("cpf")}
                    autoComplete="off"
                    error={fieldError("cpf")}
                  />
                </div>
                <Field
                  label="E-mail *"
                  type="email"
                  inputMode="email"
                  placeholder="seuemail@exemplo.com"
                  value={form.email}
                  onChange={setField("email")}
                  autoComplete="email"
                  error={fieldError("email")}
                />
              </div>

              <div className="flex flex-col gap-3">
                <SectionTitle>Retirada</SectionTitle>
                <div className="flex items-start gap-3 rounded-sm border border-line bg-ink p-3 text-sm text-offwhite/70">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-orange" />
                  <span>
                    Retire seu pedido na academia:
                    <span className="mt-1 block text-offwhite/50">{brand.address}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SectionTitle>Pagamento</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  {shopPaymentMethods.map((m) => (
                    <Choice key={m.id} active={payment === m.id} onClick={() => setPayment(m.id)}>
                      {m.label}
                    </Choice>
                  ))}
                </div>
              </div>
            </div>

            <footer className="flex flex-col gap-2 border-t border-line px-6 py-5 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-offwhite">
                  Total <span className="text-offwhite/50">{method.installments ? "(parcelado)" : "(à vista)"}</span>
                </span>
                <span className="font-display text-3xl text-orange">{formatBRL(total)}</span>
              </div>
              {showErrors && hasErrors && (
                <p className="text-xs text-red-400">Preencha os campos marcados pra continuar.</p>
              )}
              <button
                type="submit"
                data-cursor-hover
                className="mt-2 rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
              >
                Enviar pedido no WhatsApp
              </button>
            </footer>
          </form>
        )}

        {view === "sent" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-orange text-orange">
              <Check size={26} />
            </span>
            <p className="font-display text-2xl uppercase tracking-wide text-offwhite">Seu pedido está no WhatsApp</p>
            <p className="text-sm text-offwhite/60">
              Abrimos a conversa com o pedido já escrito. É só enviar a mensagem por lá pra concluir.
            </p>
            <button
              type="button"
              onClick={startNewOrder}
              data-cursor-hover
              className="mt-2 w-full rounded-sm bg-orange px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
            >
              Fazer um novo pedido
            </button>
            <button
              type="button"
              onClick={() => setStep("checkout")}
              data-cursor-hover
              className="text-xs text-offwhite/50 underline-offset-4 transition-colors hover:text-orange hover:underline"
            >
              O WhatsApp não abriu? Tentar de novo
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
