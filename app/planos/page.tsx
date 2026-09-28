import type { Metadata } from "next";
import { Pricing } from "@/components/pricing";
import { GymServices } from "@/components/gym-services";

export const metadata: Metadata = {
  title: "Planos e Serviços — Chico's Gym",
  description: "Compare os planos da Chico's Gym e conheça os serviços extras: avaliação física, nutricionista, massoterapeuta e personal.",
};

export default function PlanosPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Pricing />
      <GymServices />
    </main>
  );
}
