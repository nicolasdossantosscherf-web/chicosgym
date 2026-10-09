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
  // Versão branca com fundo transparente, para usar sobre fundo preto (ex.: página /qr).
  logoWhite: "/images/brand/logo-branca.png",
  whatsapp: "5555999470965",
  whatsappDisplay: "(55) 9 9947-0965",
  email: "chicosgymtm@gmail.com",
  // Endereço real, confirmado pela academia — "ao lado da Trapus" é o ponto de referência que eles mesmos usam.
  address: "Rua Rio de Janeiro, 192, Centro, Três de Maio - RS, 98910-000 (ao lado da Trapus)",
  // Horários reais, tirados da placa fixada na entrada da academia.
  hours: [
    { label: "Segunda a sexta", times: ["05h às 00h"], note: "Sem fechar ao meio-dia" },
    { label: "Sábados e feriados", times: ["09h às 12h", "15h às 18h"] },
    { label: "Domingos", times: ["16h às 19h"] },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/_chicosgym", icon: "Camera" },
  ],
  // Abre direto a caixa de avaliação do perfil oficial no Google (R. Rio de Janeiro, 192).
  // Existe um segundo perfil "Chico's Gym" na R. Teresa Verzeri, sem avaliações — não é este.
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJzQSll3JT-ZQRKvja3NBsOCc",
}

// Wi-Fi mostrado na página /qr (o QR Code dos cartazes da academia). Mesma rede e
// senha do cartaz de Wi-Fi que já fica na parede, então a senha é pública. Se a
// academia trocar a senha, atualizar aqui. Vazio = a página manda pedir na recepção.
export const guestWifi = {
  network: "Chico´s Gym",
  password: "12345678",
}

export type SitePage = {
  href: string
  label: string
  description: string
  icon: string
}

