import type { Metadata } from "next";
import { StoryTimeline } from "@/components/story-timeline";

export const metadata: Metadata = {
  title: "Nossa História — Chico's Gym",
  description: "De galpão abandonado a referência da região — a trajetória da Chico's Gym.",
};

export default function HistoriaPage() {
  return (
    <main className="pt-24 md:pt-28">
      <StoryTimeline />
    </main>
  );
}
