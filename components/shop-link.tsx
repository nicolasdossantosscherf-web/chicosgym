"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store } from "lucide-react"

export function ShopLink() {
  const active = usePathname().startsWith("/loja")

  return (
    <Link
      href="/loja"
      aria-label="Loja"
      data-cursor-hover
      className={`flex items-center gap-2 transition-colors hover:text-orange ${active ? "text-orange" : "text-offwhite"}`}
    >
      <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] sm:inline">Loja</span>
      <Store size={22} />
    </Link>
  )
}
