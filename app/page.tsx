import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { Testimonials } from "@/components/testimonials";
import { Partners } from "@/components/partners";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Testimonials />
      <Partners />
    </main>
  );
}
