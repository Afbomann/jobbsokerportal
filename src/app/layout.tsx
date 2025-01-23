import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const open_sans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobbsøkerportal - Tiller VGS",
  description:
    "Dette er en portal som er utviklet for å gi deg oversikt over tilgjengelige utlysninger. Her kan du enkelt finne oppdaterte søknadsutlysninger og muligheter for å starte eller utvikle karrieren din innen ulike fagområder.",
  openGraph: { images: ["https://jobbsokerportal.vercel.app/images/bg.jpg"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} antialiased`}>
        <div
          style={{
            backgroundImage: `url("/images/bg.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            zIndex: -1,
          }}
          className="fixed w-full h-[100dvh] top-0 blur-[5px]"
        />
        {children}
      </body>
    </html>
  );
}
