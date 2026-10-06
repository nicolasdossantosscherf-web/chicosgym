"use client"

import { ReactNode, useRef, type MouseEvent } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Botão que "puxa" levemente na direção do mouse. Feito só com CSS
// (transform + transition), sem biblioteca de animação.
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  const move = (x: number, y: number) => {
    if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    move((e.clientX - (rect.left + rect.width / 2)) * strength, (e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => move(0, 0)}
      data-cursor-hover
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  )
}
