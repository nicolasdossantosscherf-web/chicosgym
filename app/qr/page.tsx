import type { Metadata } from "next";
import { QrHub } from "@/components/qr-hub";

// Página aberta pelo QR Code dos cartazes da academia: Wi-Fi, site e avaliação
// no Google num lugar só. Fica fora do menu e do Google, e o SiteChrome esconde
// o cabeçalho e o rodapé do site aqui.
export const metadata: Metadata = {
  title: "Bem-vindo — Chico's Gym",
  description: "Wi-Fi, site e avaliação da Chico's Gym num lugar só.",
  robots: { index: false, follow: false },
};

export default function QrPage() {
  return (
    <main>
      <QrHub />
    </main>
  );
}
