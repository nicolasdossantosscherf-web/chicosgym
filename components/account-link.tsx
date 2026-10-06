"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRound } from "lucide-react"
import { hasSessionCookie } from "@/lib/session-cookie"

// Botão do topo. Só olha se existe o cookie de sessão (sem carregar o Supabase
// em todas as páginas); quem garante o acesso de verdade é a própria /aluno.
export function AccountLink() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    // Releitura a cada troca de página: login e logout sempre navegam.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(hasSessionCookie())
  }, [pathname])

  const active = ["/aluno", "/entrar", "/cadastro"].some((p) => pathname.startsWith(p))

  return (
    <Link
      href={loggedIn ? "/aluno" : "/entrar"}
      aria-label={loggedIn ? "Minha área do aluno" : "Entrar na área do aluno"}
      data-cursor-hover
      className={`flex items-center gap-2 transition-colors hover:text-orange ${active ? "text-orange" : "text-offwhite"}`}
    >
      <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] lg:inline">
        {loggedIn ? "Minha área" : "Entrar"}
      </span>
      <UserRound size={22} />
    </Link>
  )
}
