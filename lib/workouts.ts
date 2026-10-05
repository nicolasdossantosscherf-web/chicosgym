// Fichas oficiais de treino da Chico's Gym, transcritas dos cartazes da
// academia (montados pelos profissionais com CREF). Exercícios, séries e
// repetições estão exatamente como nos cartazes — só as abreviações
// ("Agacha. hack", "Poster. ombro"…) foram escritas por extenso.

export type WorkoutSex = "feminino" | "masculino"
export type WorkoutFrequency = 3 | 4 | 5

export type WorkoutExercise = { name: string; sets: number; reps: string }
export type WorkoutDay = { focus: string; exercises: WorkoutExercise[] }
export type WorkoutPlan = { sex: WorkoutSex; frequency: WorkoutFrequency; days: WorkoutDay[] }

export const WORKOUT_CARDIO = "Bike ou esteira: 20-30 minutos"

// Regras gerais definidas pela academia, valem para todas as fichas.
export const WORKOUT_WARMUP =
  "A 1ª série de cada exercício é sempre com pouca carga, só pra aquecer o músculo e preparar para as séries válidas."
export const WORKOUT_REST = "2 minutos de descanso entre cada série e entre um exercício e outro."

// Todos os cartazes usam 4 séries de 10 a 12 repetições.
const ex = (...names: string[]): WorkoutExercise[] => names.map((name) => ({ name, sets: 4, reps: "10-12" }))

export const workoutPlans: WorkoutPlan[] = [
  {
    sex: "feminino",
    frequency: 3,
    days: [
      {
        focus: "Quadríceps",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Mesa flexora", "Cadeira flexora", "Panturrilha"),
      },
      {
        focus: "Superiores",
        exercises: ex(
          "Puxada alta",
          "Remadas",
          "Posterior ombro",
          "Elevação lateral",
          "Voador",
          "Desenvolvimento",
          "Tríceps/Bíceps"
        ),
      },
      {
        focus: "Glúteo/Posterior",
        exercises: ex("Elevação pélvica", "Afundo", "Agachamento", "Stiff", "Cadeira abdutora", "Coice polia/máquina"),
      },
    ],
  },
  {
    sex: "feminino",
    frequency: 4,
    days: [
      {
        focus: "Quadríceps",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Mesa flexora", "Cadeira flexora", "Panturrilha"),
      },
      {
        focus: "Costas/Bíceps",
        exercises: ex("Puxada alta", "Remada baixa", "Puxada cavalinho", "Posterior ombro", "Bíceps polia", "Bíceps martelo"),
      },
      {
        focus: "Glúteo/Posterior",
        exercises: ex("Elevação pélvica", "Búlgaro", "Agachamento", "Stiff", "Cadeira abdutora", "Cadeira flexora"),
      },
      {
        focus: "Peito/Tríceps",
        exercises: ex(
          "Voador",
          "Supino inclinado",
          "Desenvolvimento ombro",
          "Elevação frontal",
          "Elevação lateral",
          "Tríceps polia",
          "Tríceps livre"
        ),
      },
    ],
  },
  {
    sex: "feminino",
    frequency: 5,
    days: [
      {
        focus: "Quadríceps",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Cadeira adutora", "Cadeira flexora", "Mesa flexora"),
      },
      {
        focus: "Costas/Bíceps",
        exercises: ex(
          "Puxada alta aberta",
          "Remada baixa",
          "Puxada cavalinho",
          "Posterior ombro",
          "Bíceps polia",
          "Bíceps martelo"
        ),
      },
      {
        focus: "Braços",
        exercises: ex(
          "Desenvolvimento",
          "Elevação lateral",
          "Elevação frontal",
          "Tríceps polia",
          "Tríceps livre",
          "Panturrilha"
        ),
      },
      {
        focus: "Glúteo/Posterior",
        exercises: ex("Elevação pélvica", "Búlgaro", "Agachamento", "Stiff", "Cadeira abdutora", "Coice polia/máquina"),
      },
      {
        // Igual ao cartaz. O título diz "Superior/Peito", mas os exercícios são
        // de perna — aguardando confirmação dos profissionais.
        focus: "Superior/Peito",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Mesa flexora", "Cadeira flexora"),
      },
    ],
  },
  {
    sex: "masculino",
    frequency: 3,
    days: [
      {
        focus: "Peito/Tríceps/Ombro",
        exercises: ex("Crucifixo cross", "Supino inclinado", "Supino reto", "Voador", "Tríceps polia", "Tríceps livre"),
      },
      {
        focus: "Quadríceps/Posterior",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Mesa flexora", "Cadeira flexora", "Panturrilha"),
      },
      {
        focus: "Costas/Braços/Ombro",
        exercises: ex(
          "Puxada alta aberta",
          "Remada baixa",
          "Remada T",
          "Serrote halter",
          "Posterior ombro",
          "Bíceps polia",
          "Bíceps livre"
        ),
      },
    ],
  },
  {
    sex: "masculino",
    frequency: 4,
    days: [
      {
        focus: "Peito/Tríceps",
        exercises: ex("Crucifixo cross", "Supino inclinado", "Supino reto", "Voador", "Tríceps polia", "Tríceps livre"),
      },
      {
        focus: "Costas/Bíceps",
        exercises: ex(
          "Puxada alta",
          "Remada baixa",
          "Remada T",
          "Serrote halter",
          "Posterior ombro",
          "Bíceps polia",
          "Bíceps livre"
        ),
      },
      {
        focus: "Quadríceps",
        exercises: ex("Cadeira extensora", "Leg press", "Agachamento hack", "Cadeira adutora", "Mesa flexora", "Panturrilha"),
      },
      {
        focus: "Braços/Ombro",
        exercises: ex(
          "Desenvolvimento",
          "Elevação lateral",
          "Elevação frontal",
          "Bíceps polia/livre",
          "Tríceps polia/livre"
        ),
      },
    ],
  },
  {
    sex: "masculino",
    frequency: 5,
    days: [
      {
        focus: "Superior",
        exercises: ex(
          "Cross over",
          "Supino inclinado",
          "Puxada alta",
          "Remada baixa",
          "Bíceps livre",
          "Tríceps livre",
          "Elevação lateral"
        ),
      },
      {
        focus: "Inferior",
        exercises: ex("Cadeira extensora", "Agachamento hack", "Mesa flexora", "Cadeira flexora", "Panturrilha"),
      },
      {
        focus: "Superior",
        exercises: ex(
          "Pullover corda",
          "Puxada alta",
          "Remada unilateral",
          "Posterior ombro",
          "Supino reto",
          "Voador",
          "Bíceps livre",
          "Tríceps livre"
        ),
      },
      {
        focus: "Inferior",
        exercises: ex("Agachamento", "Leg press", "Mesa flexora", "Stiff", "Cadeira adutora", "Panturrilha"),
      },
      {
        focus: "Superior",
        exercises: ex(
          "Desenvolvimento",
          "Elevação lateral",
          "Elevação frontal",
          "Bíceps livre",
          "Tríceps livre",
          "Trapézio",
          "Antebraço"
        ),
      },
    ],
  },
]

