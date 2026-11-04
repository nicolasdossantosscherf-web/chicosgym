"use client"

import { useId } from "react"
import { useClockSecond } from "@/lib/use-clock"
import { formatMinutes, gymStatus, gymTime, weekdayOf, type GymStatus } from "@/lib/gym-hours"

// Relógio de LED igual ao da parede da academia, desenhado num único SVG (escala
// pra qualquer tamanho). Mostra a hora de Três de Maio, o dia da semana, a data
// e, no lugar da temperatura, se a academia está aberta e quando fecha/abre.

// --- Display de 7 segmentos (dígito de 56 x 100 unidades) ---
const T = 9 // espessura do segmento
const G = 1.5 // folga entre segmentos

const hSeg = (y: number) => {
  const [x0, x1] = [6 + G, 50 - G]
  return `${x0},${y} ${x0 + T / 2},${y - T / 2} ${x1 - T / 2},${y - T / 2} ${x1},${y} ${x1 - T / 2},${y + T / 2} ${x0 + T / 2},${y + T / 2}`
}
const vSeg = (x: number, top: number, bottom: number) => {
  const [y0, y1] = [top + G, bottom - G]
  return `${x},${y0} ${x + T / 2},${y0 + T / 2} ${x + T / 2},${y1 - T / 2} ${x},${y1} ${x - T / 2},${y1 - T / 2} ${x - T / 2},${y0 + T / 2}`
}

const SEGMENTS = {
  a: hSeg(6),
  b: vSeg(50, 6, 50),
  c: vSeg(50, 50, 94),
  d: hSeg(94),
  e: vSeg(6, 50, 94),
  f: vSeg(6, 6, 50),
  g: hSeg(50),
} as const

const DIGITS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
}

const DIGIT_W = 56
const LIT = "#ff2e1f"

function Digit({ x, y, scale, char, glow }: { x: number; y: number; scale: number; char: string | null; glow: string }) {
  const lit = char ? DIGITS[char] ?? "" : ""
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) skewX(-7)`}>
      {Object.entries(SEGMENTS).map(([name, points]) => (
        <polygon key={name} points={points} fill={LIT} opacity={0.08} />
      ))}
      <g filter={`url(#${glow})`}>
        {Object.entries(SEGMENTS)
          .filter(([name]) => lit.includes(name))
          .map(([name, points]) => (
            <polygon key={name} points={points} fill={LIT} />
          ))}
      </g>
    </g>
  )
}

// Grupo de dígitos dentro de uma "janela" cinza, como no relógio de verdade.
function DigitWindow({
  x,
  y,
  scale,
  text,
  glow,
  padding,
}: {
  x: number
  y: number
  scale: number
  text: string | null
  glow: string
  padding: number
}) {
  const length = text?.length ?? 2
  const gap = 12 * scale
  const w = length * DIGIT_W * scale + (length - 1) * gap + padding * 2
  const h = 100 * scale + padding * 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8 * scale + 2} fill="#ffffff" opacity={0.07} />
      {Array.from({ length }, (_, i) => (
        <Digit
          key={i}
          x={x + padding + i * (DIGIT_W * scale + gap)}
          y={y + padding}
          scale={scale}
          char={text ? text[i] : null}
          glow={glow}
        />
      ))}
    </g>
  )
}

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
const pad = (n: number) => String(n).padStart(2, "0")

function statusLabel(status: GymStatus) {
  if (status.open) return "FECHA ÀS"
  return status.daysAhead === 0 ? "ABRE ÀS" : status.daysAhead === 1 ? "ABRE AMANHÃ" : "ABRE"
}

const OPEN_GREEN = "#22e07a"

// Hora, status e dia da semana de agora (null no servidor, antes do relógio montar).
function useGymClock() {
  const second = useClockSecond()
  const time = second === null ? null : gymTime(new Date(second * 1000))
  const status = time ? gymStatus(time) : null
  const weekday = time ? weekdayOf(time) : -1
  const nextChange = status ? formatMinutes(status.open ? status.until : status.opensAt) : null
  const label =
    time && status && nextChange
      ? `Relógio da Chico's Gym: ${pad(time.hour)}:${pad(time.minute)}, ${WEEKDAYS[weekday]} ${pad(time.day)}/${pad(time.month)}/${time.year}. ${status.open ? "Aberta" : "Fechada"}, ${statusLabel(status).toLowerCase()} ${nextChange}.`
      : "Relógio da Chico's Gym"
  return { time, status, weekday, nextChange, label }
}

function ClockDefs({ glow, panel }: { glow: string; panel: string }) {
  return (
    <defs>
      <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id={panel} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1a1b" />
        <stop offset="1" stopColor="#070707" />
      </linearGradient>
    </defs>
  )
}

function useSvgIds() {
  const id = useId().replace(/:/g, "")
  return { glow: `led-glow-${id}`, panel: `led-panel-${id}` }
}

