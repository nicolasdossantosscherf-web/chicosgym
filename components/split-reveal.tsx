"use client"

import { CSSProperties, ElementType, ReactNode, createElement, useEffect, useRef, useState } from "react"

type Props = {
  text: string
  className?: string
  as?: ElementType
  mode?: "char" | "word"
  delay?: number
}

export function SplitReveal({ text, className = "", as: Tag = "h2", mode = "word", delay = 0 }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const revealSpan = (content: ReactNode, index: number, stepMs: number) => {
    const style: CSSProperties = {
      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: `${delay + index * stepMs}ms`,
      transform: visible ? "translateY(0%)" : "translateY(110%)",
    }
    return (
      <span className="inline-block transition-transform duration-700 will-change-transform" style={style}>
        {content}
      </span>
    )
  }

  const words = text.split(" ")
  let globalCharIndex = 0

  const nodes = words.flatMap((word, wi) => {
    const wordEl =
      mode === "char" ? (
        <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, ci) => {
            const idx = globalCharIndex++
            return (
              <span key={ci} aria-hidden="true" className="inline-block overflow-hidden align-top">
                {revealSpan(char, idx, 18)}
              </span>
            )
          })}
        </span>
      ) : (
        <span key={`w-${wi}`} aria-hidden="true" className="inline-block overflow-hidden align-top">
          {revealSpan(word, wi, 60)}
        </span>
      )
    return wi < words.length - 1 ? [wordEl, " "] : [wordEl]
  })

  return (
    <div ref={wrapperRef}>
      {createElement(Tag, { className, "aria-label": text }, nodes)}
    </div>
  )
}
