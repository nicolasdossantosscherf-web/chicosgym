"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MailCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/auth-errors"
import { emailDomainError, emailDomainExists, sanitize, validateEmailFormat, validateName } from "@/lib/validation"
import { AuthField, FormMessage, SubmitButton } from "./auth-ui"

const MIN_PASSWORD = 8

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>

function validate(name: string, email: string, password: string, confirm: string, terms: boolean): FieldErrors {
  const errors: FieldErrors = {}
  const nameError = validateName(name)
  if (nameError) errors.name = nameError
  const emailError = validateEmailFormat(email)
  if (emailError) errors.email = emailError
  if (password.length < MIN_PASSWORD) errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`
  else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) errors.password = "Use letras e números na senha."
  if (confirm !== password) errors.confirm = "As senhas não são iguais."
  if (!terms) errors.terms = "Você precisa aceitar a Política de Privacidade."
  return errors
}

export function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const cleanEmail = email.trim().toLowerCase()
    const found = validate(name, cleanEmail, password, confirm, terms)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPending(true)
    // Confere se o domínio do e-mail existe de verdade antes de criar a conta.
    if ((await emailDomainExists(cleanEmail)) === false) {
      setErrors({ email: emailDomainError(cleanEmail) })
      setPending(false)
      return
    }
    const { data, error } = await createClient().auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name.trim().replace(/\s+/g, " ") },
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/aluno`,
      },
    })
    setPending(false)
    if (error) {
      setError(authErrorMessage(error))
      return
    }
    // Com confirmação de e-mail ligada, a sessão só nasce depois do clique no link.
    if (data.session) {
      router.replace("/aluno")
      router.refresh()
    } else {
      setSentTo(cleanEmail)
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
          <MailCheck size={28} />
        </div>
        <p className="font-display text-2xl uppercase tracking-wide text-offwhite">Confirme seu e-mail</p>
        <p className="text-sm leading-relaxed text-offwhite/70">
          Enviamos um link de confirmação para <strong className="text-offwhite">{sentTo}</strong>. Abra o e-mail e
          toque no link para ativar sua conta. Não chegou? Confira a caixa de spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <AuthField
        label="Nome completo"
        autoComplete="name"
        required
        maxLength={80}
        value={name}
        onChange={(e) => setName(sanitize.name(e.target.value))}
        placeholder="Seu nome e sobrenome"
        error={errors.name}
      />
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
        error={errors.email}
        hint="Use um e-mail que você acessa: vamos mandar um link de confirmação."
      />
      <AuthField
        label="Senha"
        type="password"
        autoComplete="new-password"
        required
        maxLength={72}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={`Mínimo de ${MIN_PASSWORD} caracteres`}
        error={errors.password}
        hint="Use letras e números."
      />
      <AuthField
        label="Confirme a senha"
        type="password"
        autoComplete="new-password"
        required
        maxLength={72}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Digite a senha de novo"
        error={errors.confirm}
      />
      <label className="flex items-start gap-3 text-sm text-offwhite/70">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-orange"
        />
        <span>
          Li e aceito a{" "}
          <Link href="/privacidade" target="_blank" className="text-orange underline-offset-2 hover:underline">
            Política de Privacidade
          </Link>
          .
          {errors.terms && <span className="mt-1 block text-[11px] text-red-400">{errors.terms}</span>}
        </span>
      </label>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <SubmitButton pending={pending}>Criar minha conta</SubmitButton>
    </form>
  )
}
