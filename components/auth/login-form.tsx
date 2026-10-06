"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/auth-errors"
import { sanitize } from "@/lib/validation"
import { AuthField, FormMessage, SubmitButton } from "./auth-ui"

export function LoginForm({ next, notice }: { next: string; notice?: string | null }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(authErrorMessage(error))
      setPending(false)
      return
    }
    router.replace(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {notice && <FormMessage tone="success">{notice}</FormMessage>}
      <AuthField
        label="E-mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        maxLength={120}
        value={email}
        onChange={(e) => setEmail(sanitize.email(e.target.value))}
        placeholder="seuemail@exemplo.com"
      />
      <div className="flex flex-col gap-2">
        <AuthField
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
        />
        <Link
          href="/esqueci-senha"
          data-cursor-hover
          className="self-end text-xs text-offwhite/60 transition-colors hover:text-orange"
        >
          Esqueci minha senha
        </Link>
      </div>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <SubmitButton pending={pending}>Entrar</SubmitButton>
    </form>
  )
}
