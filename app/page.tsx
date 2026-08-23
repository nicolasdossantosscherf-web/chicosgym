import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { ExploreGrid } from "@/components/explore-grid";
import { Testimonials } from "@/components/testimonials";
import { CtaBanner } from "@/components/cta-banner";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <ExploreGrid />
      <Testimonials />
      <CtaBanner />
    </main>
  );
}
