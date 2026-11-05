// Motor do "Monte seu Treino": monta um treino personalizado a partir das
// respostas, usando SÓ os exercícios dos cartazes da Chico's Gym e a mesma
// divisão de dias das fichas oficiais (lib/workouts.ts). Roda inteiro no
// aparelho da pessoa — sem servidor, sem IA externa, sem custo — e é
// determinístico: as mesmas respostas sempre geram o mesmo treino.
//
// As regras de séries, repetições, cardio e quantidade de exercícios estão em
// `prescription()` e os pesos das escolhas em `scoreExercise()`, pra equipe da
// academia revisar e ajustar com facilidade.

import { detectInjuryRegions, exerciseRisks, type InjuryRegion } from "./workouts"

export type MuscleGroup =
  | "quadriceps"
  | "posterior"
  | "gluteos"
  | "adutores"
  | "panturrilha"
  | "peito"
  | "costas"
  | "ombros"
  | "trapezio"
  | "biceps"
  | "triceps"
  | "antebraco"

export type Equipment = "maquina" | "polia" | "livre"

// `technical`: exercícios livres que pedem mais técnica — pra quem está
// começando (ou tem 60+), o motor prefere uma opção em máquina quando existe.
const CATALOG = {
  "cadeira-extensora": { name: "Cadeira extensora", group: "quadriceps", equipment: "maquina" },
  "leg-press": { name: "Leg press", group: "quadriceps", equipment: "maquina" },
  "agachamento-hack": { name: "Agachamento hack", group: "quadriceps", equipment: "maquina" },
  agachamento: { name: "Agachamento", group: "quadriceps", equipment: "livre", technical: true },
  "elevacao-pelvica": { name: "Elevação pélvica", group: "gluteos", equipment: "livre" },
  afundo: { name: "Afundo", group: "gluteos", equipment: "livre", technical: true },
  bulgaro: { name: "Búlgaro", group: "gluteos", equipment: "livre", technical: true },
  "cadeira-abdutora": { name: "Cadeira abdutora", group: "gluteos", equipment: "maquina" },
  coice: { name: "Coice polia/máquina", group: "gluteos", equipment: "polia" },
  "mesa-flexora": { name: "Mesa flexora", group: "posterior", equipment: "maquina" },
  "cadeira-flexora": { name: "Cadeira flexora", group: "posterior", equipment: "maquina" },
  stiff: { name: "Stiff", group: "posterior", equipment: "livre", technical: true },
  "cadeira-adutora": { name: "Cadeira adutora", group: "adutores", equipment: "maquina" },
  panturrilha: { name: "Panturrilha", group: "panturrilha", equipment: "maquina" },
  "supino-reto": { name: "Supino reto", group: "peito", equipment: "livre" },
  "supino-inclinado": { name: "Supino inclinado", group: "peito", equipment: "livre" },
  voador: { name: "Voador", group: "peito", equipment: "maquina" },
  "crucifixo-cross": { name: "Crucifixo cross", group: "peito", equipment: "polia" },
  "puxada-alta": { name: "Puxada alta", group: "costas", equipment: "maquina" },
  "remada-baixa": { name: "Remada baixa", group: "costas", equipment: "maquina" },
  "puxada-cavalinho": { name: "Puxada cavalinho", group: "costas", equipment: "maquina" },
  "remada-t": { name: "Remada T", group: "costas", equipment: "livre", technical: true },
  serrote: { name: "Serrote halter", group: "costas", equipment: "livre" },
  "pullover-corda": { name: "Pullover corda", group: "costas", equipment: "polia" },
  desenvolvimento: { name: "Desenvolvimento", group: "ombros", equipment: "livre" },
  "elevacao-lateral": { name: "Elevação lateral", group: "ombros", equipment: "livre" },
  "elevacao-frontal": { name: "Elevação frontal", group: "ombros", equipment: "livre" },
  "posterior-ombro": { name: "Posterior ombro", group: "ombros", equipment: "maquina" },
  trapezio: { name: "Trapézio", group: "trapezio", equipment: "livre" },
  "biceps-polia": { name: "Bíceps polia", group: "biceps", equipment: "polia" },
  "biceps-livre": { name: "Bíceps livre", group: "biceps", equipment: "livre" },
  "biceps-martelo": { name: "Bíceps martelo", group: "biceps", equipment: "livre" },
  "triceps-polia": { name: "Tríceps polia", group: "triceps", equipment: "polia" },
  "triceps-livre": { name: "Tríceps livre", group: "triceps", equipment: "livre" },
  antebraco: { name: "Antebraço", group: "antebraco", equipment: "livre" },
} satisfies Record<string, { name: string; group: MuscleGroup; equipment: Equipment; technical?: boolean }>

