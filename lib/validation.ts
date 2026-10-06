// Validação dos dados digitados nos formulários do site (loja, contato e
// cadastro). Cada função devolve a frase de erro pra mostrar embaixo do
// campo, ou null quando está tudo certo.

export const LIMITS = { name: 60, phone: 11, email: 100, text: 120 } as const

// Caracteres de controle (invisíveis) nunca são aceitos em nenhum campo.
const CONTROL_CHARS = /\p{Cc}/gu

export const sanitize = {
  // Só letras (com acento), espaço, apóstrofo e hífen — ex.: D'Ávila, Ana-Maria.
  name: (v: string) =>
    v.replace(CONTROL_CHARS, "").replace(/[^\p{L} '-]|[ªº]/gu, "").replace(/ {2,}/g, " ").replace(/^ /, "").slice(0, LIMITS.name),
  phone: (v: string) => v.replace(/\D/g, "").slice(0, LIMITS.phone),
  email: (v: string) => v.replace(CONTROL_CHARS, "").replace(/\s/g, "").slice(0, LIMITS.email),
  text: (v: string) => v.replace(CONTROL_CHARS, "").replace(/ {2,}/g, " ").slice(0, LIMITS.text),
}

export function validateName(value: string) {
  const name = value.trim()
  if (!name) return "Informe seu nome completo."
  const parts = name.split(/\s+/)
  if (parts.length < 2) return "Informe nome e sobrenome."
  const letters = (part: string) => part.replace(/['-]/g, "")
  if (letters(parts[0]).length < 2 || letters(parts[parts.length - 1]).length < 2) {
    return "Esse nome não parece completo. Confira e tente novamente."
  }
  if (/(\p{L})\1{2,}/iu.test(name)) return "Esse nome não parece real. Confira e tente novamente."
  return null
}

// DDDs que existem no Brasil (Anatel).
const VALID_DDD = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
  49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
])

export function validatePhone(digits: string) {
  if (!digits) return "Informe seu WhatsApp com DDD."
  if (digits.length < 10) return "Número incompleto: digite o DDD e o número (10 ou 11 dígitos)."
  const ddd = digits.slice(0, 2)
  if (!VALID_DDD.has(Number(ddd))) return `O DDD ${ddd} não existe. Confira e tente novamente.`
  const number = digits.slice(2)
  if (/^(\d)\1+$/.test(number)) return "Esse número não existe. Confira e tente novamente."
  if (number.length === 9 && number[0] !== "9") {
    return "Esse celular não existe: depois do DDD, celular começa com 9. Confira e tente novamente."
  }
  if (number.length === 8 && !/^[2-5]/.test(number)) {
    return "Esse número não existe. Se for celular, falta o 9 depois do DDD."
  }
  return null
}

export const formatPhone = (digits: string) => digits.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3")

const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

// Erros de digitação comuns nos provedores mais usados.
const DOMAIN_TYPOS: Record<string, string> = {
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "outlook.con": "outlook.com",
  "outlok.com": "outlook.com",
  "otlook.com": "outlook.com",
  "yahoo.con": "yahoo.com",
  "yaho.com": "yahoo.com",
  "icloud.con": "icloud.com",
  "iclod.com": "icloud.com",
}

export function emailDomain(email: string) {
  return email.trim().toLowerCase().split("@")[1] ?? ""
}

export function validateEmailFormat(value: string) {
  const email = value.trim().toLowerCase()
  if (!email) return "Informe seu e-mail."
  if (!EMAIL_RE.test(email)) return "Esse e-mail não existe: confira se tem @ e o final certo (ex.: nome@gmail.com)."
  const fix = DOMAIN_TYPOS[emailDomain(email)]
  if (fix) return `Esse e-mail não existe. Você quis dizer ${email.split("@")[0]}@${fix}?`
  return null
}

// Confere se o domínio do e-mail existe e recebe mensagens (consulta DNS no
// servidor do site). Devolve null se não deu pra conferir — nesse caso o
// formulário segue, pra ninguém ficar travado por falha de internet.
export async function emailDomainExists(email: string): Promise<boolean | null> {
  const domain = emailDomain(email)
  if (!domain) return false
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`/api/email-domain?d=${encodeURIComponent(domain)}`, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = (await res.json()) as { exists: boolean | null }
    return data.exists
  } catch {
    return null
  }
}

export function emailDomainError(email: string) {
  return `O endereço @${emailDomain(email)} não existe ou não recebe e-mails. Confira e tente novamente.`
}
