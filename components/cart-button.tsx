"use client"

import { ShoppingBag } from "lucide-react"
import { cartActions, useCart } from "@/lib/cart"

export function CartButton() {
  const { items } = useCart()
  const count = items.reduce((n, i) => n + i.qty, 0)

  return (
    <button
      type="button"
      onClick={cartActions.open}
      aria-label={count > 0 ? `Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})` : "Abrir carrinho"}
      data-cursor-hover
      className="relative flex text-offwhite transition-colors hover:text-orange"
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-ink">
          {count}
        </span>
      )}
    </button>
  )
}
