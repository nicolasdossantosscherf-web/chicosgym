import type { Metadata } from "next";
import { Partners } from "@/components/partners";

export const metadata: Metadata = {
  title: "Parcerias — Chico's Gym",
  description: "Nutricionista, massoterapeuta e outros parceiros da Chico's Gym, com desconto pra alunos.",
};

export default function ParceriasPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Partners />
    </main>
  );
}
