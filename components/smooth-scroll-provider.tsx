"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { lenisStore } from "@/lib/lenis-store"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      anchors: true,
      stopInertiaOnNavigate: true,
    })
    lenisStore.instance = lenis

    lenis.on("scroll", ScrollTrigger.update)

    // gsap.ticker informa o tempo em SEGUNDOS; lenis.raf espera MILISSEGUNDOS.
    // Sem essa conversão o Lenis recebe um relógio ~1000x mais lento, o que
    // fazia o scroll suave "travar" e depois saltar de forma imprevisível.
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisStore.instance = null
    }
  }, [reduced])

  return <>{children}</>
}
