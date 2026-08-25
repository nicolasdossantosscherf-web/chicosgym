import Image from "next/image"
import Link from "next/link"
import * as Icons from "lucide-react"
import { brand, sitePages } from "@/lib/data"

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src={brand.logo} alt="Chico's Gym" width={36} height={36} className="h-9 w-9 rounded-full" />
              <span className="font-display text-2xl uppercase tracking-widest text-offwhite">
                Chico&apos;s <span className="text-orange">Gym</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-offwhite/50">{brand.tagline}</p>
            <p className="mt-1 max-w-xs text-xs italic text-offwhite/35">&ldquo;{brand.motto}&rdquo;</p>
            <div className="mt-5 flex gap-3">
              {brand.socials.map((social) => {
                const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[social.icon] ?? Icons.Globe
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    data-cursor-hover
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-offwhite/60 transition-colors hover:border-orange hover:text-orange"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/40">Navegação</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-offwhite/60">
              {sitePages.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-orange">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/40">Academia</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-offwhite/60">
              {sitePages.slice(5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-orange">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/40">Contato</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-offwhite/60">
              <li>{brand.address}</li>
              <li>{brand.email}</li>
              <li>{brand.whatsappDisplay}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-offwhite/40 md:flex-row">
          <span>© {new Date().getFullYear()} Chico&apos;s Gym. Todos os direitos reservados.</span>
          <span>
            Desenvolvido por <span className="text-offwhite/60">Nicolas Code</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
