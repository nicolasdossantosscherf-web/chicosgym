import type { Metadata } from "next";
import { WorkoutQuiz } from "@/components/workout-quiz";

export const metadata: Metadata = {
  title: "Descubra seu Treino — Chico's Gym",
  description:
    "Responda 5 perguntas e receba a ficha oficial de treino da Chico's Gym ideal pra você, montada pelos profissionais da academia.",
};

export default function TreinoPage() {
  return (
    <main className="pt-24 md:pt-28">
      <WorkoutQuiz />
    </main>
  );
}
