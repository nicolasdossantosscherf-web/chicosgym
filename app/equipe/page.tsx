import type { Metadata } from "next";
import { Team } from "@/components/team";

export const metadata: Metadata = {
  title: "Equipe — Chico's Gym",
  description: "Conheça os profissionais que treinam junto com você na Chico's Gym.",
};

export default function EquipePage() {
  return (
    <main className="pt-24 md:pt-28">
      <Team />
    </main>
  );
}