export type ExerciseId = keyof typeof CATALOG
export type CatalogExercise = { id: ExerciseId; name: string; group: MuscleGroup; equipment: Equipment; technical: boolean }

export const exerciseCatalog: CatalogExercise[] = (Object.keys(CATALOG) as ExerciseId[]).map((id) => {
  const entry: { name: string; group: MuscleGroup; equipment: Equipment; technical?: boolean } = CATALOG[id]
  return { id, name: entry.name, group: entry.group, equipment: entry.equipment, technical: entry.technical ?? false }
})

const catalogById = new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise]))

export function isExerciseId(value: unknown): value is ExerciseId {
  return typeof value === "string" && catalogById.has(value as ExerciseId)
}

export function getExercise(id: ExerciseId) {
  return catalogById.get(id)!
}

// Grupos mostrados na pergunta de preferências.
export const exerciseSections: { label: string; groups: MuscleGroup[] }[] = [
  { label: "Pernas", groups: ["quadriceps", "posterior", "adutores", "panturrilha"] },
  { label: "Glúteos", groups: ["gluteos"] },
  { label: "Peito", groups: ["peito"] },
  { label: "Costas", groups: ["costas"] },
  { label: "Ombros", groups: ["ombros", "trapezio"] },
  { label: "Braços", groups: ["biceps", "triceps", "antebraco"] },
]

// ---------------------------------------------------------------------------
// Respostas
// ---------------------------------------------------------------------------

export type Sex = "feminino" | "masculino"
export type Goal = "massa" | "emagrecer" | "condicionamento" | "saude"
export type TrainingTime = "menos-6m" | "6m-1a" | "1a-2a" | "mais-2a"
export type EquipmentPreference = "tanto-faz" | "maquinas" | "livres"
export type FocusArea = "gluteos" | "pernas" | "posterior" | "peito" | "costas" | "ombros" | "bracos" | "panturrilha"
export type TrainingDays = 2 | 3 | 4 | 5 | 6
export type Level = "iniciante" | "intermediario" | "avancado"

export type Experience = { trained: false } | { trained: true; time: TrainingTime; active: boolean }

export type WorkoutProfile = {
  name: string
  age: number
  weight: number // kg
  height: number // cm
  sex: Sex
  goal: Goal
  experience: Experience
  days: TrainingDays
  injury: string | null
  equipment: EquipmentPreference
  focus: FocusArea[]
  avoid: ExerciseId[]
  favorites: ExerciseId[]
  notes: string
}

export const TRAINING_DAYS: TrainingDays[] = [2, 3, 4, 5, 6]

export const trainingTimes: { id: TrainingTime; label: string }[] = [
  { id: "menos-6m", label: "Menos de 6 meses" },
  { id: "6m-1a", label: "De 6 meses a 1 ano" },
  { id: "1a-2a", label: "De 1 a 2 anos" },
  { id: "mais-2a", label: "Mais de 2 anos" },
]

export const equipmentPreferences: { id: EquipmentPreference; label: string }[] = [
  { id: "tanto-faz", label: "Tanto faz" },
  { id: "maquinas", label: "Máquinas" },
  { id: "livres", label: "Pesos livres" },
]

export const focusAreas: { id: FocusArea; label: string; groups: MuscleGroup[] }[] = [
  { id: "gluteos", label: "Glúteos", groups: ["gluteos"] },
  { id: "pernas", label: "Pernas", groups: ["quadriceps", "adutores"] },
  { id: "posterior", label: "Posterior de coxa", groups: ["posterior"] },
  { id: "peito", label: "Peito", groups: ["peito"] },
  { id: "costas", label: "Costas", groups: ["costas"] },
  { id: "ombros", label: "Ombros", groups: ["ombros", "trapezio"] },
  { id: "bracos", label: "Braços", groups: ["biceps", "triceps", "antebraco"] },
  { id: "panturrilha", label: "Panturrilha", groups: ["panturrilha"] },
]

export const levelLabels: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

export const LIMITS = {
  name: { min: 2, max: 40 },
  age: { min: 12, max: 100 },
  weight: { min: 30, max: 250 },
  height: { min: 120, max: 230 },
  injury: 200,
  notes: 200,
  focus: 2,
  favorites: 5,
  avoid: 12,
}

// ---------------------------------------------------------------------------
// Regras (revisar com os profissionais da academia)
// ---------------------------------------------------------------------------

const MAX_PER_DAY = 8

