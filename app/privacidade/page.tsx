import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { brand } from "@/lib/data"

export const metadata: Metadata = {
  title: "Política de Privacidade — Chico's Gym",
  description: "Como a Chico's Gym trata os dados pessoais de quem usa o site e a Área do Aluno.",
}

const UPDATED_AT = "5 de outubro de 2026"

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: "Quem cuida dos seus dados",
    body: (
      <>
        A Chico&apos;s Gym ({brand.address}) é a responsável pelos dados pessoais tratados neste site. Para qualquer
        assunto sobre seus dados, fale com a gente pelo e-mail{" "}
        <a href={`mailto:${brand.email}`} className="text-orange hover:underline">
          {brand.email}
        </a>
        .
      </>
    ),
  },
  {
    title: "Quais dados coletamos",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong className="text-offwhite">Ao criar sua conta na Área do Aluno:</strong> nome, e-mail e senha. A senha é
          guardada criptografada — nem a equipe da academia consegue vê-la.
        </li>
        <li>
          <strong className="text-offwhite">Ao usar a Área do Aluno:</strong> a ficha de treino que você salvar (sexo,
          objetivo, experiência e dias por semana), os treinos que você registrar (data e dia da ficha) e as cargas
          anotadas em cada exercício. A sua frequência é calculada a partir desses treinos.
        </li>
        <li>
          <strong className="text-offwhite">Lesão ou restrição (dado de saúde):</strong> só é guardada se você marcar
          essa opção ao salvar a ficha, e pode ser removida por você a qualquer momento na Área do Aluno.
        </li>
        <li>
          <strong className="text-offwhite">Plano e vencimento:</strong> registrados pela recepção da academia.
        </li>
        <li>
          <strong className="text-offwhite">No Descubra seu Treino e no carrinho da loja:</strong> as respostas do quiz
          e os itens do carrinho ficam só no seu navegador. Os dados do pedido e as respostas só chegam até nós se você
          mesmo enviar pelo WhatsApp.
        </li>
      </ul>
    ),
  },
  {
    title: "Para que usamos",
    body: "Para criar e manter sua conta, mostrar seus treinos e sua evolução, informar seu plano e vencimento e entrar em contato sobre a sua conta. Não usamos seus dados para publicidade e não vendemos seus dados para ninguém.",
  },
  {
    title: "Base legal",
    body: "Tratamos seus dados para executar o serviço que você pediu ao criar a conta e com o seu consentimento, dado ao aceitar esta política no cadastro (Lei Geral de Proteção de Dados — LGPD, art. 7º, incisos I e V). A informação de lesão, por ser dado de saúde, só é tratada com o seu consentimento específico, dado ao marcar a opção correspondente (LGPD, art. 11, inciso I).",
  },
  {
    title: "Onde os dados ficam e quem acessa",
    body: "Os dados da Área do Aluno ficam guardados no Supabase, em servidores em São Paulo, e o site é hospedado pela Vercel. Esses serviços apenas armazenam e processam os dados a nosso pedido. O acesso é protegido: cada aluno só consegue ver os próprios dados. A equipe da academia vê, no painel da recepção, o nome, o e-mail, o plano e as datas dos treinos registrados de cada aluno — não vê suas cargas, sua ficha nem a lesão informada.",
  },
  {
    title: "Por quanto tempo",
    body: "Enquanto sua conta existir. Se você excluir a conta, seus dados são apagados de forma definitiva.",
  },
  {
    title: "Seus direitos",
    body: (
      <>
        Você pode, a qualquer momento, consultar, corrigir ou excluir seus dados e retirar seu consentimento (LGPD, art.
        18). A exclusão da conta pode ser feita por você mesmo, na própria{" "}
        <Link href="/aluno" className="text-orange hover:underline">
          Área do Aluno
        </Link>
        . Para os demais pedidos, escreva para {brand.email}.
      </>
    ),
  },
  {
    title: "Cookies",
    body: "Usamos apenas os cookies necessários para manter você conectado na Área do Aluno. Não usamos cookies de rastreamento nem de publicidade.",
  },
  {
    title: "Mudanças nesta política",
    body: "Quando novas funções forem liberadas na Área do Aluno, esta página será atualizada. A data da última atualização fica sempre no topo.",
  },
]

export default function PrivacidadePage() {
  return (
    <main className="pt-24 md:pt-28">
      <section className="relative bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <div className="flex items-center gap-3">
            <span className="diamond" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange">Privacidade</span>
          </div>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-wide text-offwhite md:text-6xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-offwhite/50">Última atualização: {UPDATED_AT}</p>

          <div className="mt-10 flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-2xl uppercase tracking-wide text-offwhite">{s.title}</h2>
                <div className="mt-2 text-sm leading-relaxed text-offwhite/70">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
