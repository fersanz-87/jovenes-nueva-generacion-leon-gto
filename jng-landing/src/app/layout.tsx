import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jóvenes Nueva Generación | Centro de Rehabilitación en León, Gto.",
  description:
    "CEPAAV - Centro de rehabilitación profesional contra el alcohol y las drogas en León, Guanajuato. Equipo multidisciplinario: médicos, psicólogos, psiquiatras, terapeutas. Ayuda 24/7. Sección femenil CAIPRA.",
  keywords: [
    "centro de rehabilitación León",
    "rehabilitación adicciones Guanajuato",
    "CEPAAV",
    "Jóvenes Nueva Generación",
    "tratamiento alcoholismo León",
    "tratamiento drogadicción",
    "clínica rehabilitación femenil",
    "CAIPRA",
    "terapia adicciones",
  ],
  authors: [{ name: "Jóvenes Nueva Generación A.C." }],
  openGraph: {
    title: "Jóvenes Nueva Generación | Centro de Rehabilitación en León, Gto.",
    description:
      "Centro de rehabilitación profesional contra el alcohol y las drogas. Equipo multidisciplinario, ayuda 24/7 y sección femenil CAIPRA.",
    url: "https://jng-rehabilitacion.com",
    siteName: "Jóvenes Nueva Generación A.C.",
    locale: "es_MX",
    type: "website",
    images: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? [
          {
            url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/jng/general/og-image`,
            width: 1200,
            height: 630,
            alt: "Jóvenes Nueva Generación - Centro de Rehabilitación",
          },
        ]
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
