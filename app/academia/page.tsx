import type { Metadata } from "next";
import { TourSection } from "@/components/tour-section";

export const metadata: Metadata = {
  title: "A Academia — Chico's Gym",
  description: "Conheça o espaço da Chico's Gym: piso de treino, cardio, musculação e spinning.",
};

export default function AcademiaPage() {
  return (
    <main className="pt-24 md:pt-28">
      <TourSection />
    </main>
  );
}
