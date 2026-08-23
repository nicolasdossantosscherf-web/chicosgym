import type Lenis from "lenis"

// Referência compartilhada da instância única do Lenis, criada em
// SmoothScrollProvider. Permite que outras partes do app (ex.: o reset de
// scroll na troca de rota) controlem o scroll suave sem precisar de contexto.
export const lenisStore: { instance: Lenis | null } = { instance: null }