export function trainingLevel(profile: WorkoutProfile): Level {
  if (!profile.experience.trained) return "iniciante"
  const base = { "menos-6m": 0, "6m-1a": 1, "1a-2a": 1, "mais-2a": 2 }[profile.experience.time]
  // Quem está parado volta um nível pra readaptar o corpo.
  const adjusted = profile.experience.active ? base : base - 1
  return (["iniciante", "intermediario", "avancado"] as const)[Math.max(0, adjusted)]
}

export function bodyMassIndex(profile: Pick<WorkoutProfile, "weight" | "height">) {
  return profile.weight / (profile.height / 100) ** 2
}

const LOW_IMPACT_REGIONS = new Set(["joelho", "tornozelo", "quadril", "coluna"])

export function prescription(profile: WorkoutProfile) {
  const level = trainingLevel(profile)
  const senior = profile.age >= 60
  const injuryRegions = profile.injury ? detectInjuryRegions(profile.injury) : []

  let perDay = { iniciante: 5, intermediario: 6, avancado: 7 }[level]
  if (senior) perDay = Math.min(perDay, 5)
  // Treino de corpo todo (2x) precisa de um exercício a mais pra cobrir tudo.
  if (profile.days === 2) perDay += 1

  // As fichas da academia usam 4 séries (a 1ª é aquecimento). Pra quem está
  // começando ou tem 60+, 3 séries nas primeiras semanas.
  const sets = level === "iniciante" || senior ? 3 : 4
  const reps = profile.goal === "emagrecer" || profile.goal === "condicionamento" ? "12-15" : "10-12"

  const injuryLowImpact = injuryRegions.some((region) => LOW_IMPACT_REGIONS.has(region.id))
  const lowImpact = injuryLowImpact || bodyMassIndex(profile) >= 30
  const cardioMachine = lowImpact ? "Bike" : "Bike ou esteira"
  const cardioMinutes = profile.goal === "emagrecer" ? "30-40 minutos" : "20-30 minutos"

  return {
    level,
    levelLabel: profile.experience.trained && level === "iniciante" ? "Retomando" : levelLabels[level],
    senior,
    perDay,
    sets,
    reps,
    cardio: `${cardioMachine}: ${cardioMinutes}`,
    cardioMachine,
    cardioMinutes,
    lowImpact,
    injuryLowImpact,
    injuryRegions,
    cautiousTechnique: level === "iniciante" || senior,
  }
}

// ---------------------------------------------------------------------------
// Divisões da semana (baseadas nas fichas oficiais)
// ---------------------------------------------------------------------------

// Cada dia é uma lista de "vagas" na ordem em que aparecem na ficha. `tier`
// diz a prioridade da vaga (1 entra sempre, 2 e 3 só com mais exercícios por
// dia) e `options` são os exercícios preferidos pra vaga, na ordem dos cartazes.
type Slot = { group: MuscleGroup; tier: 1 | 2 | 3; options: ExerciseId[] }
type DayTemplate = { title: string; slots: Slot[] }

const s = (tier: Slot["tier"], group: MuscleGroup, ...options: ExerciseId[]): Slot => ({ tier, group, options })
const day = (title: string, ...slots: Slot[]): DayTemplate => ({ title, slots })

const LEGS_SLOTS = [
  s(1, "quadriceps", "cadeira-extensora"),
  s(1, "quadriceps", "leg-press"),
  s(1, "quadriceps", "agachamento-hack", "agachamento"),
  s(3, "adutores", "cadeira-adutora"),
  s(1, "posterior", "mesa-flexora"),
  s(2, "posterior", "cadeira-flexora", "stiff"),
  s(2, "panturrilha", "panturrilha"),
]

const F_QUAD = day("Quadríceps", ...LEGS_SLOTS)
const M_LEGS = day("Pernas", ...LEGS_SLOTS)

const F_UPPER = day(
  "Superiores",
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "remada-baixa", "puxada-cavalinho", "serrote"),
  s(2, "ombros", "posterior-ombro"),
  s(1, "ombros", "elevacao-lateral"),
  s(1, "peito", "voador", "supino-inclinado"),
  s(2, "ombros", "desenvolvimento"),
  s(3, "triceps", "triceps-polia", "triceps-livre"),
  s(3, "biceps", "biceps-polia", "biceps-livre", "biceps-martelo")
)

const F_GLUTE_A = day(
  "Glúteo/Posterior",
  s(1, "gluteos", "elevacao-pelvica"),
  s(1, "gluteos", "afundo", "bulgaro"),
  s(1, "quadriceps", "agachamento", "leg-press"),
  s(1, "posterior", "stiff", "mesa-flexora"),
  s(2, "gluteos", "cadeira-abdutora"),
  s(2, "gluteos", "coice"),
  s(3, "posterior", "cadeira-flexora")
)

