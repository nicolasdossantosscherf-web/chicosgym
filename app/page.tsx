import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Testimonials />
    </main>
  );
}
