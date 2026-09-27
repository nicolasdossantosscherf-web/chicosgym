import { useSyncExternalStore } from "react"
import { products, type Product, type ProductVariant } from "./data"

export type CartItem = { productId: string; variantId?: string; qty: number }

type CartState = { items: CartItem[]; open: boolean }

const STORAGE_KEY = "chicos-gym-cart"
const SERVER_STATE: CartState = { items: [], open: false }

let state: CartState = SERVER_STATE
let hydrated = false
const listeners = new Set<() => void>()

export function findProduct(productId: string) {
  return products.find((p) => p.id === productId)
}

export function resolveCartItem(item: CartItem): { product: Product; variant?: ProductVariant } | null {
  const product = findProduct(item.productId)
  if (!product) return null
  if (!item.variantId) return product.variants?.length ? null : { product }
  const variant = product.variants?.find((v) => v.id === item.variantId)
  return variant ? { product, variant } : null
}

// O localStorage é entrada externa: descarta itens de produtos/variações que
// saíram do catálogo ou quantidades inválidas.
function readStorage(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartItem =>
        typeof i?.productId === "string" &&
        Number.isInteger(i.qty) &&
        i.qty > 0 &&
        resolveCartItem(i) !== null
    )
  } catch {
    return []
  }
}

function getSnapshot() {
  if (!hydrated) {
    hydrated = true
    state = { items: readStorage(), open: false }
  }
  return state
}

function getServerSnapshot() {
  return SERVER_STATE
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function update(next: Partial<CartState>) {
  const prevItems = state.items
  state = { ...getSnapshot(), ...next }
  if (state.items !== prevItems) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // Sem storage (aba anônima bloqueada etc.): o carrinho só não persiste.
    }
  }
  listeners.forEach((listener) => listener())
}

const sameLine = (item: CartItem, productId: string, variantId?: string) =>
  item.productId === productId && item.variantId === variantId

export const cartActions = {
  add(productId: string, variantId?: string) {
    const items = getSnapshot().items
    const existing = items.find((i) => sameLine(i, productId, variantId))
    update({
      items: existing
        ? items.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { productId, variantId, qty: 1 }],
    })
  },
  setQty(productId: string, variantId: string | undefined, qty: number) {
    const items = getSnapshot().items
    update({
      items:
        qty > 0
          ? items.map((i) => (sameLine(i, productId, variantId) ? { ...i, qty } : i))
          : items.filter((i) => !sameLine(i, productId, variantId)),
    })
  },
  clear() {
    update({ items: [] })
  },
  open() {
    update({ open: true })
  },
  close() {
    if (getSnapshot().open) update({ open: false })
  },
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function unitPrice(product: Product, installments: boolean) {
  return installments && product.priceInstallments !== undefined ? product.priceInstallments : product.price
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
