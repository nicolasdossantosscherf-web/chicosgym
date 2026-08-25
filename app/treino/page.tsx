import type { Metadata } from "next";
import { WorkoutBuilder } from "@/components/workout-builder";

export const metadata: Metadata = {
  title: "Monte seu Treino — Chico's Gym",
  description: "Responda 3 perguntas e receba uma sugestão de treino da Chico's Gym na hora.",
};

export default function TreinoPage() {
  return (
    <main className="pt-24 md:pt-28">
      <WorkoutBuilder />
    </main>
  );
}
