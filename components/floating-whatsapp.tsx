"use client"

import { MessageCircle } from "lucide-react"
import { brand } from "@/lib/data"
import { Magnetic } from "./magnetic"

export function FloatingWhatsapp() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Magnetic strength={0.25}>
        <a
          href={`https://wa.me/${brand.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          aria-label="Falar no WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-ink shadow-[0_8px_30px_rgba(242,101,34,0.45)] transition-colors hover:bg-gold"
        >
          <MessageCircle size={24} />
        </a>
      </Magnetic>
    </div>
  )
}
