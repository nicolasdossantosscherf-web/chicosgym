// Conteúdo central do site. Tudo aqui é dado de demonstração (placeholder)
// até a Chico's Gym enviar o material oficial (fotos, tabela de planos,
// nomes/CREF da equipe etc. — ver seção 8 do documento do projeto).
// Trocar um valor aqui já atualiza o site inteiro.

export const brand = {
  name: "Chico's Gym",
  founded: 2022,
  tagline: "Onde disciplina vira resultado.",
  // Frase real da placa de horários na entrada da academia.
  motto: "Disciplina não tem horário, a Chico's Gym também não.",
  logo: "/images/brand/logo.jpg",
  whatsapp: "5555999990000", // placeholder — trocar pelo WhatsApp real
  whatsappDisplay: "(55) 99999-0000",
  email: "contato@chicosgym.com.br",
  address: "Av. Placeholder, 000 — Três de Maio, RS", // trocar pelo endereço real
  // Horários reais, tirados da placa fixada na entrada da academia.
  hours: [
    { label: "Segunda a sexta", value: "05h às 00h (sem fechar ao meio-dia)" },
    { label: "Sábados e feriados", value: "09h-12h e 15h-18h" },
    { label: "Domingos", value: "16h-19h" },
  ],
  socials: [
    { label: "Instagram", href: "#", icon: "Camera" },
    { label: "TikTok", href: "#", icon: "Music2" },
    { label: "Google", href: "#", icon: "Star" },
  ],
}

export type SitePage = {
  href: string
  label: string
  description: string
  icon: string
  image?: string
}

// Estrutura de páginas do site — usada pelo menu, rodapé e pela grade
// de navegação da Home. Trocar aqui atualiza a navegação inteira.
export const sitePages: SitePage[] = [
  {
    href: "/historia",
    label: "Nossa História",
    description: "De galpão abandonado a referência da região, ano a ano.",
    icon: "History",
  },
  {
    href: "/academia",
    label: "A Academia",
    description: "Conheça o espaço: piso de treino, cardio, musculação e spinning.",
    icon: "Building2",
    image: "/images/tour/piso-treino.jpg",
  },
  {
    href: "/equipe",
    label: "Equipe",
    description: "Os profissionais que treinam junto com você todos os dias.",
    icon: "Users",
  },
  {
    href: "/modalidades",
    label: "Modalidades",
    description: "Musculação, funcional, spinning, cardio e mais.",
    icon: "Dumbbell",
  },
  {
    href: "/maquinas",
    label: "Máquinas",
    description: "Catálogo de equipamentos por grupo muscular, com dicas de uso.",
    icon: "LayoutGrid",
  },
  {
    href: "/treino",
    label: "Monte seu Treino",
    description: "Responda 3 perguntas e receba uma sugestão de treino na hora.",
    icon: "Wand2",
  },
  {
    href: "/loja",
    label: "Loja",
    description: "Suplementos, vestuário e acessórios da Chico's Gym.",
    icon: "ShoppingBag",
  },
  {
    href: "/planos",
    label: "Planos e Serviços",
    description: "Compare os planos e veja quanto você economiza.",
    icon: "Wallet",
  },
  {
    href: "/local",
    label: "Local e Horários",
    description: "Endereço, mapa e horário de funcionamento da Chico's Gym.",
    icon: "MapPin",
  },
  {
    href: "/contato",
    label: "Contato",
    description: "Um jeito rápido de falar com a gente e tirar dúvidas.",
    icon: "MessageCircle",
  },
]

export const stats = [
  { value: 4, suffix: "+", label: "Anos de história" },
  { value: 800, suffix: "+", label: "Alunos ativos" },
  { value: 7, suffix: "", label: "Modalidades" },
  { value: 4.9, suffix: "", label: "Avaliação no Google", decimals: 1 },
]

export type TourArea = {
  id: string
  title: string
  description: string
  equipment: string[]
  image?: string
}

