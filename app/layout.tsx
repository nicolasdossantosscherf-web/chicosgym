import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { GrainOverlay } from "@/components/grain-overlay";
import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { PageTransition } from "@/components/page-transition";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteChrome } from "@/components/site-chrome";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chico's Gym — Onde disciplina vira resultado.",
  description:
    "Chico's Gym, academia em Três de Maio (RS): estrutura completa de musculação, planos sem taxa de matrícula, aula experimental grátis e loja de suplementos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-offwhite antialiased">
        <GrainOverlay />
        <Cursor />
        <SmoothScrollProvider>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <PageTransition />
          {children}
          <SiteChrome>
            <Footer />
            <FloatingWhatsapp />
          </SiteChrome>
          <CartDrawer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
