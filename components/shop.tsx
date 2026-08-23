import { ShoppingBag } from "lucide-react"
import { products, brand } from "@/lib/data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

export function Shop() {
  return (
    <section id="loja" className="relative bg-carbon py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Loja"
          title="Leve o treino pra fora da academia"
          description="Catálogo inicial via WhatsApp — pronto para evoluir para um checkout online completo."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 70}>
              <a
                href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Quero saber mais sobre: ${product.title}`)}`}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-ink"
              >
                <div className="photo-placeholder relative flex aspect-square items-center justify-center">
                  <ShoppingBag size={32} className="text-offwhite/25 transition-colors group-hover:text-orange" />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-offwhite/40">{product.category}</span>
                  <h3 className="font-display text-lg uppercase tracking-wide text-offwhite">{product.title}</h3>
                  <span className="mt-auto pt-2 text-sm font-semibold text-orange">{product.price}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
