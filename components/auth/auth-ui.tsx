"use client"

import type { InputHTMLAttributes, ReactNode } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="relative bg-ink py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="flex items-center gap-3">
          <span className="diamond" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">{eyebrow}</span>
        </div>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-wide text-offwhite">{title}</h1>
        {description && <p className="mt-3 text-sm leading-relaxed text-offwhite/60">{description}</p>}
        <div className="mt-8 rounded-sm border border-line bg-carbon p-6 md:p-8">{children}</div>
        {footer && <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm">{footer}</div>}
      </div>
    </section>
  )
}

export function AuthField({
  label,
  error,
  hint,
  ...props
}: { label: string; error?: string | null; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-offwhite/50">{label}</span>
      <input
        {...props}
        className={`rounded-sm border bg-ink px-3 py-3 text-sm text-offwhite outline-none transition-colors placeholder:text-offwhite/25 focus:border-orange ${
          error ? "border-red-500/70" : "border-line"
        }`}
      />
      {error ? (
        <span className="text-[11px] text-red-400">{error}</span>
      ) : (
        hint && <span className="text-[11px] text-offwhite/40">{hint}</span>
      )}
    </label>
  )
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor-hover
      className="flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold disabled:cursor-wait disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-sm border p-3 text-sm ${
        tone === "error" ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
