import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { GrainOverlay } from "@/components/grain-overlay";
import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { PageTransitionOverlay } from "@/components/page-transition-overlay";

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
  title: "Chico's Gym — Disciplina que constrói. Resultado que transforma.",
  description:
    "Chico's Gym: academia industrial com musculação, funcional, spinning e personal trainer. Agende seu treino experimental.",
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
          <Navbar />
          <PageTransitionOverlay />
          {children}
          <Footer />
          <FloatingWhatsapp />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
