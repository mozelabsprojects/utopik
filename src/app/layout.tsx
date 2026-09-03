import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import ImhaEasterEgg from "@/components/ImhaEasterEgg";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ütopik — Stratejik Ülke Simülasyonu",
  description:
    "Bir ülkeyi yönetin, stratejik kararlar verin, ekonomi-ordu-halk dengesini kurun. Derin simülasyon, acımasız denge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`h-full antialiased ${inter.variable} ${orbitron.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-grid overflow-x-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {children}
        <ImhaEasterEgg />
      </body>
    </html>
  );
}
