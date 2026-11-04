import { holidays, openingSchedule } from "@/lib/data"

// Hora de Três de Maio (horário de Brasília), não a do aparelho de quem abre o site.
const TIME_ZONE = "America/Sao_Paulo"

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
})

export type GymTime = { year: number; month: number; day: number; hour: number; minute: number; second: number }

export type GymStatus =
  | { open: true; until: number }
  | { open: false; opensAt: number; daysAhead: number; weekday: number }

export function gymTime(date: Date): GymTime {
  const parts = Object.fromEntries(partsFormatter.formatToParts(date).map((p) => [p.type, Number(p.value)]))
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  }
}

// Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher); a Sexta-feira Santa é 2 dias antes.
function easterSunday(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return Date.UTC(year, month - 1, day)
}

function isHoliday(date: Date) {
  const key = `${String(date.getUTCDate()).padStart(2, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
  const goodFriday = easterSunday(date.getUTCFullYear()) - 2 * 86_400_000
  return holidays.includes(key) || date.getTime() === goodFriday
}

// Intervalos do dia em minutos. Feriado em domingo segue o horário de domingo.
function intervalsFor(date: Date): [number, number][] {
  const weekday = date.getUTCDay()
  const hours =
    weekday === 0
      ? openingSchedule.sundays
      : weekday === 6 || isHoliday(date)
        ? openingSchedule.saturdaysAndHolidays
        : openingSchedule.weekdays
  return hours.map(([start, end]): [number, number] => [start * 60, end * 60])
}

export function gymStatus(time: GymTime): GymStatus {
  const minutes = time.hour * 60 + time.minute
  const today = Date.UTC(time.year, time.month - 1, time.day)
  const current = intervalsFor(new Date(today)).find(([start, end]) => minutes >= start && minutes < end)
  if (current) return { open: true, until: current[1] }

  for (let daysAhead = 0; daysAhead < 8; daysAhead++) {
    const date = new Date(today + daysAhead * 86_400_000)
    const next = intervalsFor(date).find(([start]) => daysAhead > 0 || start > minutes)
    if (next) return { open: false, opensAt: next[0], daysAhead, weekday: date.getUTCDay() }
  }
  throw new Error("Sem horário de abertura na próxima semana")
}

// 0 = domingo ... 6 = sábado, no dia de Três de Maio.
export function weekdayOf(time: GymTime) {
  return new Date(Date.UTC(time.year, time.month - 1, time.day)).getUTCDay()
}

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}
