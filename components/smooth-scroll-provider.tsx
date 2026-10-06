"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { lenisStore } from "@/lib/lenis-store"

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    // autoRaf: o próprio Lenis cuida do loop de animação (antes isso era feito
    // pelo GSAP, uma biblioteca inteira carregada só pra essa tarefa).
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      anchors: true,
      stopInertiaOnNavigate: true,
      autoRaf: true,
    })
    lenisStore.instance = lenis

    return () => {
      lenis.destroy()
      lenisStore.instance = null
    }
  }, [reduced])

  return <>{children}</>
}
