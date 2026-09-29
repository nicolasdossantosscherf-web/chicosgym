"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { lenisStore } from "@/lib/lenis-store"

function resetScroll() {
  lenisStore.instance?.scrollTo(0, { immediate: true })
  window.scrollTo(0, 0)
}

// Troca de página em forma de cubo girando, usando a View Transitions API do
// navegador: ele tira uma "foto" da página atual e da nova, e o CSS em
// globals.css (::view-transition-*) gira as duas como faces de um cubo.
// Navegadores sem suporte (ou com "reduzir movimento") trocam de página normalmente.
export function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const finishNavigation = useRef<(() => void) | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (!("startViewTransition" in document)) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      const link = (e.target as Element | null)?.closest?.("a")
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return

      const url = new URL(link.href, window.location.href)
      // Links externos e âncoras na mesma página seguem o comportamento normal.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return

      // Impede o <Link> do Next de navegar sozinho; a navegação acontece
      // dentro da transição, depois que a foto da página atual foi tirada.
      e.preventDefault()
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            finishNavigation.current = resolve
            router.push(url.pathname + url.search + url.hash)
            // Segurança: se a página demorar, a transição não fica travada.
            setTimeout(resolve, 1500)
          })
      )
      // Um segundo clique no meio da animação cancela a anterior — sem erro no console.
      transition.ready.catch(() => {})
    }

    window.addEventListener("click", onClick, true)
    return () => window.removeEventListener("click", onClick, true)
  }, [router])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    resetScroll()
    const finish = finishNavigation.current
    finishNavigation.current = null
    // Espera o Next terminar de montar a página nova antes da "foto" final.
    if (finish) setTimeout(finish, 0)
  }, [pathname])

  return null
}
