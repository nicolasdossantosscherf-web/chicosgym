import { plans } from "./data"

// Datas da Área do Aluno sempre no fuso da academia (Três de Maio, RS) e no
// formato "AAAA-MM-DD", o mesmo do banco — assim "hoje" é igual no servidor
// e no celular do aluno.
export const GYM_TIME_ZONE = "America/Sao_Paulo"

export function todayISO(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: GYM_TIME_ZONE }).format(date)
}

// Meio-dia UTC evita que a conta de dias "pule" por causa de fuso/horário de verão.
function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12))
}

function toISO(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number) {
  const d = toDate(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return toISO(d)
}

export function addMonths(iso: string, months: number) {
  const d = toDate(iso)
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 12)).getUTCDate()
  d.setUTCDate(Math.min(day, lastDay))
  return toISO(d)
}

export function daysBetween(from: string, to: string) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86_400_000)
}

// Segunda-feira da semana da data.
export function weekStart(iso: string) {
  const d = toDate(iso)
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return toISO(d)
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" }) {
  return toDate(iso).toLocaleDateString("pt-BR", { ...options, timeZone: "UTC" })
}

export function formatKg(value: number) {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg`
}

export const PLAN_OPTIONS = plans.map((p) => ({ id: p.id, label: p.label, months: p.months }))

export function planLabel(id: string) {
  return plans.find((p) => p.id === id)?.label ?? id
}

export function planMonths(id: string) {
  return plans.find((p) => p.id === id)?.months ?? 1
}

// Quantos dias antes do vencimento o aluno começa a ver o aviso de renovação.
export const RENEWAL_WARNING_DAYS = 7

export type MembershipState = "active" | "expiring" | "expired"

export function membershipStatus(expiresOn: string, today = todayISO()): { state: MembershipState; daysLeft: number } {
  const daysLeft = daysBetween(today, expiresOn)
  if (daysLeft < 0) return { state: "expired", daysLeft }
  if (daysLeft <= RENEWAL_WARNING_DAYS) return { state: "expiring", daysLeft }
  return { state: "active", daysLeft }
}

export function daysLabel(days: number) {
  return days === 1 ? "1 dia" : `${days} dias`
}
