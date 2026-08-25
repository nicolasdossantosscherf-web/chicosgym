"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Magnetic } from "./magnetic"
import { brand, sitePages } from "@/lib/data"

const HOME_LINK = { href: "/", label: "Início" }

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // usePathname() é uma assinatura de contexto do router, não uma prop;
    // ajustar o estado durante o render causa "state update on unmounted
    // component" com o App Router — o efeito é a forma correta aqui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  const links = [HOME_LINK, ...sitePages]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" data-cursor-hover>
          <Image src={brand.logo} alt="Chico's Gym" width={40} height={40} className="h-10 w-10 rounded-full" />
          <span className="font-display text-2xl uppercase tracking-widest text-offwhite">
            Chico&apos;s <span className="text-orange">Gym</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Magnetic>
              <a
                href={`https://wa.me/${brand.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex items-center rounded-sm bg-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
              >
                Matricule-se
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            data-cursor-hover
            className="flex items-center gap-2 text-offwhite"
          >
            <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] sm:inline">Menu</span>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-line bg-ink px-6 py-2 md:px-10">
          <nav className="mx-auto flex max-w-7xl flex-col divide-y divide-line">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor-hover
                className={`py-4 font-display text-xl uppercase tracking-wide transition-colors ${
                  pathname === link.href ? "text-orange" : "text-offwhite/85 hover:text-orange"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