const F_GLUTE_B = day(
  "Glúteo/Posterior",
  s(1, "gluteos", "elevacao-pelvica"),
  s(1, "gluteos", "bulgaro", "afundo"),
  s(1, "quadriceps", "agachamento", "leg-press"),
  s(1, "posterior", "stiff", "mesa-flexora"),
  s(2, "gluteos", "cadeira-abdutora"),
  s(2, "posterior", "cadeira-flexora"),
  s(3, "gluteos", "coice")
)

const F_BACK = day(
  "Costas/Bíceps",
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "remada-baixa"),
  s(2, "costas", "puxada-cavalinho", "serrote", "remada-t"),
  s(2, "ombros", "posterior-ombro"),
  s(1, "biceps", "biceps-polia", "biceps-livre"),
  s(3, "biceps", "biceps-martelo"),
  s(3, "costas", "pullover-corda")
)

const F_CHEST = day(
  "Peito/Ombro/Tríceps",
  s(1, "peito", "voador"),
  s(1, "peito", "supino-inclinado", "supino-reto"),
  s(1, "ombros", "desenvolvimento"),
  s(3, "ombros", "elevacao-frontal"),
  s(2, "ombros", "elevacao-lateral"),
  s(1, "triceps", "triceps-polia"),
  s(2, "triceps", "triceps-livre")
)

const F_ARMS = day(
  "Ombros/Braços",
  s(1, "ombros", "desenvolvimento"),
  s(1, "ombros", "elevacao-lateral"),
  s(2, "ombros", "elevacao-frontal"),
  s(1, "triceps", "triceps-polia"),
  s(2, "triceps", "triceps-livre"),
  s(1, "panturrilha", "panturrilha"),
  s(3, "ombros", "posterior-ombro")
)

const F_UPPER_CHEST = day(
  "Superior/Peito",
  s(1, "peito", "supino-inclinado", "supino-reto"),
  s(1, "peito", "voador"),
  s(2, "peito", "crucifixo-cross"),
  s(1, "costas", "remada-baixa", "puxada-alta", "serrote"),
  s(2, "ombros", "elevacao-lateral"),
  s(3, "costas", "pullover-corda"),
  s(3, "triceps", "triceps-livre", "triceps-polia")
)

const F_FULL_A = day(
  "Corpo todo A",
  s(1, "quadriceps", "leg-press", "agachamento-hack"),
  s(1, "gluteos", "elevacao-pelvica"),
  s(2, "posterior", "mesa-flexora", "stiff"),
  s(1, "costas", "puxada-alta"),
  s(1, "peito", "voador", "supino-inclinado"),
  s(2, "ombros", "elevacao-lateral"),
  s(3, "triceps", "triceps-polia"),
  s(3, "panturrilha", "panturrilha")
)

const F_FULL_B = day(
  "Corpo todo B",
  s(1, "gluteos", "bulgaro", "afundo", "agachamento"),
  s(1, "quadriceps", "cadeira-extensora"),
  s(2, "posterior", "cadeira-flexora"),
  s(2, "gluteos", "cadeira-abdutora"),
  s(1, "costas", "remada-baixa", "serrote"),
  s(1, "ombros", "desenvolvimento"),
  s(3, "biceps", "biceps-polia", "biceps-livre"),
  s(3, "gluteos", "coice")
)

const M_CHEST = day(
  "Peito/Tríceps",
  s(2, "peito", "crucifixo-cross"),
  s(1, "peito", "supino-inclinado"),
  s(1, "peito", "supino-reto"),
  s(2, "peito", "voador"),
  s(1, "triceps", "triceps-polia"),
  s(1, "triceps", "triceps-livre"),
  s(3, "ombros", "elevacao-frontal")
)

const M_CHEST_SHOULDER = day(
  "Peito/Tríceps/Ombro",
  s(2, "peito", "crucifixo-cross"),
  s(1, "peito", "supino-inclinado"),
  s(1, "peito", "supino-reto"),
  s(3, "peito", "voador"),
  s(1, "ombros", "desenvolvimento", "elevacao-lateral"),
  s(1, "triceps", "triceps-polia"),
  s(2, "triceps", "triceps-livre")
)

const M_BACK = day(
  "Costas/Bíceps",
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "remada-baixa"),
  s(2, "costas", "remada-t", "puxada-cavalinho"),
  s(3, "costas", "serrote"),
  s(3, "ombros", "posterior-ombro"),
  s(1, "biceps", "biceps-polia"),
  s(2, "biceps", "biceps-livre", "biceps-martelo")
)