export const tourAreas: TourArea[] = [
  {
    id: "fachada",
    title: "Fachada",
    description:
      "Letreiro circular iluminado e entrada com grama sintética — o cartão de visitas da Chico's Gym.",
    equipment: ["Letreiro luminoso", "Recepção", "Estacionamento"],
    image: "/images/tour/fachada.jpg",
  },
  {
    id: "piso-treino",
    title: "Piso de Treino",
    description:
      "Pé-direito alto, galpão industrial pintado de preto e iluminação em losango guiando o espaço inteiro.",
    equipment: ["Racks", "Halteres", "Estações de força", "Piso emborrachado"],
    image: "/images/tour/piso-treino.jpg",
  },
  {
    id: "cardio-musculacao",
    title: "Cardio & Musculação",
    description: "Esteiras, bikes e máquinas de musculação lado a lado, em layout de circuito.",
    equipment: ["Esteiras", "Bikes ergométricas", "Estações de força", "Leg press"],
    image: "/images/tour/cardio-musculacao.jpg",
  },
  {
    id: "spinning",
    title: "Spinning",
    description: "Bikes de spinning sob a mesma iluminação cênica em losango do restante da academia.",
    equipment: ["Bikes de spinning", "Iluminação cênica"],
    image: "/images/tour/spinning.jpg",
  },
  {
    id: "peso-livre",
    title: "Peso Livre",
    description: "Barras, anilhas e halteres organizados por faixa de peso para treino livre.",
    equipment: ["Barras olímpicas", "Anilhas", "Kettlebells"],
  },
  {
    id: "vestiarios",
    title: "Vestiários",
    description: "Armários individuais e acabamento em concreto e metal, no mesmo padrão do resto da academia.",
    equipment: ["Armários", "Chuveiros"],
  },
]

export type TimelineItem = {
  year: string
  title: string
  description: string
}

export const timeline: TimelineItem[] = [
  {
    year: "2022",
    title: "Fundação",
    description:
      "O Chico transforma um galpão industrial abandonado na primeira unidade da Chico's Gym, com musculação e funcional.",
  },
  {
    year: "2023",
    title: "Expansão do parque",
    description: "Chegada da sala de spinning e ampliação do parque de máquinas e cardio.",
  },
  {
    year: "2024",
    title: "Área externa",
    description: "Inauguração da área externa com grama sintética e estrutura de treino funcional ao ar livre.",
  },
  {
    year: "2025",
    title: "Equipe completa",
    description: "Formação do time de personal trainers e início da parceria com nutricionista.",
  },
  {
    year: "2026",
    title: "Chico's Gym no digital",
    description: "Início da parceria com a Nicolas Code para levar a experiência da academia para o digital.",
  },
]

export type TeamMember = {
  id: string
  name: string
  role: string
  specialty: string
  cref?: string
  image?: string
}

export const team: TeamMember[] = [
  {
    id: "chico",
    name: 'Francisco "Chico" Almeida',
    role: "Fundador & Head Coach",
    specialty: "Musculação e Powerlifting",
  },
  {
    id: "bruno",
    name: "Bruno Ramires",
    role: "Personal Trainer",
    specialty: "Treino Funcional e HIIT",
  },
  {
    id: "camila",
    name: "Camila Duarte",
    role: "Personal Trainer",
    specialty: "Spinning e Condicionamento",
  },
  {
    id: "rafael",
    name: "Rafael Costa",
    role: "Personal Trainer",
    specialty: "Musculação e Hipertrofia",
  },
]

export type ServiceItem = {
  id: string
  title: string
  description: string
  icon: string // nome do ícone lucide-react
}

export const services: ServiceItem[] = [
  { id: "musculacao", title: "Musculação", description: "Parque completo de máquinas e peso livre.", icon: "Dumbbell" },
  { id: "funcional", title: "Treino Funcional", description: "Aulas em grupo de alta intensidade.", icon: "Flame" },
  { id: "spinning", title: "Spinning", description: "Aulas cênicas com música e iluminação imersiva.", icon: "Bike" },
  { id: "cardio", title: "Cardio", description: "Esteiras, bikes e elípticos de última geração.", icon: "HeartPulse" },
  { id: "avaliacao", title: "Avaliação Física", description: "Diagnóstico completo antes de começar.", icon: "ClipboardCheck" },
  { id: "personal", title: "Personal Trainer", description: "Acompanhamento individual dedicado.", icon: "UserCheck" },
  { id: "nutricao", title: "Nutrição Parceira", description: "Rede de nutricionistas parceiros.", icon: "Apple" },
]

export type Plan = {
  id: string
  label: string
  months: number
  monthlyPrice: number
  highlight?: boolean
  features: string[]
}

// Valores placeholder — aguardando tabela oficial da Chico's Gym (seção 8 do documento).
export const plans: Plan[] = [
  {
    id: "mensal",
    label: "Mensal",
    months: 1,
    monthlyPrice: 129.9,
    features: ["Acesso completo à academia", "App de treino", "Avaliação física inicial"],
  },
  {
    id: "trimestral",
    label: "Trimestral",
    months: 3,
    monthlyPrice: 114.9,
    features: ["Tudo do plano mensal", "1 aula experimental de spinning", "Congelamento de 7 dias"],
  },
  {
    id: "semestral",
    label: "Semestral",
    months: 6,
    monthlyPrice: 104.9,
    highlight: true,
    features: ["Tudo do plano trimestral", "Reavaliação física a cada 60 dias", "Congelamento de 15 dias"],
  },
  {
    id: "anual",
    label: "Anual",
    months: 12,
    monthlyPrice: 89.9,
    features: ["Tudo do plano semestral", "2 convites mensais para amigos", "Congelamento de 30 dias"],
  },
]

