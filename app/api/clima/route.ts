// Temperatura atual de Três de Maio para o relógio do cabeçalho. Vem do MET
// Norway (dados livres, inclusive pra uso comercial, licença CC BY 4.0 — por isso
// o crédito embaixo do relógio). Eles pedem pra identificar o site no User-Agent
// e não consultar mais que o necessário: a resposta fica 30 min em cache.
const FORECAST_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-27.777&lon=-54.236"
const USER_AGENT = "ChicosGymSite/1.0 https://www.chicosgym.com.br"

type Forecast = {
  properties?: {
    timeseries?: { time: string; data?: { instant?: { details?: { air_temperature?: number } } } }[]
  }
}

export async function GET() {
  try {
    const response = await fetch(FORECAST_URL, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 1800 },
    })
    if (!response.ok) throw new Error(`MET Norway respondeu ${response.status}`)

    // A previsão vem hora a hora; vale a última hora que já começou.
    const timeseries = ((await response.json()) as Forecast).properties?.timeseries ?? []
    const now = Date.now()
    const current = timeseries.filter((entry) => Date.parse(entry.time) <= now).at(-1) ?? timeseries[0]
    const temperature = current?.data?.instant?.details?.air_temperature
    if (typeof temperature !== "number") throw new Error("Previsão sem temperatura")

    return Response.json(
      { temperature: Math.round(temperature) },
      { headers: { "Cache-Control": "public, max-age=600, s-maxage=1800, stale-while-revalidate=3600" } },
    )
  } catch {
    // Sem temperatura o relógio só mostra o espaço apagado.
    return Response.json({ temperature: null }, { headers: { "Cache-Control": "no-store" } })
  }
}