// Estrutura de páginas do site — usada pelo menu, rodapé e pela grade
// de navegação da Home. Trocar aqui atualiza a navegação inteira.
export const sitePages: SitePage[] = [
  {
    href: "/historia",
    label: "Nossa História",
    description: "A trajetória da Chico's Gym desde 2022 — em breve, contada por quem fez acontecer.",
    icon: "History",
  },
  {
    href: "/equipe",
    label: "Equipe",
    description: "Os profissionais que treinam junto com você todos os dias.",
    icon: "Users",
  },
  {
    href: "/treino",
    label: "Descubra seu Treino",
    description: "Responda 5 perguntas e receba a ficha de treino da Chico's Gym ideal pra você.",
    icon: "Dumbbell",
  },
  {
    href: "/loja",
    label: "Loja",
    description: "Produtos da Chico's Gym à venda na academia.",
    icon: "ShoppingBag",
  },
  {
    href: "/planos",
    label: "Planos e Serviços",
    description: "Compare os planos e conheça os serviços extras da academia.",
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
  {
    href: "/parcerias",
    label: "Parcerias",
    description: "Wizard, massoterapeuta e nutricionista, com condições especiais pra alunos.",
    icon: "Handshake",
  },
]

export const stats = [
  { value: 4, suffix: "+", label: "Anos de história" },
  { value: 303, suffix: "", label: "Alunos ativos" },
  { value: 5, suffix: "", label: "Avaliação no Google", decimals: 1 },
]

export type TimelineItem = {
  year: string
  title: string
  description: string
}

// A história oficial ainda está sendo escrita pela academia. Enquanto a lista
// estiver vazia, a página Nossa História mostra o aviso "em construção".
export const timeline: TimelineItem[] = []

export type TeamMember = {
  id: string
  name: string
  role: string
  description?: string
  cref?: string
  image?: string
}

// Equipe real, enviada pela Chico's Gym. As imagens são ilustrações
// provisórias até chegarem as fotos de cada um.
export const team: TeamMember[] = [
  {
    id: "charles-kercher",
    name: "Charles Kercher",
    role: "Instrutor / Treinador",
    cref: "CREF 041241-G/RS",
    description: "Atendimento geral na academia, instrução de alunos e personal.",
    image: "/images/team/charles-kercher.webp",
  },
  {
    id: "julie-lima",
    name: "Julie Lima",
    role: "Secretária",
    description: "Atende na recepção e auxilia os alunos que precisam de ajuda.",
    image: "/images/team/julie-lima.webp",
  },
  {
    id: "alecsander-muriel",
    name: "Alecsander Muriel",
    role: "Atendente geral",
    description: "Atende na recepção e auxilia os alunos que precisam de ajuda.",
    image: "/images/team/alecsander-muriel.webp",
  },
  {
    id: "vitor-magalhaes",
    name: "Vitor Magalhães",
    role: "Estagiário de Educação Física",
    image: "/images/team/vitor-magalhaes.webp",
  },
  {
    id: "jean-schiavi",
    name: "Jean Schiavi",
    role: "Gerente",
    description: "Atendimentos, serviços gerais e instrução de alunos.",
    image: "/images/team/jean-schiavi.webp",
  },
  {
    id: "samuel-retore",
    name: "Samuel Retore",
    role: "Gerente",
    description: "Responsável pela administração e pelo financeiro da academia.",
    image: "/images/team/samuel-retore.webp",
  },
]

export type Plan = {
  id: string
  label: string
  months: number
  monthlyPrice: number
  highlight?: boolean
  features: string[]
}

// Primeiro card da página de planos; não entra no cálculo de economia dos planos.
export const trialClass = {
  label: "Aula experimental",
  features: ["Totalmente gratuita", "Sem compromisso de matrícula", "Conheça a estrutura e a equipe"],
}

// Tabela real, confirmada pela Chico's Gym.
export const plans: Plan[] = [
  {
    id: "mensal",
    label: "Mensal",
    months: 1,
    monthlyPrice: 150,
    features: ["Renova todo mês", "Sem taxa de matrícula", "Acesso completo à academia"],
  },
  {
    id: "semestral",
    label: "Semestral",
    months: 6,
    monthlyPrice: 135,
    features: ["Sem taxa de matrícula", "Acesso completo à academia"],
  },
  {
    id: "anual",
    label: "Anual",
    months: 12,
    monthlyPrice: 120,
    highlight: true,
    features: ["Sem taxa de matrícula", "Acesso completo à academia"],
  },
  {
    id: "grupo",
    label: "Grupo",
    months: 12,
    monthlyPrice: 100,
    features: ["Valor por pessoa, em grupos de 3", "Sem taxa de matrícula", "Acesso completo à academia"],
  },
]

export type Partner = {
  id: string
  name: string
  role: string
  registry?: string
  // Cartaz de divulgação da parceria (com as dimensões reais, pra não cortar o texto).
  image?: { src: string; width: number; height: number }
  logo?: string
  description?: string
  highlights?: string[]
  benefit?: string
  schedule?: string
  instagram?: string
  // Profissional com agenda: o botão vira "Agendar pelo WhatsApp".
  bookable?: boolean
}

// Parcerias confirmadas pela Chico's Gym. Os dados dos profissionais vêm dos
// cartazes de divulgação enviados pela academia.
export const partners: Partner[] = [
  {
    id: "wizard",
    name: "Wizard by Pearson",
    role: "Escola de idiomas",
    logo: "/images/partners/wizard.png",
    description: "Detalhes da parceria em breve.",
  },
  {
    id: "felipe-farias",
    name: "Felipe Farias",
    role: "Massoterapeuta",
    image: { src: "/images/partners/felipe-farias.webp", width: 1254, height: 1254 },
    highlights: ["Tratamento da dor", "Massoterapia", "Liberação miofascial", "Ventosaterapia"],
    benefit: "Alunos da academia têm desconto nas sessões e a 1ª avaliação é gratuita.",
    schedule: "Atendimentos presenciais na academia.",
    instagram: "felipefarias_neto",
    bookable: true,
  },
  {
    id: "maura-dupont",
    name: "Maura Dupont de Oliveira",
    role: "Nutricionista",
    registry: "CRN2 18612D",
    image: { src: "/images/partners/maura-dupont.webp", width: 1122, height: 1402 },
    highlights: ["Especializada em nutrição esportiva", "Pós-graduada em fisiologia do exercício"],
    benefit: "Alunos da Chico's Gym têm desconto nas consultas.",
    schedule: "Atendimentos aos sábados de manhã, na academia.",
    bookable: true,
  },
]

export type GymService = {
  id: string
  title: string
  description: string
  icon: string // nome do ícone lucide-react
  // Quando o serviço é feito por um parceiro, o card leva pra página de parcerias.
  partnerId?: string
}

// Serviços extras da academia (página Planos e Serviços), enviados pela Chico's Gym.
export const gymServices: GymService[] = [
  {
    id: "avaliacao-fisica",
    title: "1ª avaliação física grátis",
    description: "Sua primeira avaliação física na academia é por nossa conta.",
    icon: "ClipboardCheck",
  },
  {
    id: "nutricionista",
    title: "Nutricionista",
    description: "Maura Dupont de Oliveira, especializada em nutrição esportiva. Alunos têm desconto nas consultas.",
    icon: "Apple",
    partnerId: "maura-dupont",
  },
  {
    id: "massoterapeuta",
    title: "Massoterapeuta",
    description: "Felipe Farias: tratamento da dor, massoterapia, liberação miofascial e ventosaterapia, com desconto pra alunos.",
    icon: "HandHeart",
    partnerId: "felipe-farias",
  },
  {
    id: "personal",
    title: "Personal",
    description: "Acompanhamento individual no seu treino, com a equipe da academia.",
    icon: "UserCheck",
  },
]

export type ProductVariant = {
  id: string
  label: string
  swatch: string
  // Foto própria dessa variação (troca a foto do card ao selecionar).
  image?: string
  // Posição (0 = mais à esquerda) dessa variação na foto do produto, quando
  // a foto mostra todas lado a lado — ver Product.imageSlots.
  imageSlot?: number
}

export type Product = {
  id: string
  title: string
  category: string
  description?: string
  image?: string
  // Preço à vista / Pix.
  price: number
  // Preço parcelado — quando existe, o card deixa o cliente escolher entre os dois.
  priceInstallments?: number
  // Quantos itens aparecem lado a lado na foto (pra destacar a variação escolhida).
  imageSlots?: number
  // Largura relativa de cada item na foto, quando eles não ocupam faixas iguais.
  imageSlotWidths?: number[]
  // Ex.: "Cor", "Sabor".
  variantLabel?: string
  variants?: ProductVariant[]
}

// Formas de pagamento aceitas na loja. Só o cartão de crédito usa o preço
// parcelado do produto; as outras usam o preço à vista.
export const shopPaymentMethods = [
  { id: "pix", label: "Pix", installments: false },
  { id: "credito", label: "Cartão de crédito (parcelado)", installments: true },
  { id: "debito", label: "Cartão de débito", installments: false },
  { id: "dinheiro", label: "Dinheiro", installments: false },
] as const

export type ShopPaymentMethodId = (typeof shopPaymentMethods)[number]["id"]

// Produtos reais à venda na academia, enviados pela Chico's Gym.
export const products: Product[] = [
  {
    id: "garrafa-inteligente",
    title: "Garrafa Inteligente",
    category: "Acessórios",
    description: "500 ml, com a logo da Chico's Gym gravada.",
    image: "/images/shop/garrafa-inteligente.webp",
    price: 85.9,
    priceInstallments: 99.9,
    imageSlots: 2,
    variantLabel: "Cor",
    variants: [
      { id: "preto", label: "Preto", swatch: "#111111", imageSlot: 0 },
      { id: "branco", label: "Branco", swatch: "#f2f2f2", imageSlot: 1 },
    ],
  },
  {
    id: "sache-panic",
    title: "Sachê Pré-Treino Panic",
    category: "Suplementos",
    description: "Adaptogen Science · dose única de 10 g · sabor maçã verde.",
    image: "/images/shop/sache-panic.webp",
    price: 10,
  },
  {
    id: "sache-dila-pump",
    title: "Sachê Pré-Treino Dila Pump",
    category: "Suplementos",
    description: "Sem cafeína · Adaptogen Science · sachê de 10,6 g · sabor kiwi.",
    image: "/images/shop/sache-dila-pump.webp",
    price: 10,
  },
  {
    id: "dose-whey-joypro",
    title: "Dose de Whey JoyPro",
    category: "Suplementos",
    description: "Shark Pro · sachê de 33 g.",
    image: "/images/shop/dose-whey-joypro.webp",
    price: 15,
    imageSlots: 2,
    variantLabel: "Sabor",
    variants: [
      { id: "brigadeiro", label: "Brigadeiro", swatch: "#6b3e2e", imageSlot: 0 },
      { id: "morango-framboesa", label: "Iogurte de morango com framboesa", swatch: "#e2383f", imageSlot: 1 },
    ],
  },
  {
    id: "energetico-fire-night",
    title: "Energético Fire Night",
    category: "Bebidas",
    description: "Lata de 473 ml.",
    image: "/images/shop/energetico-fire-night.webp",
    price: 10,
    variantLabel: "Sabor",
    variants: [
      { id: "original", label: "Original", swatch: "#e0283a" },
      { id: "original-zero", label: "Original Zero Açúcar", swatch: "#f2f2f2" },
      { id: "limonada-zero", label: "Limonada Zero Açúcar", swatch: "#2d4fa8" },
      { id: "extreme", label: "Extreme", swatch: "#1a1a1a" },
      { id: "melancia", label: "Melancia", swatch: "#f0445a" },
      { id: "tropical", label: "Tropical", swatch: "#f7d417" },
      { id: "pera", label: "Pera", swatch: "#e6e86a" },
      { id: "maca-verde", label: "Maçã Verde", swatch: "#6cc93a" },
      { id: "banana", label: "Banana", swatch: "#f3b23a" },
    ],
  },
  {
    id: "hipercalorico-shark-mass",
    title: "Hipercalórico Shark Mass",
    category: "Suplementos",
    description: "Shark Pro · 3 kg · sabor chocolate.",
    image: "/images/shop/hipercalorico-shark-mass.webp",
    price: 149.9,
    priceInstallments: 169.9,
  },
  {
    id: "whey-high-protein",
    title: "Whey High Protein",
    category: "Suplementos",
    description: "Absolut Nutrition · 900 g · sabor chocolate · sem soja.",
    image: "/images/shop/whey-high-protein.webp",
    price: 119.9,
    priceInstallments: 139.9,
  },
  {
    id: "whey-joypro-900",
    title: "Whey JoyPro",
    category: "Suplementos",
    description: "Shark Pro · 900 g · 20 g de proteína por dose · zero glúten · zero adição de açúcar.",
    price: 159.9,
    priceInstallments: 179.9,
    variantLabel: "Sabor",
    variants: [
      { id: "brigadeiro", label: "Brigadeiro", swatch: "#8a4a3c", image: "/images/shop/whey-joypro-brigadeiro.webp" },
      { id: "leite", label: "Leite", swatch: "#f5f5f5", image: "/images/shop/whey-joypro-leite.webp" },
      {
        id: "morango-framboesa",
        label: "Iogurte de morango com framboesa",
        swatch: "#e8405a",
        image: "/images/shop/whey-joypro-morango.webp",
      },
    ],
  },
  {
    id: "energetico-monster",
    title: "Energético Monster",
    category: "Bebidas",
    description: "Ultra Strawberry Dreams · sem açúcar.",
    image: "/images/shop/energetico-monster.webp",
    price: 14,
  },
  {
    id: "pre-treino-agent-orange",
    title: "Pré-Treino Agent Orange",
    category: "Bebidas",
    description: "New Millen · lata de 269 ml · zero açúcar.",
    image: "/images/shop/pre-treino-agent-orange.webp",
    price: 14,
    imageSlots: 2,
    variantLabel: "Sabor",
    variants: [
      { id: "tangerina-morango", label: "Tangerina com morango", swatch: "#f26a1b", imageSlot: 0 },
      { id: "maca-verde", label: "Maçã verde", swatch: "#7cc242", imageSlot: 1 },
    ],
  },
  {
    id: "pre-treino-prohibido-fuel",
    title: "Pré-Treino Prohibido Fuel",
    category: "Bebidas",
    description: "3VS · lata de 473 ml · zero açúcar.",
    image: "/images/shop/pre-treino-prohibido-fuel.webp",
    price: 18,
    imageSlots: 6,
    imageSlotWidths: [257, 190, 175, 185, 190, 283],
    variantLabel: "Sabor",
    variants: [
      { id: "citrus", label: "Citrus", swatch: "#f2d027", imageSlot: 0 },
      { id: "bubble-gum", label: "Bubble Gum", swatch: "#e0457b", imageSlot: 1 },
      { id: "fruit-punch", label: "Fruit Punch", swatch: "#2f8fe0", imageSlot: 2 },
      { id: "cotton-candy", label: "Cotton Candy", swatch: "#f4b3c8", imageSlot: 3 },
      { id: "strawberry-margarita", label: "Strawberry Margarita", swatch: "#f0506e", imageSlot: 4 },
      { id: "green-apple", label: "Green Apple", swatch: "#b5d334", imageSlot: 5 },
    ],
  },
  {
    id: "itts-sero",
    title: "Itts Sero",
    category: "Bebidas",
    description: "Lata de 269 ml · zero açúcar.",
    image: "/images/shop/itts-sero.webp",
    price: 10,
    imageSlots: 3,
    variantLabel: "Sabor",
    variants: [
      { id: "cereja-laranja", label: "Cereja com laranja", swatch: "#c8203a", imageSlot: 0 },
      { id: "manga-pessego", label: "Manga com pêssego", swatch: "#f5c518", imageSlot: 1 },
      { id: "framboesa-limao", label: "Framboesa com limão", swatch: "#d6307a", imageSlot: 2 },
    ],
  },
  {
    id: "isotonico",
    title: "Isotônico",
    category: "Bebidas",
    description: "Garrafa de 500 ml.",
    image: "/images/shop/isotonico.webp",
    price: 10,
    imageSlots: 2,
    variantLabel: "Opção",
    variants: [
      { id: "powerade-frutas-tropicais", label: "Powerade frutas tropicais", swatch: "#e8322b", imageSlot: 0 },
      { id: "gatorade-limao", label: "Gatorade limão", swatch: "#e6ece8", imageSlot: 1 },
    ],
  },
  {
    id: "yopro",
    title: "YoPro",
    category: "Bebidas",
    description: "Danone · shake de 250 ml · 15 g de proteína · zero adição de açúcares.",
    image: "/images/shop/yopro.webp",
    price: 14,
    imageSlots: 2,
    variantLabel: "Sabor",
    variants: [
      { id: "chocolate", label: "Chocolate", swatch: "#7a4a36", imageSlot: 0 },
      { id: "morango", label: "Morango", swatch: "#e0283a", imageSlot: 1 },
    ],
  },
  {
    id: "yopro-recovery-boost",
    title: "YoPro+ Recovery Boost",
    category: "Bebidas",
    description: "Danone · shake de 250 ml · 23 g de proteína · 5 g de BCAAs · sabor chocolate.",
    image: "/images/shop/yopro-recovery-boost.webp",
    price: 17,
  },
  {
    id: "agua-mineral",
    title: "Água Mineral",
    category: "Bebidas",
    description: "Água mineral natural · garrafa de 500 ml.",
    image: "/images/shop/agua-mineral.webp",
    price: 4,
    imageSlots: 2,
    variantLabel: "Tipo",
    variants: [
      { id: "com-gas", label: "Com gás", swatch: "#1d3f8f", imageSlot: 0 },
      { id: "sem-gas", label: "Sem gás", swatch: "#3aa0e0", imageSlot: 1 },
    ],
  },
  {
    id: "creatina-creapepto",
    title: "Creatina Creapepto",
    category: "Suplementos",
    description: "Performance Nutrition · 300 g · 99,9% creatina monoidratada.",
    image: "/images/shop/creatina-creapepto.webp",
    price: 109.9,
    priceInstallments: 119.9,
  },
  {
    id: "pre-treino-insane-clown",
    title: "Pré-Treino Insane Clown",
    category: "Suplementos",
    description: "Demons Lab · 210 g · 30 doses.",
    image: "/images/shop/pre-treino-insane-clown.webp",
    price: 159.9,
    priceInstallments: 179.9,
  },
]

export type Testimonial = {
  name: string
  // Ex.: "aluno desde 2023" — opcional.
  since?: string
  quote: string
}

// Só feedbacks reais de alunos da academia. Enquanto a lista estiver vazia,
// a seção de feedbacks não aparece na página inicial.
export const testimonials: Testimonial[] = [
  {
    name: "Leonardo Leonhardt",
    quote: "Dou nota 10, gosto bastante de treinar e tenho todos os equipamentos/pesos que preciso.",
  },
  {
    name: "Victoria Mendonça",
    quote:
      "Gosto muito de treinar aí! O ambiente é super agradável e os professores/equipe são muito atenciosos. A estrutura e os equipamentos também são excelentes. Parabéns.",
  },
  {
    name: "Lara Sivers",
    quote:
      "Minha experiência na academia tem sido muito boa! Gosto bastante da estrutura e dos equipamentos, e a equipe é atenciosa e prestativa.",
  },
  {
    name: "Vera Santana",
    quote:
      "Minha experiência com a academia tem sido extremamente positiva, desde o primeiro contato para realizar a matrícula até cada dia de treino. Quero destacar a excelente recepção, a cordialidade e a atenção de toda a equipe, que fazem a diferença desde o primeiro momento. O atendimento é acolhedor, organizado e transmite profissionalismo e confiança.",
  },
]

export type FaqItem = { question: string; answer: string }

export const faqs: FaqItem[] = [
  {
    question: "Preciso pagar taxa de adesão?",
    answer: "Não — a Chico's Gym não cobra taxa de matrícula em nenhum plano.",
  },
  {
    question: "Vocês têm parceria com nutricionista e massoterapeuta?",
    answer:
      "Sim — Maura Dupont de Oliveira (nutricionista) e Felipe Farias (massoterapeuta) atendem na própria academia, com desconto pra alunos. Veja os detalhes na página de Parcerias.",
  },
  {
    question: "O personal trainer está incluso na mensalidade?",
    answer: "A avaliação física inicial está inclusa em todos os planos. Acompanhamento contínuo com personal trainer é um serviço à parte — fale com a equipe.",
  },
]

export type ResultItem = { id: string; caption: string; image?: string }

export const results: ResultItem[] = [
  { id: "r1", caption: "Transformações da nossa comunidade" },
  { id: "r2", caption: "Resultado de quem treina sério" },
  { id: "r3", caption: "Antes e depois dos nossos alunos" },
  { id: "r4", caption: "Histórias reais, em breve aqui" },
]