export function findWorkoutPlan(sex: WorkoutSex, frequency: WorkoutFrequency) {
  return workoutPlans.find((p) => p.sex === sex && p.frequency === frequency)
}

export type WorkoutGoal = "massa" | "emagrecer" | "condicionamento" | "saude"
export type WorkoutExperience = "nunca" | "parei" | "treino"

// Rascunho de orientações (dicas gerais, sem mudar a ficha) — para revisão
// dos profissionais da academia.
export const workoutGoals: { id: WorkoutGoal; label: string; tip: string }[] = [
  {
    id: "massa",
    label: "Ganhar massa muscular",
    tip: "Nas séries válidas (depois da 1ª, de aquecimento), escolha uma carga em que as últimas repetições fiquem difíceis, sem perder a execução. Quando as 12 repetições ficarem fáceis, é hora de aumentar a carga — combine com o instrutor.",
  },
  {
    id: "emagrecer",
    label: "Emagrecer",
    tip: "Não pule o cardio de 20 a 30 minutos na bike ou na esteira: ele faz parte do seu treino. Constância nos dias da semana e alimentação andam juntas — a nutricionista parceira atende na própria academia, com desconto pra alunos.",
  },
  {
    id: "condicionamento",
    label: "Melhorar o condicionamento",
    tip: "Mantenha um ritmo constante entre os exercícios e use o cardio de 20 a 30 minutos pra ganhar fôlego semana a semana.",
  },
  {
    id: "saude",
    label: "Saúde e qualidade de vida",
    tip: "Regularidade vale mais que intensidade: cumprir os dias da semana com boa execução já traz resultado. Respeite seus limites e aumente a carga aos poucos.",
  },
]

