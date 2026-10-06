import type { Metadata } from "next";
import { StoryTimeline } from "@/components/story-timeline";

export const metadata: Metadata = {
  title: "Nossa História — Chico's Gym",
  description: "A trajetória da Chico's Gym, academia de Três de Maio (RS) desde 2022 — em breve, contada aqui.",
};

export default function HistoriaPage() {
  return (
    <main className="pt-24 md:pt-28">
      <StoryTimeline />
    </main>
  );
}
