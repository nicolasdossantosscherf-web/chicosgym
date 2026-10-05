"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { FormMessage } from "./auth-ui"

const CONFIRM_WORD = "EXCLUIR"

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const signOut = async () => {
    setPending(true)
    await createClient().auth.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      data-cursor-hover
      className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:border-orange hover:text-orange disabled:opacity-60"
    >
      <LogOut size={14} />
      Sair
    </button>
  )
}

// LGPD: o aluno apaga a conta e todos os dados dele, sem precisar pedir pra ninguém.
export function DeleteAccount() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async () => {
    setPending(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.rpc("delete_my_account")
    if (error) {
      setError("Não foi possível excluir a conta agora. Tente de novo ou fale com a academia.")
      setPending(false)
      return
    }
    await supabase.auth.signOut({ scope: "local" })
    router.replace("/entrar?aviso=conta-excluida")
    router.refresh()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor-hover
        className="inline-flex items-center gap-2 text-xs text-offwhite/40 transition-colors hover:text-red-400"
      >
        <Trash2 size={13} />
        Excluir minha conta
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-red-500/40 bg-red-500/5 p-4">
      <p className="text-sm text-offwhite/80">
        Isso apaga sua conta e todos os seus dados (treinos, cargas e anotações) para sempre. Para confirmar, digite{" "}
        <strong className="text-red-300">{CONFIRM_WORD}</strong>:
      </p>
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value.toUpperCase())}
        maxLength={CONFIRM_WORD.length}
        aria-label={`Digite ${CONFIRM_WORD} para confirmar`}
        className="rounded-sm border border-line bg-ink px-3 py-2.5 text-sm text-offwhite outline-none focus:border-red-400"
      />
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={remove}
          disabled={typed !== CONFIRM_WORD || pending}
          className="rounded-sm bg-red-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Excluir para sempre
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setTyped("")
          }}
          className="px-3 text-xs uppercase tracking-[0.15em] text-offwhite/60 hover:text-offwhite"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