const M_BACK_SHOULDER = day(
  "Costas/Bíceps/Ombro",
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "remada-baixa"),
  s(2, "costas", "remada-t", "puxada-cavalinho"),
  s(3, "costas", "serrote"),
  s(2, "ombros", "posterior-ombro"),
  s(1, "biceps", "biceps-polia"),
  s(3, "biceps", "biceps-livre", "biceps-martelo")
)

const M_SHOULDERS = day(
  "Ombros/Braços",
  s(1, "ombros", "desenvolvimento"),
  s(1, "ombros", "elevacao-lateral"),
  s(2, "ombros", "elevacao-frontal"),
  s(2, "ombros", "posterior-ombro"),
  s(1, "biceps", "biceps-livre", "biceps-polia", "biceps-martelo"),
  s(1, "triceps", "triceps-polia", "triceps-livre"),
  s(3, "trapezio", "trapezio")
)

const M5_UPPER_A = day(
  "Superior A",
  s(2, "peito", "crucifixo-cross"),
  s(1, "peito", "supino-inclinado"),
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "remada-baixa"),
  s(2, "biceps", "biceps-livre"),
  s(2, "triceps", "triceps-livre"),
  s(1, "ombros", "elevacao-lateral")
)

const M5_LOWER_A = day(
  "Inferior A",
  s(1, "quadriceps", "cadeira-extensora"),
  s(1, "quadriceps", "agachamento-hack"),
  s(1, "posterior", "mesa-flexora"),
  s(1, "posterior", "cadeira-flexora"),
  s(1, "panturrilha", "panturrilha"),
  s(3, "adutores", "cadeira-adutora")
)

const M5_UPPER_B = day(
  "Superior B",
  s(3, "costas", "pullover-corda"),
  s(1, "costas", "puxada-alta"),
  s(1, "costas", "serrote"),
  s(3, "ombros", "posterior-ombro"),
  s(1, "peito", "supino-reto"),
  s(2, "peito", "voador"),
  s(2, "biceps", "biceps-livre", "biceps-polia"),
  s(2, "triceps", "triceps-livre", "triceps-polia")
)

const M5_LOWER_B = day(
  "Inferior B",
  s(1, "quadriceps", "agachamento", "agachamento-hack"),
  s(1, "quadriceps", "leg-press"),
  s(2, "posterior", "mesa-flexora"),
  s(1, "posterior", "stiff", "cadeira-flexora"),
  s(2, "adutores", "cadeira-adutora"),
  s(2, "panturrilha", "panturrilha")
)

const M5_ARMS = day(
  "Ombros/Braços",
  s(1, "ombros", "desenvolvimento"),
  s(1, "ombros", "elevacao-lateral"),
  s(2, "ombros", "elevacao-frontal"),
  s(1, "biceps", "biceps-livre", "biceps-martelo"),
  s(1, "triceps", "triceps-livre", "triceps-polia"),
  s(2, "trapezio", "trapezio"),
  s(3, "antebraco", "antebraco")
)

const M_FULL_A = day(
  "Corpo todo A",
  s(1, "peito", "supino-reto", "supino-inclinado"),
  s(1, "costas", "puxada-alta"),
  s(1, "quadriceps", "leg-press", "agachamento-hack"),
  s(1, "ombros", "desenvolvimento"),
  s(2, "posterior", "mesa-flexora"),
  s(2, "triceps", "triceps-polia"),
  s(3, "biceps", "biceps-livre"),
  s(3, "panturrilha", "panturrilha")
)

const M_FULL_B = day(
  "Corpo todo B",
  s(1, "peito", "supino-inclinado", "voador"),
  s(1, "costas", "remada-baixa", "serrote"),
  s(1, "quadriceps", "agachamento-hack", "agachamento", "cadeira-extensora"),
  s(2, "ombros", "elevacao-lateral"),
  s(2, "posterior", "cadeira-flexora", "stiff"),
  s(2, "biceps", "biceps-polia"),
  s(3, "triceps", "triceps-livre"),
  s(3, "gluteos", "elevacao-pelvica")
)

