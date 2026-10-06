import { resolve4, resolve6, resolveMx } from "node:dns/promises"
import { NextResponse, type NextRequest } from "next/server"

// Diz se o domínio de um e-mail existe e pode receber mensagens. Recebe só o
// domínio (ex.: "gmail.com"), nunca o e-mail inteiro.
const DOMAIN_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/
const NOT_FOUND = new Set(["ENOTFOUND", "ENODATA", "ENONAME"])

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))])
}

// 1º caminho: o DNS do próprio servidor.
async function viaSystemDns(domain: string): Promise<boolean | null> {
  try {
    const mx = await withTimeout(resolveMx(domain), 3000)
    // MX "nulo" (RFC 7505): o domínio declara que não recebe e-mail.
    return mx.some((record) => record.exchange && record.exchange !== ".")
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (!code || !NOT_FOUND.has(code)) return null
    // Sem MX: pela regra do e-mail, o próprio domínio pode receber se tiver endereço.
    for (const lookup of [resolve4, resolve6]) {
      try {
        if ((await withTimeout(lookup(domain), 2000)).length > 0) return true
      } catch {}
    }
    return false
  }
}

// 2º caminho, se o DNS do servidor falhar: DNS seguro (HTTPS) da Cloudflare.
async function dohQuery(domain: string, type: "MX" | "A" | "AAAA") {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`DoH ${res.status}`)
  return (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] }
}

async function viaDnsOverHttps(domain: string): Promise<boolean | null> {
  try {
    const mx = await dohQuery(domain, "MX")
    if (mx.Status === 3) return false // NXDOMAIN: o domínio não existe
    if (mx.Status !== 0) return null
    const records = (mx.Answer ?? []).filter((a) => a.type === 15)
    if (records.length > 0) return records.some((a) => !a.data.trim().endsWith(" ."))
    for (const type of ["A", "AAAA"] as const) {
      const r = await dohQuery(domain, type)
      if ((r.Answer ?? []).some((a) => a.type === (type === "A" ? 1 : 28))) return true
    }
    return false
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const domain = (request.nextUrl.searchParams.get("d") ?? "").trim().toLowerCase()
  let exists: boolean | null = false
  if (DOMAIN_RE.test(domain)) {
    exists = await viaSystemDns(domain)
    if (exists === null) exists = await viaDnsOverHttps(domain)
  }
  return NextResponse.json(
    { exists },
    {
      headers: {
        // Resposta igual pra todo mundo: o CDN guarda por um dia e poupa consultas.
        "Cache-Control": exists === null ? "no-store" : "public, max-age=86400, s-maxage=86400",
      },
    }
  )
}
