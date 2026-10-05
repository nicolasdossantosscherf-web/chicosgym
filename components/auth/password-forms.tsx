"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/auth-errors"
import { AuthField, FormMessage, SubmitButton } from "./auth-ui"

const MIN_PASSWORD = 8

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("Informe um e-mail válido.")
      return
    }
    setPending(true)
    const { error } = await createClient().auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/redefinir-senha`,
    })
    setPending(false)
    if (error) {
      setError(authErrorMessage(error))
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <FormMessage tone="success">
        Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Confira também a caixa de spam.
      </FormMessage>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <AuthField
        label="E-mail da sua conta"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        maxLength={120}
        value={email}
        onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
        placeholder="seuemail@exemplo.com"
      />
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <SubmitButton pending={pending}>Enviar link</SubmitButton>
    </form>
  )
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < MIN_PASSWORD) return setError(`A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`)
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return setError("Use letras e números na senha.")
    if (confirm !== password) return setError("As senhas não são iguais.")

    setPending(true)
    const { error } = await createClient().auth.updateUser({ password })
    setPending(false)
    if (error) {
      setError(authErrorMessage(error))
      return
    }
    router.replace("/aluno?senha=nova")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <AuthField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        required
        maxLength={72}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={`Mínimo de ${MIN_PASSWORD} caracteres`}
        hint="Use letras e números."
      />
      <AuthField
        label="Confirme a nova senha"
        type="password"
        autoComplete="new-password"
        required
        maxLength={72}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Digite a senha de novo"
      />
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <SubmitButton pending={pending}>Salvar nova senha</SubmitButton>
    </form>
  )
}
