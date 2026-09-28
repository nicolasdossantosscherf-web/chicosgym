import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";

export const metadata: Metadata = {
  title: "Contato — Chico's Gym",
  description: "Um jeito rápido de falar com a Chico's Gym e tirar suas dúvidas.",
};

export default function ContatoPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Contact />
      <Faq />
    </main>
  );
}
