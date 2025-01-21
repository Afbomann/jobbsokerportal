import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const open_sans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobbsøkerportal - Tiller VGS",
  description:
    "Dette er en portal som er utviklet for å gi deg oversikt over tilgjengelige søknader. Her kan du enkelt finne oppdaterte søknadsutlysninger og muligheter for å starte eller utvikle karrieren din innen ulike fagområder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} antialiased`}>{children}</body>
    </html>
  );
}
