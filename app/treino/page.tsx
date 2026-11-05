import type { Metadata } from "next";
import { WorkoutBuilder } from "@/components/workout-builder";

export const metadata: Metadata = {
  title: "Monte seu Treino — Chico's Gym",
  description:
    "Responda algumas perguntas e receba na hora um treino personalizado, montado com os exercícios e as regras da Chico's Gym. Salve no celular e use sempre que quiser.",
};

export default function TreinoPage() {
  return (
    <main className="pt-24 md:pt-28">
      <WorkoutBuilder />
    </main>
  );
}
