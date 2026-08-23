# Chico's Gym × Nicolas Code

Base do site institucional da Chico's Gym, construída a partir do documento de projeto (seções 1–5): hero cinematográfico em WebGL, scroll suave, identidade visual "losango de luz" e todas as seções do mapa do site (exceto os itens do Pacote Premium — ver "Próximos passos").

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (tokens de tema em `app/globals.css`, sem `tailwind.config`)
- **Three.js + React Three Fiber** — cena WebGL do hero (campo de losangos que "acendem" conforme o scroll, câmera avançando pelo galpão)
- **GSAP (ScrollTrigger) + Lenis** — scroll suave e sincronização de animações
- **Framer Motion** — botões magnéticos
- **lucide-react** — ícones

Tudo respeita `prefers-reduced-motion`: com a preferência ativada, o WebGL do hero é substituído por um gradiente estático e as animações de texto aparecem direto, sem transição.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000` (ou na porta configurada).

## O que já está pronto

- Hero com cena 3D (losangos em grade se acendendo em profundidade conforme o scroll) + título com reveal por caractere
- Barra de estatísticas com contador animado
- **A Academia** — 6 áreas (peso livre, máquinas, cardio, spinning, área externa, vestiários) em cards com efeito de tilt 3D
- **Nossa História** — timeline vertical animada (2022–2026)
- **Equipe** — cards com revelação preto-e-branco → cor no hover
- **Modalidades** — grid de serviços
- **Depoimentos**
- **Planos** — 4 tiers com calculadora de economia automática (compara cada plano com o valor do mensal)
- **Loja** — catálogo inicial que abre o WhatsApp com o produto já identificado na mensagem
- **Contato** — formulário de 3 campos (nome, WhatsApp, objetivo) que monta a mensagem e abre direto no WhatsApp — sem backend necessário
- Botão flutuante de WhatsApp + CTA fixo no header
- Cursor customizado (desktop) e grão cinematográfico sutil sobre a página inteira

## Dados de demonstração — trocar antes de publicar

Todo o conteúdo do site vem de **`lib/data.ts`**. Editar um valor ali atualiza o site inteiro. Os seguintes campos são placeholder e precisam da informação oficial da Chico's Gym (ver seção 8 do documento — "Chico's Gym fornece"):

| Campo | Onde está | O que falta |
|---|---|---|
| `brand.whatsapp` / `whatsappDisplay` | `lib/data.ts` | Número real de WhatsApp |
| `brand.address`, `email`, `hours` | `lib/data.ts` | Endereço e horários reais |
| `plans[]` | `lib/data.ts` | Tabela oficial de planos e valores |
| `team[]` | `lib/data.ts` | Nomes, CREF e especialidade reais da equipe |
| `products[]` | `lib/data.ts` | Catálogo real da loja |
| `testimonials[]` | `lib/data.ts` | Depoimentos reais de alunos (com autorização de uso) |

## Fotos e vídeos reais

As fotos reais da academia já estão em uso em: hero (foto por trás da cena WebGL), 4 dos 6 cards de "A Academia", logo (navbar/rodapé) e a seção de Contato. A logo foi padronizada na versão **laranja** (a versão dourada do letreiro só aparece na foto real da fachada à noite — ver seção 2 do documento sobre a inconsistência de marca).

Uma imagem enviada (o halter isolado) **não foi usada**: tinha marca d'água de banco de imagens ("pngtree"), então não é segura para publicar. A seção Loja segue com placeholder até haver uma foto real de produto.

Ainda faltam fotos para: **Peso Livre**, **Vestiários** e a **Equipe** (fundador + personal trainers) — esses continuam com o placeholder em gradiente até chegarem novas fotos. Para adicionar:

1. Salvar o arquivo em `public/images/` seguindo os nomes abaixo.
2. Preencher o campo `image` correspondente em `lib/data.ts`.

O componente já aplica automaticamente o **efeito de tilt 3D** (`components/tilt-image.tsx`) a qualquer foto colocada nesses campos — inclusive o efeito preto-e-branco → cor no hover da seção Equipe.

| Slot | Campo em `lib/data.ts` | Caminho | Status |
|---|---|---|---|
| Fachada | `tourAreas[0].image` | `public/images/tour/fachada.jpg` | ✅ |
| Piso de Treino | `tourAreas[1].image` | `public/images/tour/piso-treino.jpg` | ✅ |
| Cardio & Musculação | `tourAreas[2].image` | `public/images/tour/cardio-musculacao.jpg` | ✅ |
| Spinning | `tourAreas[3].image` | `public/images/tour/spinning.jpg` | ✅ |
| Peso Livre | `tourAreas[4].image` | `public/images/tour/peso-livre.jpg` | pendente |
| Vestiários | `tourAreas[5].image` | `public/images/tour/vestiarios.jpg` | pendente |
| Chico (fundador) | `team[0].image` | `public/images/team/chico.jpg` | pendente |
| Bruno | `team[1].image` | `public/images/team/bruno.jpg` | pendente |
| Camila | `team[2].image` | `public/images/team/camila.jpg` | pendente |
| Rafael | `team[3].image` | `public/images/team/rafael.jpg` | pendente |
| Hero (fundo) | usado direto em `components/hero.tsx` | `public/images/hero/hero-aisle.jpg` | ✅ |
| Contato (visual) | usado direto em `components/contact.tsx` | `public/images/contact/entrada-noite.jpg` | ✅ |
| Logo | `brand.logo` | `public/images/brand/logo.jpg` | ✅ |

## Próximos passos (fora do escopo desta base)

Itens do Pacote 2 (Performance) e Pacote 3 (Premium) do documento, não incluídos nesta base:

- Roteamento multipágina com transições WebGL entre rotas (aqui o site é uma página única com âncoras — mais rápido de navegar e mais fácil de manter para uma base inicial)
- Tour 3D navegável real da academia (fotogrametria/Gaussian splatting)
- CMS (Sanity/Payload) para a equipe editar planos, fotos e equipe sem programador
- Checkout online dos planos
- Área do Aluno (login, ficha de treino, histórico)
- Analytics (GA4, Meta Pixel, Clarity)
- PWA instalável
