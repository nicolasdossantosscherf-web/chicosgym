"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Magnetic } from "./magnetic"
import { brand, sitePages } from "@/lib/data"

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

  // usePathname() é uma assinatura de contexto do router, não uma prop;
  // ajustar o estado durante o render causa "state update on unmounted
  // component" com o App Router — o efeito é a forma correta aqui.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" data-cursor-hover>
          <Image src={brand.logo} alt="Chico's Gym" width={40} height={40} className="h-10 w-10 rounded-full" />
          <span className="font-display text-2xl uppercase tracking-widest text-offwhite">
            Chico&apos;s <span className="text-orange">Gym</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {sitePages.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor-hover
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-orange ${
                pathname === link.href ? "text-orange" : "text-offwhite/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
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

        <button aria-label="Abrir menu" onClick={() => setOpen((v) => !v)} className="text-offwhite lg:hidden">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {sitePages.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-[0.2em] ${
                  pathname === link.href ? "text-orange" : "text-offwhite/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-fit items-center rounded-sm bg-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              Matricule-se
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
