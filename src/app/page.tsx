import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { HomeClient } from "./homeClient";

export const revalidate = 3600;

export default async function HomePage() {
  const applications = await prisma.application.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
      <div className="flex gap-[20px]">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-600 mr-auto">
          Jobbsøkerportal
        </h2>
        <Image
          className="w-[40px] lg:w-[50px]"
          src="/images/logo3.png"
          alt="logo"
          width={150}
          height={150}
        />
      </div>

      <p className="text-sm lg:text-base mt-[2dvh] text-gray-600 leading-relaxed">
        Dette er en portal som er utviklet for å gi deg oversikt over
        tilgjengelige utlysninger. Her kan du enkelt finne oppdaterte
        søknadsutlysninger og muligheter for å starte eller utvikle karrieren
        din innen ulike fagområder.
      </p>

      <HomeClient applications={applications} />
    </div>
  );
}
