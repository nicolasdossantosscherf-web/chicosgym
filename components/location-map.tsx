// Embed genérico centrado na cidade (Três de Maio, RS) — evita fixar um pino
// num endereço ainda não confirmado. Trocar a query do src assim que a
// Chico's Gym confirmar o endereço exato.
export function LocationMap() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
      <iframe
        title="Localização — Três de Maio, RS"
        src="https://www.google.com/maps?q=Tr%C3%AAs+de+Maio,+RS&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full grayscale-[0.3] contrast-[1.05]"
        style={{ border: 0 }}
      />
    </div>
  )
}
