// Conteúdo central do site. Tudo aqui é dado de demonstração (placeholder)
// até a Chico's Gym enviar o material oficial (fotos, tabela de planos,
// nomes/CREF da equipe etc. — ver seção 8 do documento do projeto).
// Trocar um valor aqui já atualiza o site inteiro.

export const brand = {
  name: "Chico's Gym",
  founded: 2022,
  tagline: "Treine na escuridão. Evolua na luz.",
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
    href: "/academia",
    label: "A Academia",
    description: "Conheça o espaço: piso de treino, cardio, musculação e spinning.",
    icon: "Building2",
    image: "/images/tour/piso-treino.jpg",
  },
  {
    href: "/historia",
    label: "Nossa História",
    description: "De galpão abandonado a referência da região, ano a ano.",
    icon: "History",
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
    href: "/planos",
    label: "Planos",
    description: "Compare os planos e veja quanto você economiza.",
    icon: "Wallet",
  },
  {
    href: "/loja",
    label: "Loja",
    description: "Suplementos, vestuário e acessórios da Chico's Gym.",
    icon: "ShoppingBag",
  },
  {
    href: "/contato",
    label: "Contato",
    description: "Endereço, horários e um jeito rápido de falar com a gente.",
    icon: "MapPin",
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
