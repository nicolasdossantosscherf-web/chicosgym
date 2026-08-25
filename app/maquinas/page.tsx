import type { Metadata } from "next";
import { MachineCatalog } from "@/components/machine-catalog";

export const metadata: Metadata = {
  title: "Máquinas — Chico's Gym",
  description: "Catálogo de equipamentos da Chico's Gym por grupo muscular, com dicas de uso.",
};

export default function MaquinasPage() {
  return (
    <main className="pt-24 md:pt-28">
      <MachineCatalog />
    </main>
  );
}