const SPLITS: Record<Sex, Record<TrainingDays, DayTemplate[]>> = {
  feminino: {
    2: [F_FULL_A, F_FULL_B],
    3: [F_QUAD, F_UPPER, F_GLUTE_A],
    4: [F_QUAD, F_BACK, F_GLUTE_B, F_CHEST],
    5: [F_QUAD, F_BACK, F_ARMS, F_GLUTE_B, F_UPPER_CHEST],
    6: [F_QUAD, F_UPPER, F_GLUTE_A, F_QUAD, F_UPPER, F_GLUTE_B],
  },
  masculino: {
    2: [M_FULL_A, M_FULL_B],
    3: [M_CHEST_SHOULDER, M_LEGS, M_BACK_SHOULDER],
    4: [M_CHEST, M_BACK, M_LEGS, M_SHOULDERS],
    5: [M5_UPPER_A, M5_LOWER_A, M5_UPPER_B, M5_LOWER_B, M5_ARMS],
    6: [M_CHEST_SHOULDER, M_BACK_SHOULDER, M_LEGS, M_CHEST_SHOULDER, M_BACK_SHOULDER, M_LEGS],
  },
}

// ---------------------------------------------------------------------------
// Montagem
// ---------------------------------------------------------------------------

export type GeneratedExercise = { id: ExerciseId; name: string; group: MuscleGroup }
export type GeneratedDay = { title: string; exercises: GeneratedExercise[] }
export type GeneratedWorkout = {
  version: 1
  id: string
  createdAt: string
  profile: WorkoutProfile
  days: GeneratedDay[]
}

type Context = {
  avoid: Set<ExerciseId>
  favorites: Set<ExerciseId>
  equipment: EquipmentPreference
  cautiousTechnique: boolean
  injuryRegions: InjuryRegion[]
  usedInWeek: Set<ExerciseId>
}

// Quanto uma vaga perde ao usar um exercício que não está na lista dela
// (mas é do mesmo grupo muscular). Só compensa com motivo forte: favorito,
// lesão + preferência, técnica + preferência…
const OUTSIDE_OPTIONS_PENALTY = 35

function scoreExercise(exercise: CatalogExercise, ctx: Context) {
  let score = 0
  if (ctx.favorites.has(exercise.id) && !ctx.usedInWeek.has(exercise.id)) score += 60
  if (ctx.equipment === "maquinas") score += exercise.equipment === "livre" ? -15 : 15
  if (ctx.equipment === "livres") score += exercise.equipment === "livre" ? 15 : -10
  if (exercise.technical && ctx.cautiousTechnique) score -= 25
  if (exerciseRisks(exercise.name, ctx.injuryRegions).length > 0) score -= 30
  // Variar a semana quando a vaga tem alternativas.
  if (ctx.usedInWeek.has(exercise.id)) score -= 12
  return score
}

function pickForSlot(slot: Slot, ctx: Context, usedToday: Set<ExerciseId>) {
  const pool = new Map<ExerciseId, number>()
  slot.options.forEach((id, index) => pool.set(id, -10 * index))
  for (const exercise of exerciseCatalog) {
    if (exercise.group === slot.group && !pool.has(exercise.id)) pool.set(exercise.id, -OUTSIDE_OPTIONS_PENALTY)
  }

  let best: CatalogExercise | null = null
  let bestScore = MIN_ACCEPTABLE_SCORE
  for (const [id, base] of pool) {
    if (ctx.avoid.has(id) || usedToday.has(id)) continue
    const exercise = getExercise(id)
    const score = base + scoreExercise(exercise, ctx)
    if (score > bestScore) {
      best = exercise
      bestScore = score
    }
  }
  return best
}

// Abaixo disso a vaga fica vazia (ex.: Afundo pra iniciante com lesão no
// joelho) e o dia recebe outro exercício da mesma região do corpo.
const MIN_ACCEPTABLE_SCORE = -50

function buildDay(template: DayTemplate, perDay: number, focusGroups: Set<MuscleGroup>, ctx: Context): GeneratedDay {
  const hasFocus = template.slots.some((slot) => focusGroups.has(slot.group))
  const target = Math.min(MAX_PER_DAY, perDay + (hasFocus ? 1 : 0))

  const order = template.slots
    .map((slot, index) => {
      const focused = focusGroups.has(slot.group)
      return { slot, index, focused, tier: focused ? Math.max(1, slot.tier - 1) : slot.tier }
    })
    .sort((a, b) => a.tier - b.tier || Number(b.focused) - Number(a.focused) || a.index - b.index)

  const usedToday = new Set<ExerciseId>()
  const picked: { index: number; exercise: CatalogExercise }[] = []
  let missed = 0
  for (const { slot, index } of order) {
    if (picked.length >= target) break
    const exercise = pickForSlot(slot, ctx, usedToday)
    if (!exercise) {
      missed++
      continue
    }
    usedToday.add(exercise.id)
    ctx.usedInWeek.add(exercise.id)
    picked.push({ index, exercise })
  }

  // Vagas que ficaram sem exercício (a pessoa tirou todas as opções do grupo)
  // recebem outro exercício da mesma região do corpo, no fim do dia.
  const families = new Set(template.slots.map((slot) => FAMILY[slot.group]))
  while (missed > 0 && picked.length < target) {
    const exercise = bestOf(
      exerciseCatalog.filter((e) => families.has(FAMILY[e.group]) && !ctx.avoid.has(e.id) && !usedToday.has(e.id)),
      ctx
    )
    if (!exercise) break
    usedToday.add(exercise.id)
    ctx.usedInWeek.add(exercise.id)
    picked.push({ index: template.slots.length + picked.length, exercise })
    missed--
  }

  picked.sort((a, b) => a.index - b.index)
  return { title: template.title, exercises: picked.map(({ exercise }) => toGenerated(exercise)) }
}

