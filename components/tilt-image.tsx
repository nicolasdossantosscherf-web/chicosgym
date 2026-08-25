"use client"

import { CSSProperties, useRef, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Props = {
  src?: string
  alt: string
  label?: string
  className?: string
  sizes?: string
  priority?: boolean
  desaturate?: boolean
}

export function TiltImage({
  src,
  alt,
  label,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  desaturate = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [style, setStyle] = useState<CSSProperties>({})

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - py) * 14
    const rotateY = (px - 0.5) * 14
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
      "--glare-x": `${px * 100}%`,
      "--glare-y": `${py * 100}%`,
    } as CSSProperties)
  }

  const handleLeave = () =>
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)" })

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative overflow-hidden rounded-sm transition-transform duration-300 ease-out [transform-style:preserve-3d] ${className}`}
      style={style}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${desaturate ? "photo-grade-mono" : "photo-grade"}`}
        />
      ) : (
        <div className="photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 p-5">
          <Image
            src="/images/brand/logo.jpg"
            alt="Chico's Gym"
            width={200}
            height={200}
            className="h-16 w-16 rounded-full opacity-90 sm:h-20 sm:w-20"
          />
          {label && (
            <span className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.2em] text-offwhite/50">
              {label}
            </span>
          )}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.12), transparent 45%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  )
}
