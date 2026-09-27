"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { products, brand, type Product } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { Magnetic } from "./magnetic"

type Payment = "pix" | "card"

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function ProductCard({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id)
  const [payment, setPayment] = useState<Payment>("pix")

  const variant = product.variants?.find((v) => v.id === variantId)
  const variantLabel = product.variantLabel ?? "Opção"
  const image = variant?.image ?? product.image
  const slots = !variant?.image && variant?.imageSlot !== undefined ? product.imageSlots ?? 0 : 0
  const hasInstallments = product.priceInstallments !== undefined
  const price = payment === "card" && hasInstallments ? product.priceInstallments! : product.price
  const paymentLabel = !hasInstallments ? null : payment === "pix" ? "no Pix" : "parcelado"

  const message = [
    `Olá! Quero comprar: ${product.title}`,
    variant ? `${variantLabel}: ${variant.label}` : null,
    paymentLabel ? `Pagamento: ${paymentLabel} (${formatBRL(price)})` : `Valor: ${formatBRL(price)}`,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-sm border border-line bg-ink">
      <div className="relative aspect-[4/5] overflow-hidden">
        {image ? (
          <>
            <Image
              key={image}
              src={image}
              alt={variant ? `${product.title} — ${variant.label}` : product.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            {slots > 1 && (
              <div aria-hidden="true" className="absolute inset-0 flex">
                {Array.from({ length: slots }, (_, slot) => (
                  <div
                    key={slot}
                    className={`h-full flex-1 bg-ink/70 backdrop-blur-[2px] transition-opacity duration-500 ${
                      slot === variant?.imageSlot ? "opacity-0" : "opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="photo-placeholder flex h-full items-center justify-center">
            <Image src={brand.logo} alt="Chico's Gym" width={200} height={200} className="h-16 w-16 rounded-full opacity-90" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-offwhite/40">{product.category}</span>
          <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-offwhite">{product.title}</h3>
          {product.description && <p className="mt-1 text-sm text-offwhite/60">{product.description}</p>}
        </div>

        {product.variants && product.variants.length > 0 && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">
              {variantLabel}: <span className="text-offwhite">{variant?.label}</span>
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const active = v.id === variantId
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={active}
                    data-cursor-hover
                    className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                      active ? "border-orange text-offwhite" : "border-line text-offwhite/60 hover:border-orange/50"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-offwhite/30"
                      style={{ backgroundColor: v.swatch }}
                    />
                    {v.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {hasInstallments && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">Pagamento</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  { id: "pix", label: "Pix", value: product.price },
                  { id: "card", label: "Parcelado", value: product.priceInstallments! },
                ] as const
              ).map((option) => {
                const active = option.id === payment
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayment(option.id)}
                    aria-pressed={active}
                    data-cursor-hover
                    className={`flex flex-col items-start rounded-sm border px-3 py-2.5 text-left transition-colors ${
                      active ? "border-orange bg-orange/10" : "border-line hover:border-orange/50"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/60">
                      {option.label}
                    </span>
                    <span className={`text-sm font-semibold ${active ? "text-orange" : "text-offwhite/80"}`}>
                      {formatBRL(option.value)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-offwhite">{formatBRL(price)}</span>
            {paymentLabel && <span className="text-xs text-offwhite/50">{paymentLabel}</span>}
          </div>
          <Magnetic className="w-full">
            <a
              href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
            >
              <MessageCircle size={14} />
              Comprar pelo WhatsApp
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  )
}

export function Shop() {
  return (
    <section id="loja" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Loja"
          title="Leve o treino pra fora da academia"
          description="Escolha a cor e a forma de pagamento — o pedido já chega pronto no nosso WhatsApp."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 70} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