export const workoutExperiences: { id: WorkoutExperience; label: string; tip: string }[] = [
  {
    id: "nunca",
    label: "Nunca treinei",
    tip: "Como você está começando, use as primeiras semanas pra aprender a execução de cada exercício com carga leve. Peça ajuda à equipe sempre que for fazer um exercício pela primeira vez — e aproveite a 1ª avaliação física, que é grátis.",
  },
  {
    id: "parei",
    label: "Já treinei, mas parei",
    tip: "Voltando aos treinos, comece com cargas menores do que usava antes e vá subindo aos poucos — o corpo precisa de algumas semanas pra se readaptar.",
  },
  {
    id: "treino",
    label: "Treino atualmente",
    tip: "Use esta ficha como base e ajuste as cargas com o instrutor pra continuar evoluindo.",
  },
]

// Regiões do corpo que a pessoa pode citar ao relatar uma lesão, com as
// palavras que a identificam e os exercícios das fichas que mais exigem
// dela. Texto e nomes comparados sem acento e em minúsculas.
export type InjuryRegion = { id: string; label: string; keywords: string[]; exercises: string[] }

export const injuryRegions: InjuryRegion[] = [
  {
    id: "joelho",
    label: "no joelho",
    keywords: ["joelho", "joelhos", "menisco", "patela", "rotula", "ligamento cruzado", "lca"],
    exercises: ["extensora", "leg press", "hack", "agachamento", "afundo", "bulgaro", "flexora"],
  },
  {
    id: "coluna",
    label: "na coluna/lombar",
    keywords: ["lombar", "coluna", "costas", "hernia", "disco", "ciatico", "lombalgia", "escoliose"],
    exercises: ["stiff", "agachamento", "remada", "serrote", "leg press", "elevacao pelvica"],
  },
  {
    id: "ombro",
    label: "no ombro",
    keywords: ["ombro", "ombros", "manguito", "supraespinhal", "clavicula"],
    exercises: [
      "desenvolvimento",
      "elevacao lateral",
      "elevacao frontal",
      "supino",
      "voador",
      "crucifixo",
      "cross over",
      "pullover",
      "puxada",
      "posterior ombro",
      "trapezio",
    ],
  },
  {
    id: "cotovelo",
    label: "no cotovelo",
    keywords: ["cotovelo", "cotovelos", "epicondilite"],
    exercises: ["biceps", "triceps", "antebraco"],
  },
  {
    id: "punho",
    label: "no punho/mão",
    keywords: ["punho", "punhos", "pulso", "pulsos", "mao", "maos", "dedo", "dedos", "carpo"],
    exercises: ["biceps", "triceps livre", "antebraco", "supino", "desenvolvimento", "serrote"],
  },
  {
    id: "braco",
    label: "no braço",
    keywords: ["braco", "bracos", "biceps", "triceps", "antebraco"],
    exercises: ["biceps", "triceps", "antebraco"],
  },
  {
    id: "peito",
    label: "no peitoral",
    keywords: ["peito", "peitoral"],
    exercises: ["supino", "voador", "crucifixo", "cross over", "pullover"],
  },
  {
    id: "quadril",
    label: "no quadril",
    keywords: ["quadril", "virilha", "bacia", "gluteo", "gluteos"],
    exercises: ["abdutora", "adutora", "elevacao pelvica", "coice", "afundo", "bulgaro", "agachamento", "stiff"],
  },
  {
    id: "posterior",
    label: "na posterior da coxa",
    keywords: ["posterior da coxa", "coxa", "coxas", "isquiotibiais", "isquio"],
    exercises: ["stiff", "flexora"],
  },
  {
    id: "panturrilha",
    label: "na panturrilha",
    keywords: ["panturrilha", "panturrilhas", "batata da perna"],
    exercises: ["panturrilha"],
  },
  {
    id: "tornozelo",
    label: "no tornozelo/pé",
    keywords: ["tornozelo", "tornozelos", "pe", "pes", "calcanhar", "aquiles", "canela", "fascite"],
    exercises: ["panturrilha", "agachamento", "afundo", "bulgaro"],
  },
  {
    id: "pescoco",
    label: "no pescoço",
    keywords: ["pescoco", "cervical", "nuca"],
    exercises: ["trapezio", "desenvolvimento"],
  },
]

export function normalizeText(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

export function detectInjuryRegions(text: string): InjuryRegion[] {
  const normalized = normalizeText(text)
  return injuryRegions.filter((region) =>
    region.keywords.some((keyword) => new RegExp(`(^|[^a-z])${keyword}($|[^a-z])`).test(normalized))
  )
}

export function exerciseRisks(exerciseName: string, regions: InjuryRegion[]) {
  const name = normalizeText(exerciseName)
  return regions.filter((region) => region.exercises.some((keyword) => name.includes(keyword)))
}
