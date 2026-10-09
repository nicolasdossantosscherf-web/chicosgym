"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

// Páginas que abrem sozinhas, sem o menu, o rodapé e o botão do WhatsApp do site
// (ex.: /qr, aberta pelo QR Code impresso na academia).
const BARE_PAGES = new Set(["/qr"])

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (BARE_PAGES.has(pathname)) return null
  return children
}