export type Product = {
  id: string
  title: string
  category: string
  price: string
}

export const products: Product[] = [
  { id: "whey", title: "Whey Protein 900g", category: "Suplementos", price: "R$ 149,90" },
  { id: "creatina", title: "Creatina 300g", category: "Suplementos", price: "R$ 79,90" },
  { id: "camiseta", title: "Camiseta Chico's Gym", category: "Vestuário", price: "R$ 69,90" },
  { id: "coqueteleira", title: "Coqueteleira 600ml", category: "Acessórios", price: "R$ 34,90" },
  { id: "garrafa", title: "Garrafa Térmica 1L", category: "Acessórios", price: "R$ 59,90" },
]

export type Testimonial = {
  name: string
  since: string
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: "Marcos Vinícius",
    since: "aluno desde 2023",
    quote: "Entrei tímido e hoje treino pesado. A estrutura e o clima da Chico's Gym fazem toda a diferença.",
  },
  {
    name: "Juliana Prado",
    since: "aluna desde 2024",
    quote: "As aulas de spinning à noite, com aquela luz em losango, viraram meu horário favorito do dia.",
  },
  {
    name: "Diego Fontana",
    since: "aluno desde 2022",
    quote: "Acompanho a Chico's Gym desde o primeiro mês aberta. O crescimento da estrutura é visível.",
  },
]

export type Machine = {
  id: string
  name: string
  category: "Superior" | "Inferior" | "Core" | "Cardio" | "Peso Livre"
  muscle: string
  tip: string
  image?: string
}

export const machineCategories = ["Superior", "Inferior", "Core", "Cardio", "Peso Livre"] as const

// Catálogo de equipamentos — nomes e descrições genéricas de um parque de
// musculação padrão. Ainda sem foto real de cada máquina da Chico's Gym.
export const machines: Machine[] = [
  { id: "supino-maquina", name: "Supino Máquina", category: "Superior", muscle: "Peitoral", tip: "Mantenha os ombros para trás e desça até a altura do peito, sem travar o cotovelo no topo." },
  { id: "puxada-alta", name: "Puxada Alta (Pulley)", category: "Superior", muscle: "Costas", tip: "Puxe levando os cotovelos para baixo e para trás, sem balançar o tronco." },
  { id: "desenvolvimento-ombros", name: "Desenvolvimento de Ombros", category: "Superior", muscle: "Ombros", tip: "Empurre o peso sem hiperestender a lombar; controle a descida." },
  { id: "remada-baixa", name: "Remada Baixa", category: "Superior", muscle: "Costas", tip: "Coluna neutra, puxando o cabo até o abdômen e apertando as escápulas." },
  { id: "rosca-biceps", name: "Rosca Direta", category: "Superior", muscle: "Bíceps", tip: "Evite balançar o corpo — o movimento deve vir só do cotovelo." },
  { id: "triceps-pulley", name: "Tríceps Pulley", category: "Superior", muscle: "Tríceps", tip: "Cotovelos fixos ao lado do corpo durante toda a extensão." },
  { id: "leg-press", name: "Leg Press 45°", category: "Inferior", muscle: "Quadríceps e Glúteos", tip: "Não trave os joelhos no topo; pés na largura dos ombros." },
  { id: "cadeira-extensora", name: "Cadeira Extensora", category: "Inferior", muscle: "Quadríceps", tip: "Suba controlado e pause um instante no topo antes de descer." },
  { id: "mesa-flexora", name: "Mesa Flexora", category: "Inferior", muscle: "Posterior de Coxa", tip: "Evite elevar o quadril do banco durante a flexão." },
  { id: "cadeira-abdutora", name: "Cadeira Abdutora", category: "Inferior", muscle: "Glúteos", tip: "Movimento controlado, sem usar impulso do tronco." },
  { id: "panturrilha-em-pe", name: "Panturrilha em Pé", category: "Inferior", muscle: "Panturrilha", tip: "Amplitude completa: alongue bem embaixo e suba até a ponta do pé." },
  { id: "banco-abdominal", name: "Banco Abdominal", category: "Core", muscle: "Abdômen", tip: "O movimento vem do tronco, não do pescoço." },
  { id: "mesa-lombar", name: "Mesa Lombar", category: "Core", muscle: "Lombar", tip: "Suba até alinhar a coluna, sem hiperestender além da linha reta." },
  { id: "esteira", name: "Esteira", category: "Cardio", muscle: "Cardiovascular", tip: "Comece com 3-5 min de caminhada leve antes de acelerar o ritmo." },
  { id: "bike-ergometrica", name: "Bike Ergométrica", category: "Cardio", muscle: "Cardiovascular", tip: "Ajuste o banco na altura do quadril para não sobrecarregar o joelho." },
  { id: "eliptico", name: "Elíptico", category: "Cardio", muscle: "Cardiovascular", tip: "Postura ereta, apoiando pouco peso nos braços." },
  { id: "barra-livre", name: "Barra Olímpica", category: "Peso Livre", muscle: "Corpo todo", tip: "Em agachamento e levantamento terra, mantenha a coluna neutra do início ao fim." },
  { id: "halteres", name: "Halteres", category: "Peso Livre", muscle: "Corpo todo", tip: "Escolha uma carga em que as últimas repetições fiquem desafiadoras, mas com boa execução." },
]

