"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { lenisStore } from "@/lib/lenis-store"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Phase = "idle" | "covering" | "revealing"

const COVER_MS = 260
const REVEAL_MS = 560

function resetScroll() {
  lenisStore.instance?.scrollTo(0, { immediate: true })
  window.scrollTo(0, 0)
}

// A troca de rota do Next é instantânea por baixo — este overlay cobre a
// tela por uma fração de segundo (com o losango girando em 3D) e revela a
// página nova já pronta, criando a sensação de transição cinematográfica
// entre páginas descrita no projeto.
//
// Nota: tentamos primeiro ajustar o estado durante o render a partir de
// usePathname() (padrão sugerido pelo React para "resetar estado quando uma
// prop muda"), mas usePathname() é uma assinatura de contexto do router, não
// uma prop — isso causava "state update on a component that hasn't mounted
// yet" e um erro de hidratação logo depois de qualquer navegação. useEffect
// é a forma correta para reagir a uma mudança de rota.
export function PageTransitionOverlay() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>("idle")
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    resetScroll()

    if (reduced) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ver nota acima
    setPhase("covering")
  }, [pathname, reduced])

  useEffect(() => {
    if (phase === "covering") {
      const t = setTimeout(() => setPhase("revealing"), COVER_MS)
      return () => clearTimeout(t)
    }
    if (phase === "revealing") {
      const t = setTimeout(() => setPhase("idle"), REVEAL_MS)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (reduced) return null

  const covered = phase === "covering"

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ perspective: 1200 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={false}
        animate={{ clipPath: covered ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)" }}
        transition={{
          duration: covered ? COVER_MS / 1000 : REVEAL_MS / 1000,
          ease: covered ? [0.6, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
        }}
      />
      <motion.div
        className="diamond-lg relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          opacity: phase === "idle" ? 0 : 1,
          rotateY: phase === "idle" ? 0 : covered ? [0, 200] : [200, 360],
          scale: phase === "idle" ? 0.4 : 1,
        }}
        transition={{ duration: (covered ? COVER_MS : REVEAL_MS) / 1000, ease: "easeInOut" }}
      />
    </div>
  )
}