// Regiões do corpo, usadas quando um exercício precisa ir pra outro grupo.
const FAMILY: Record<MuscleGroup, "inferiores" | "empurrar" | "puxar"> = {
  quadriceps: "inferiores",
  posterior: "inferiores",
  gluteos: "inferiores",
  adutores: "inferiores",
  panturrilha: "inferiores",
  peito: "empurrar",
  ombros: "empurrar",
  triceps: "empurrar",
  costas: "puxar",
  biceps: "puxar",
  trapezio: "puxar",
  antebraco: "puxar",
}

function bestOf(candidates: CatalogExercise[], ctx: Context) {
  let best: CatalogExercise | null = null
  let bestScore = -Infinity
  for (const exercise of candidates) {
    const score = scoreExercise(exercise, ctx)
    if (score > bestScore) {
      best = exercise
      bestScore = score
    }
  }
  return best
}

function toGenerated(exercise: CatalogExercise): GeneratedExercise {
  return { id: exercise.id, name: exercise.name, group: exercise.group }
}

function contextFor(profile: WorkoutProfile, usedInWeek: Set<ExerciseId>): Context {
  const rules = prescription(profile)
  return {
    avoid: new Set(profile.avoid),
    favorites: new Set(profile.favorites),
    equipment: profile.equipment,
    cautiousTechnique: rules.cautiousTechnique,
    injuryRegions: rules.injuryRegions,
    usedInWeek,
  }
}

export function focusGroupsFor(profile: WorkoutProfile) {
  return new Set(focusAreas.filter((area) => profile.focus.includes(area.id)).flatMap((area) => area.groups))
}

export function buildWorkout(profile: WorkoutProfile, now = new Date()): GeneratedWorkout {
  const rules = prescription(profile)
  const ctx = contextFor(profile, new Set())
  const focusGroups = focusGroupsFor(profile)
  const days = SPLITS[profile.sex][profile.days].map((template) => buildDay(template, rules.perDay, focusGroups, ctx))

  // Favorito que não coube em nenhuma vaga entra no dia que já treina o mesmo
  // grupo muscular (logo depois do último exercício desse grupo) ou, se não
  // houver, no dia com mais exercícios da mesma região do corpo.
  for (const id of profile.favorites) {
    if (profile.avoid.includes(id) || days.some((d) => d.exercises.some((e) => e.id === id))) continue
    const exercise = getExercise(id)
    const open = days.filter((d) => d.exercises.length < MAX_PER_DAY)
    const sameGroup = open.find((d) => d.exercises.some((e) => e.group === exercise.group))
    const familyCount = (d: GeneratedDay) => d.exercises.filter((e) => FAMILY[e.group] === FAMILY[exercise.group]).length
    const target =
      sameGroup ??
      open.filter((d) => familyCount(d) > 0).sort((a, b) => familyCount(b) - familyCount(a))[0]
    if (!target) continue
    const lastIndex = target.exercises.findLastIndex((e) =>
      sameGroup ? e.group === exercise.group : FAMILY[e.group] === FAMILY[exercise.group]
    )
    target.exercises.splice(lastIndex + 1, 0, toGenerated(exercise))
  }

  return {
    version: 1,
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    profile,
    days,
  }
}

// Alternativas pra trocar um exercício: mesmo grupo muscular, fora da lista
// de "tirar" e que ainda não está no mesmo dia — melhores primeiro.
export function swapOptions(workout: GeneratedWorkout, dayIndex: number, exerciseIndex: number): ExerciseId[] {
  const day = workout.days[dayIndex]
  const current = day?.exercises[exerciseIndex]
  if (!current) return []
  const usedInWeek = new Set<ExerciseId>()
  workout.days.forEach((d, di) =>
    d.exercises.forEach((e, ei) => {
      if (di !== dayIndex || ei !== exerciseIndex) usedInWeek.add(e.id)
    })
  )
  const ctx = contextFor(workout.profile, usedInWeek)
  const inDay = new Set(day.exercises.map((e) => e.id))
  return exerciseCatalog
    .filter((e) => e.group === current.group && !ctx.avoid.has(e.id) && (e.id === current.id || !inDay.has(e.id)))
    .map((exercise, order) => ({ exercise, order, score: scoreExercise(exercise, ctx) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ exercise }) => exercise.id)
}

