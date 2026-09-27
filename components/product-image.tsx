import Image from "next/image"
import { brand, type Product, type ProductVariant } from "@/lib/data"

export function ProductImage({
  product,
  variant,
  sizes,
  highlight = false,
  priority = false,
  className = "",
  imageClassName = "",
}: {
  product: Product
  variant?: ProductVariant
  sizes: string
  // Escurece as outras variações quando a foto mostra todas lado a lado.
  highlight?: boolean
  priority?: boolean
  className?: string
  imageClassName?: string
}) {
  const src = variant?.image ?? product.image ?? product.variants?.find((v) => v.image)?.image
  const slots = highlight && !variant?.image && variant?.imageSlot !== undefined ? (product.imageSlots ?? 0) : 0

  return (
    <div className={`relative overflow-hidden bg-carbon ${className}`}>
      {src ? (
        <>
          <Image
            key={src}
            src={src}
            alt={variant ? `${product.title} — ${variant.label}` : product.title}
            fill
            priority={priority}
            sizes={sizes}
            className={`object-cover ${imageClassName}`}
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
          <Image src={brand.logo} alt="Chico's Gym" width={200} height={200} className="h-1/4 w-auto rounded-full opacity-90" />
        </div>
      )}
    </div>
  )
}
