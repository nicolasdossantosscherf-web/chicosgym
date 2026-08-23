import type { Metadata } from "next";
import { Shop } from "@/components/shop";

export const metadata: Metadata = {
  title: "Loja — Chico's Gym",
  description: "Suplementos, vestuário e acessórios da Chico's Gym.",
};

export default function LojaPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Shop />
    </main>
  );
}
