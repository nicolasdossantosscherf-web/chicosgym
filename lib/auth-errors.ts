// Mensagens do Supabase Auth traduzidas para o aluno.
const MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar — o link foi enviado quando você criou a conta.",
  user_already_exists: "Já existe uma conta com esse e-mail. Tente entrar ou recuperar a senha.",
  email_exists: "Já existe uma conta com esse e-mail. Tente entrar ou recuperar a senha.",
  weak_password: "Essa senha é fraca. Use pelo menos 8 caracteres, misturando letras e números.",
  same_password: "A nova senha precisa ser diferente da atual.",
  over_email_send_rate_limit: "Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente de novo.",
  over_request_rate_limit: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.",
  email_address_not_authorized: "Não conseguimos enviar o e-mail de confirmação agora. Tente mais tarde ou fale com a academia.",
  email_address_invalid: "Esse e-mail não parece válido. Confira e tente de novo.",
  signup_disabled: "Novos cadastros estão pausados no momento. Fale com a academia.",
  session_expired: "Sua sessão expirou. Entre de novo.",
}

export function authErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return null
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code]
  if (error.message?.toLowerCase().includes("fetch")) return "Sem conexão com o servidor. Confira sua internet."
  return "Algo deu errado. Tente de novo em instantes."
}

// Só aceita caminhos internos depois do login (evita redirecionar pra outro site).
export function safeNextPath(next: string | null | undefined, fallback = "/aluno") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  return next
}
