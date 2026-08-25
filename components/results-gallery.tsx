import { results } from "@/lib/data"
import { Reveal } from "./reveal"
import { TiltImage } from "./tilt-image"

export function ResultsGallery() {
  return (
    <section className="relative bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="diamond-row mb-12">
          <span className="diamond-lg opacity-30" />
          <span className="diamond-lg opacity-60" />
          <span className="diamond-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {results.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <div className="relative aspect-square overflow-hidden rounded-sm border border-line">
                <TiltImage src={item.image} alt={item.caption} label={item.caption} className="h-full w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
