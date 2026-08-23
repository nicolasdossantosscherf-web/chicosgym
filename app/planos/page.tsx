import type { Metadata } from "next";
import { Pricing } from "@/components/pricing";

export const metadata: Metadata = {
  title: "Planos — Chico's Gym",
  description: "Compare os planos da Chico's Gym e veja quanto você economiza.",
};

export default function PlanosPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Pricing />
    </main>
  );
}
