"use client"

import { useState } from "react"
import Link from "next/link"
import { products, type Product } from "@/lib/data"
import { formatBRL } from "@/lib/cart"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { ProductImage } from "./product-image"

const ALL = "Todos"
const categories = [ALL, ...new Set(products.map((p) => p.category))]

function pluralize(word: string) {
  const lower = word.toLowerCase()
  if (lower.endsWith("ção")) return lower.slice(0, -3) + "ções"
  if (lower.endsWith("r")) return lower + "es"
  return lower + "s"
}

function ProductCard({ product }: { product: Product }) {
  const variantCount = product.variants?.length ?? 0

  return (
    <Link
      href={`/loja/${product.id}`}
      data-cursor-hover
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-ink transition-colors hover:border-orange/60"
    >
      <ProductImage
        product={product}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="aspect-[4/5]"
        imageClassName="transition-transform duration-700 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-offwhite/40">{product.category}</span>
        <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-offwhite md:text-xl">
          {product.title}
        </h3>
        {variantCount > 1 && (
          <span className="text-xs text-offwhite/50">
            {variantCount} {pluralize(product.variantLabel ?? "opção")}
          </span>
        )}
        <div className="mt-auto pt-3">
          <span className="text-base font-semibold text-orange">{formatBRL(product.price)}</span>
          {product.priceInstallments !== undefined && (
            <>
              <span className="ml-1 text-[11px] text-offwhite/50">à vista</span>
              <span className="block text-[11px] text-offwhite/50">
                ou {formatBRL(product.priceInstallments)} parcelado
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export function Shop() {
  const [category, setCategory] = useState(ALL)
  const visible = category === ALL ? products : products.filter((p) => p.category === category)

  return (
    <section id="loja" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Loja"
          title="Leve o treino pra fora da academia"
          description="Toque no produto pra escolher cor ou sabor, monte seu carrinho e finalize o pedido pelo WhatsApp."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                data-cursor-hover
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  active ? "border-orange bg-orange text-ink" : "border-line text-offwhite/70 hover:border-orange/50"
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {visible.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