// Versão do cabeçalho: só a hora grande e, embaixo, aberta/fechada.
export function LedClockCompact({ className }: { className?: string }) {
  const { glow, panel } = useSvgIds()
  const { time, status, nextChange, label } = useGymClock()
  const statusColor = status ? (status.open ? OPEN_GREEN : LIT) : "#666"
  const detail = status
    ? status.open
      ? `ATÉ ${nextChange}`
      : `${status.daysAhead === 0 ? "ABRE" : "AMANHÃ"} ${nextChange}`
    : "HORÁRIO"

  return (
    <svg viewBox="0 0 520 200" role="img" aria-label={label} className={className}>
      <ClockDefs glow={glow} panel={panel} />
      <rect x="2.5" y="2.5" width="515" height="195" rx="20" fill={`url(#${panel})`} stroke="#4a4a4c" strokeWidth="5" />
      <polygon points="452,10 474,10 404,190 382,190" fill="#ffffff" opacity="0.045" />
      {(["hour", "minute", "second"] as const).map((unit, i) => (
        <DigitWindow
          key={unit}
          x={46.6 + i * 153.6}
          y={16}
          scale={0.82}
          padding={9}
          text={time ? pad(time[unit]) : null}
          glow={glow}
        />
      ))}
      {[183.2, 336.8].map((cx) => (
        <g key={cx} filter={time ? `url(#${glow})` : undefined}>
          <circle cx={cx} cy={52} r={5} fill={LIT} opacity={time ? 1 : 0.15} />
          <circle cx={cx} cy={80} r={5} fill={LIT} opacity={time ? 1 : 0.15} />
        </g>
      ))}
      <text x="260" y="168" textAnchor="middle" fontSize="34" fontWeight="800" letterSpacing="1.5" className="font-body">
        <tspan fill={statusColor} filter={status ? `url(#${glow})` : undefined}>
          {status ? `● ${status.open ? "ABERTA" : "FECHADA"}` : "●"}
        </tspan>
        <tspan fill="#9a9a9a"> · {detail}</tspan>
      </text>
    </svg>
  )
}

export function LedClock({ className }: { className?: string }) {
  const { glow, panel } = useSvgIds()
  const { time, status, weekday, nextChange: nextTime, label } = useGymClock()
  const nextChange = nextTime?.replace(":", "") ?? null
  const statusColor = status ? (status.open ? OPEN_GREEN : LIT) : "#555"

  return (
    <svg viewBox="0 0 800 460" role="img" aria-label={label} className={className}>
      <ClockDefs glow={glow} panel={panel} />

      {/* Caixa: moldura cinza, painel preto e o reflexo do vidro */}
      <rect x="3" y="3" width="794" height="454" rx="26" fill={`url(#${panel})`} stroke="#4a4a4c" strokeWidth="5" />
      <rect x="12" y="12" width="776" height="436" rx="19" fill="none" stroke="#000" strokeWidth="2" opacity="0.6" />
      <polygon points="705,24 738,24 628,436 595,436" fill="#ffffff" opacity="0.045" />

      <text
        x="400"
        y="66"
        textAnchor="middle"
        className="font-display"
        fontSize="34"
        letterSpacing="4"
        fill="#ededed"
      >
        CHICO&apos;S GYM
      </text>

      {/* Horas : minutos : segundos */}
      {(["hour", "minute", "second"] as const).map((unit, i) => (
        <DigitWindow
          key={unit}
          x={67 + i * 243.3}
          y={86}
          scale={1.22}
          padding={14}
          text={time ? pad(time[unit]) : null}
          glow={glow}
        />
      ))}
      {[278.3, 521.6].map((cx) => (
        <g key={cx} filter={time ? `url(#${glow})` : undefined}>
          <circle cx={cx} cy={140} r={6.5} fill={LIT} opacity={time ? 1 : 0.15} />
          <circle cx={cx} cy={182} r={6.5} fill={LIT} opacity={time ? 1 : 0.15} />
        </g>
      ))}

      {/* Aberta/fechada + dias da semana */}
      <g filter={status ? `url(#${glow})` : undefined}>
        <circle cx="62" cy="291" r="8" fill={statusColor} />
      </g>
      <text x="78" y="298" fontSize="21" fontWeight="800" letterSpacing="1" fill={statusColor} className="font-body">
        {status ? (status.open ? "ABERTA" : "FECHADA") : "- - -"}
      </text>
      <rect x="205" y="268" width="550" height="46" rx="23" fill="none" stroke="#d4d4d4" strokeWidth="2.5" />
      {WEEKDAYS.map((day, i) => (
        <text
          key={day}
          x={246 + i * 78}
          y="299"
          textAnchor="middle"
          fontSize="21"
          fontWeight="800"
          className="font-body"
          fill={i === weekday ? LIT : "#7a7a7a"}
          filter={i === weekday ? `url(#${glow})` : undefined}
        >
          {day}
        </text>
      ))}

      {/* Dia, mês, ano e o próximo horário (fecha/abre) */}
      <DigitWindow x={52} y={336} scale={0.5} padding={8} text={time ? pad(time.day) : null} glow={glow} />
      <DigitWindow x={157} y={336} scale={0.5} padding={8} text={time ? pad(time.month) : null} glow={glow} />
      <DigitWindow x={262} y={336} scale={0.5} padding={8} text={time ? String(time.year) : "    "} glow={glow} />
      <DigitWindow x={572} y={336} scale={0.5} padding={8} text={nextChange?.slice(0, 2) ?? null} glow={glow} />
      <DigitWindow x={668} y={336} scale={0.5} padding={8} text={nextChange?.slice(2) ?? null} glow={glow} />
      <g filter={nextChange ? `url(#${glow})` : undefined}>
        <circle cx={659} cy={360} r={3.4} fill={LIT} opacity={nextChange ? 1 : 0.15} />
        <circle cx={659} cy={380} r={3.4} fill={LIT} opacity={nextChange ? 1 : 0.15} />
      </g>
      {[
        ["Dia", 90],
        ["Mês", 195],
        ["Ano", 334],
      ].map(([text, x]) => (
        <text key={text} x={x} y="436" textAnchor="middle" fontSize="24" fontWeight="700" fill="#e6e6e6" className="font-body">
          {text}
        </text>
      ))}
      <text x="659" y="436" textAnchor="middle" fontSize="20" fontWeight="700" fill="#e6e6e6" className="font-body">
        {status ? statusLabel(status) : "HORÁRIO"}
      </text>
    </svg>
  )
}
