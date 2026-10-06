import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Na Vercel, os endereços de teste (preview) mostram a barra de comentários da Vercel.
const isPreview = process.env.VERCEL_ENV === "preview";
const vercelLive = isPreview ? " https://vercel.live" : "";
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? ` ${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin}`
  : "";

// Política de segurança de conteúdo: o navegador só carrega scripts, estilos,
// imagens e conexões do próprio site (e do mapa do Google / Supabase). Bloqueia
// scripts injetados de outros domínios, o site dentro de iframes de terceiros
// (clickjacking) e formulários enviando dados pra fora.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${supabase}${vercelLive}`,
  `frame-src https://www.google.com https://maps.google.com${vercelLive}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Sempre HTTPS (2 anos), inclusive em subdomínios.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // O site não usa câmera, microfone, localização nem pagamentos do navegador.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Não anuncia que o site é feito em Next.js.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