export type MuscleGroup = "peito" | "costas" | "pernas" | "ombros" | "bracos" | "core" | "cardio"

export type WorkoutExercise = { name: string; group: MuscleGroup }

// Banco de exercícios usado pelo gerador de "Monte seu Treino" — a lógica de
// montagem do treino fica em components/workout-builder.tsx.
export const exercisePool: WorkoutExercise[] = [
  { name: "Supino reto", group: "peito" },
  { name: "Supino inclinado", group: "peito" },
  { name: "Crucifixo", group: "peito" },
  { name: "Puxada alta", group: "costas" },
  { name: "Remada baixa", group: "costas" },
  { name: "Remada curvada", group: "costas" },
  { name: "Agachamento", group: "pernas" },
  { name: "Leg press", group: "pernas" },
  { name: "Cadeira extensora", group: "pernas" },
  { name: "Mesa flexora", group: "pernas" },
  { name: "Panturrilha em pé", group: "pernas" },
  { name: "Desenvolvimento de ombros", group: "ombros" },
  { name: "Elevação lateral", group: "ombros" },
  { name: "Rosca direta", group: "bracos" },
  { name: "Tríceps pulley", group: "bracos" },
  { name: "Prancha", group: "core" },
  { name: "Abdominal supra", group: "core" },
  { name: "Esteira ou bike", group: "cardio" },
]

export type FaqItem = { question: string; answer: string }

export const faqs: FaqItem[] = [
  {
    question: "Preciso pagar taxa de adesão?",
    answer: "Depende do plano escolhido — confira as condições na página de Planos ou fale com a recepção antes de matricular.",
  },
  {
    question: "Os planos têm fidelidade?",
    answer:
      "O plano mensal não tem fidelidade. Trimestral, semestral e anual seguem o período do próprio contrato, com condições de cancelamento previstas nele.",
  },
  {
    question: "Posso congelar minha matrícula?",
    answer: "Sim — cada plano inclui um número de dias de congelamento (veja em Planos). Dias extras podem ser negociados na recepção.",
  },
  {
    question: "O que levar no primeiro dia?",
    answer: "Roupa de treino, tênis fechado, garrafa de água e uma toalha. Chegue 15 minutos antes para fazer seu cadastro.",
  },
  {
    question: "Tem horário de pico?",
    answer: "Geralmente entre 18h e 20h. Se prefere mais espaço, manhã e início de tarde costumam ser mais tranquilos.",
  },
  {
    question: "O personal trainer está incluso na mensalidade?",
    answer: "A avaliação física inicial está inclusa em todos os planos. Acompanhamento contínuo com personal trainer é um serviço à parte — fale com a equipe.",
  },
]

export type ScheduleSlot = { day: string; time: string; modality: string }

// Grade de horários — ainda um modelo de referência, não a grade oficial da
// Chico's Gym. Ajustar aqui assim que a academia confirmar os horários reais.
export const classSchedule: ScheduleSlot[] = [
  { day: "Segunda", time: "06h00", modality: "Spinning" },
  { day: "Segunda", time: "19h00", modality: "Funcional" },
  { day: "Terça", time: "07h00", modality: "Funcional" },
  { day: "Terça", time: "18h30", modality: "Spinning" },
  { day: "Quarta", time: "06h00", modality: "Spinning" },
  { day: "Quarta", time: "19h00", modality: "Funcional" },
  { day: "Quinta", time: "07h00", modality: "Funcional" },
  { day: "Quinta", time: "18h30", modality: "Spinning" },
  { day: "Sexta", time: "06h00", modality: "Spinning" },
  { day: "Sábado", time: "09h30", modality: "Funcional" },
]

export type ResultItem = { id: string; caption: string; image?: string }

export const results: ResultItem[] = [
  { id: "r1", caption: "Transformações da nossa comunidade" },
  { id: "r2", caption: "Resultado de quem treina sério" },
  { id: "r3", caption: "Antes e depois dos nossos alunos" },
  { id: "r4", caption: "Histórias reais, em breve aqui" },
]