export function swapExercise(workout: GeneratedWorkout, dayIndex: number, exerciseIndex: number): GeneratedWorkout {
  const options = swapOptions(workout, dayIndex, exerciseIndex)
  const current = workout.days[dayIndex]?.exercises[exerciseIndex]
  if (!current || options.length < 2) return workout
  const next = options[(options.indexOf(current.id) + 1) % options.length]
  return {
    ...workout,
    days: workout.days.map((d, di) =>
      di !== dayIndex
        ? d
        : { ...d, exercises: d.exercises.map((e, ei) => (ei === exerciseIndex ? toGenerated(getExercise(next)) : e)) }
    ),
  }
}

// ---------------------------------------------------------------------------
// Validação (respostas e treino salvo no aparelho)
// ---------------------------------------------------------------------------

const SEXES: Sex[] = ["feminino", "masculino"]
const GOALS: Goal[] = ["massa", "emagrecer", "condicionamento", "saude"]

function inRange(value: unknown, { min, max }: { min: number; max: number }) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
}

function isExerciseList(value: unknown, max: number): value is ExerciseId[] {
  return Array.isArray(value) && value.length <= max && value.every(isExerciseId)
}

export function isWorkoutProfile(value: unknown): value is WorkoutProfile {
  if (!value || typeof value !== "object") return false
  const p = value as Record<string, unknown>
  const experience = p.experience as Record<string, unknown> | undefined
  const validExperience =
    !!experience &&
    (experience.trained === false ||
      (experience.trained === true &&
        trainingTimes.some((t) => t.id === experience.time) &&
        typeof experience.active === "boolean"))
  return (
    typeof p.name === "string" &&
    p.name.length <= LIMITS.name.max &&
    inRange(p.age, LIMITS.age) &&
    inRange(p.weight, LIMITS.weight) &&
    inRange(p.height, LIMITS.height) &&
    SEXES.includes(p.sex as Sex) &&
    GOALS.includes(p.goal as Goal) &&
    validExperience &&
    TRAINING_DAYS.includes(p.days as TrainingDays) &&
    (p.injury === null || (typeof p.injury === "string" && p.injury.length <= LIMITS.injury)) &&
    equipmentPreferences.some((e) => e.id === p.equipment) &&
    Array.isArray(p.focus) &&
    p.focus.length <= LIMITS.focus &&
    p.focus.every((f) => focusAreas.some((a) => a.id === f)) &&
    isExerciseList(p.avoid, LIMITS.avoid) &&
    isExerciseList(p.favorites, LIMITS.favorites) &&
    typeof p.notes === "string" &&
    p.notes.length <= LIMITS.notes
  )
}

export function isGeneratedWorkout(value: unknown): value is GeneratedWorkout {
  if (!value || typeof value !== "object") return false
  const w = value as Record<string, unknown>
  return (
    w.version === 1 &&
    typeof w.id === "string" &&
    typeof w.createdAt === "string" &&
    !Number.isNaN(Date.parse(w.createdAt)) &&
    isWorkoutProfile(w.profile) &&
    Array.isArray(w.days) &&
    w.days.length >= 1 &&
    w.days.length <= 6 &&
    w.days.every(
      (d) =>
        !!d &&
        typeof d === "object" &&
        typeof (d as GeneratedDay).title === "string" &&
        Array.isArray((d as GeneratedDay).exercises) &&
        (d as GeneratedDay).exercises.length <= MAX_PER_DAY &&
        (d as GeneratedDay).exercises.every((e) => !!e && isExerciseId(e.id))
    )
  )
}

// Ao carregar do aparelho, nome e grupo vêm sempre do catálogo atual.
export function normalizeWorkout(workout: GeneratedWorkout): GeneratedWorkout {
  return {
    ...workout,
    days: workout.days.map((d) => ({ ...d, exercises: d.exercises.map((e) => toGenerated(getExercise(e.id))) })),
  }
}

// Números digitados no celular: aceita vírgula ("70,5") e altura em metros ("1,75").
export function parseDecimal(text: string) {
  const cleaned = text.trim().replace(/\s/g, "").replace(",", ".")
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  return Number(cleaned)
}

export function parseHeight(text: string) {
  const value = parseDecimal(text)
  if (value === null) return null
  return value < 3 ? Math.round(value * 100) : Math.round(value)
}
