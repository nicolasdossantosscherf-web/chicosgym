import type { Metadata } from "next";
import { Services } from "@/components/services";
import { ClassSchedule } from "@/components/class-schedule";

export const metadata: Metadata = {
  title: "Modalidades — Chico's Gym",
  description: "Musculação, treino funcional, spinning, cardio, avaliação física e personal trainer.",
};

export default function ModalidadesPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Services />
      <ClassSchedule />
    </main>
  );
}
