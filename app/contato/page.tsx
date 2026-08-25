import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";

export const metadata: Metadata = {
  title: "Contato — Chico's Gym",
  description: "Endereço, horários de funcionamento e um jeito rápido de falar com a Chico's Gym.",
};

export default function ContatoPage() {
  return (
    <main className="pt-24 md:pt-28">
      <Contact />
      <Faq />
    </main>
  );
}
