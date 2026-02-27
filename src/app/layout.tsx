import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Shelby peluquería",
    template: "%s | Shelby peluquería",
  },
  description:
    "Reservar turno de peluquería en Shelby. Cortes, peinados y tratamientos capilares profesionales.",
  keywords: [
    "peluquería",
    "shelby",
    "turno de peluquería",
    "reservar turno peluquería",
    "peluquería corrientes",
    "turnos peluquería",
    "reserva de turnos peluquería",
    "corte de pelo",
    "salón de belleza",
    "estilista",
    "peluquero profesional",
    "corte y peinado",
    "tratamientos capilares",
    "reservar turno online",
    "app peluquería",
    "turnos online peluquería",
    "agenda peluquería",
    "shelby peluquería",
    "shelby corrientes",
  ],
  authors: [{ name: "Alan Kennedy", url: "https://alankke.github.io/" }],
  creator: "Alan Kennedy",
  metadataBase: new URL("https://shelbyturnos.vercel.app"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://shelbyturnos.vercel.app",
    title: "Shelby Peluquería",
    description:
      "Reservar turno de peluquería en Shelby. Cortes, peinados y tratamientos capilares profesionales.",
    siteName: "Shelby Peluquería",
    images: [
      {
        url: "/shelby-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Shelby Peluquería",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelby Peluquería",
    description:
      "Reservar turno de peluquería en Shelby. Cortes, peinados y tratamientos capilares profesionales.",
    images: ["/shelby-logo.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#080808",
    "msapplication-TileColor": "#080808",
    "apple-mobile-web-app-title": "Shelby",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
