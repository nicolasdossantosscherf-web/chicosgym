import type { Metadata } from "next";
import { LocationInfo } from "@/components/location-info";

export const metadata: Metadata = {
  title: "Local e Horários — Chico's Gym",
  description: "Endereço, mapa e horário de funcionamento da Chico's Gym.",
};

export default function LocalPage() {
  return (
    <main className="pt-24 md:pt-28">
      <LocationInfo />
    </main>
  );
}
