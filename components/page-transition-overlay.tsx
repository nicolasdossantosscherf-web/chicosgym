"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { lenisStore } from "@/lib/lenis-store"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Phase = "idle" | "covering" | "revealing"

const COVER_MS = 420
const REVEAL_MS = 720

function resetScroll() {
  lenisStore.instance?.scrollTo(0, { immediate: true })
  window.scrollTo(0, 0)
}

// Campo de losangos com posições/tamanhos/atrasos fixos (não aleatórios em
// tempo de render — geometria estática, só para não violar a regra de
// pureza dos hooks). O atraso segue a distância até o canto superior
// direito, reforçando a direção diagonal do wipe.
const DIAMONDS = [
  { top: "10%", left: "82%", size: 34, delay: 0 },
  { top: "6%", left: "58%", size: 22, delay: 30 },
  { top: "22%", left: "92%", size: 18, delay: 30 },
  { top: "30%", left: "68%", size: 44, delay: 70 },
  { top: "18%", left: "38%", size: 20, delay: 90 },
  { top: "46%", left: "86%", size: 26, delay: 110 },
  { top: "40%", left: "18%", size: 30, delay: 140 },
  { top: "62%", left: "60%", size: 20, delay: 160 },
  { top: "58%", left: "8%", size: 24, delay: 190 },
  { top: "78%", left: "40%", size: 36, delay: 210 },
  { top: "72%", left: "78%", size: 16, delay: 200 },
  { top: "88%", left: "16%", size: 22, delay: 250 },
]

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
    // usePathname() é uma assinatura de contexto do router, não uma prop;
    // ajustar o estado durante o render causa "state update on unmounted
    // component" com o App Router — o efeito é a forma correta aqui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const active = phase !== "idle"

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      {/* Painel base — cobertura total garantida, entra pelo canto superior direito */}
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={false}
        animate={{ clipPath: covered ? "circle(150% at 100% 0%)" : "circle(0% at 0% 100%)" }}
        transition={{
          duration: (covered ? COVER_MS : REVEAL_MS) / 1000,
          ease: covered ? [0.6, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
        }}
      />

      {/* Feixe de luz diagonal, varrendo a tela durante a cobertura */}
      <motion.div
        className="absolute inset-[-20%]"
        style={{
          background: "linear-gradient(115deg, transparent 40%, rgba(245,166,35,0.22) 50%, transparent 60%)",
        }}
        initial={false}
        animate={{ opacity: active ? [0, 1, 0] : 0, x: active ? ["-30%", "30%"] : "0%" }}
        transition={{ duration: (COVER_MS + REVEAL_MS) / 1000, ease: "easeInOut" }}
      />

      {/* Campo de losangos girando em 3D, espalhados pela tela */}
      {DIAMONDS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute bg-orange"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            transformStyle: "preserve-3d",
            boxShadow: "0 0 24px 2px rgba(242,101,34,0.55)",
          }}
          initial={false}
          animate={{
            scale: active ? [0, 1.15, 1] : 0,
            rotate: 45,
            rotateY: covered ? [0, 320] : active ? [320, 520] : 0,
            opacity: active ? 1 : 0,
          }}
          transition={{
            duration: (covered ? COVER_MS : REVEAL_MS) / 1000,
            delay: (covered ? d.delay : d.delay * 0.4) / 1000,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
