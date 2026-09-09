export function LocationMap() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
      <iframe
        title="Localização — Chico's Gym, Três de Maio, RS"
        src="https://www.google.com/maps?q=Rua+Rio+de+Janeiro,+192,+Centro,+Tr%C3%AAs+de+Maio+-+RS,+98910-000&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full grayscale-[0.3] contrast-[1.05]"
        style={{ border: 0 }}
      />
    </div>
  )
}
