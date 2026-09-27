"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, MessageCircle, ShoppingBag, Store } from "lucide-react"
import type { Product } from "@/lib/data"
import { cartActions, formatBRL } from "@/lib/cart"
import { ProductImage } from "./product-image"

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id)
  const [added, setAdded] = useState(false)

  const variant = product.variants?.find((v) => v.id === variantId)
  const variantLabel = product.variantLabel ?? "Opção"
  const hasInstallments = product.priceInstallments !== undefined

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(timer)
  }, [added])

  const addToCart = () => {
    cartActions.add(product.id, variant?.id)
    setAdded(true)
  }

  return (
    <section className="relative bg-ink pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Link
          href="/loja"
          data-cursor-hover
          className="inline-flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-orange"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <ProductImage
            product={product}
            variant={variant}
            highlight
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] rounded-sm border border-line"
          />

          <div className="flex flex-col gap-7">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-offwhite/40">{product.category}</span>
              <h1 className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-wide text-offwhite md:text-5xl">
                {product.title}
              </h1>
              {product.description && <p className="mt-3 text-sm leading-relaxed text-offwhite/60">{product.description}</p>}
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-offwhite">{formatBRL(product.price)}</span>
                {hasInstallments && <span className="text-sm text-offwhite/50">à vista</span>}
              </div>
              {hasInstallments && (
                <p className="mt-1 text-sm text-offwhite/60">
                  ou {formatBRL(product.priceInstallments!)} no cartão de crédito parcelado
                </p>
              )}
              <p className="mt-2 text-xs text-offwhite/40">A forma de pagamento você escolhe no carrinho.</p>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">
                  {variantLabel}: <span className="text-offwhite">{variant?.label}</span>
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = v.id === variantId
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantId(v.id)}
                        aria-pressed={active}
                        data-cursor-hover
                        className={`flex items-center gap-2 rounded-sm border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
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

            <div className="flex flex-col gap-3 lg:flex-row">
              <button
                type="button"
                onClick={addToCart}
                data-cursor-hover
                className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors ${
                  added ? "bg-gold" : "bg-orange hover:bg-gold"
                }`}
              >
                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
              </button>
              <button
                type="button"
                onClick={cartActions.open}
                data-cursor-hover
                className="flex items-center justify-center rounded-sm border border-line px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange"
              >
                Ver carrinho
              </button>
            </div>

            <ul className="grid grid-cols-1 gap-3 border-t border-line pt-6 text-sm text-offwhite/60 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <Store size={16} className="mt-0.5 shrink-0 text-orange" />
                Retirada na academia
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-orange" />
                Pedido finalizado pelo WhatsApp
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
