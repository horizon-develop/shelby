import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Shelby - Reserva tu turno online",
  description:
    "Reserva tu turno en Shelby de forma rápida y sencilla. Sistema de turnos online disponible 24/7.",
  keywords:
    "shelby, turnos, reservas, barbería, peluquería, citas online",
  authors: [{ name: "Shelby" }],
  metadataBase: new URL("https://shelbyturnos.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://shelbyturnos.vercel.app",
    title: "Shelby - Reserva tu turno online",
    description:
      "Reserva tu turno en Shelby de forma rápida y sencilla. Sistema de turnos online disponible 24/7.",
    images: [
      {
        url: "/shelby-logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_AR",
    siteName: "Shelby Turnos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelby - Reserva tu turno online",
    description:
      "Reserva tu turno en Shelby de forma rápida y sencilla. Sistema de turnos online disponible 24/7.",
    images: ["/shelby-logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "theme-color": "#080808",
    "msapplication-TileColor": "#080808",
    "apple-mobile-web-app-title": "Shelby Turnos",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans`}
      >
        <Providers>
          <div className="min-h-screen bg-stone-900 font-sans">
            <Navbar />
            <main className="py-10">{children}</main>
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
