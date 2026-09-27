import type { Metadata } from "next";
import { Shop } from "@/components/shop";

export const metadata: Metadata = {
  title: "Loja — Chico's Gym",
  description: "Produtos da Chico's Gym à venda na academia.",
};

export default function LojaPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Shop />
    </main>
  );
}
