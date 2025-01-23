import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { HomeClient } from "./homeClient";

export const revalidate = 10;

export default async function HomePage() {
  const applications = await prisma.application.findMany({
    select: {
      title: true,
      url: true,
      expires: true,
      positions: true,
      type: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-gray-500 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <div className="flex gap-[20px]">
        <h2 className="text-2xl lg:text-3xl mr-auto">Jobbsøkerportal</h2>
        <Image
          className="w-[120px] h-[40px] lg:w-[150px] lg:h-[50px]"
          src="/images/logo.png"
          alt="logo"
          width={150}
          height={150}
        />
      </div>

      <p className="text-sm lg:text-base mt-[2dvh]">
        Dette er en portal som er utviklet for å gi deg oversikt over
        tilgjengelige søknader. Her kan du enkelt finne oppdaterte
        søknadsutlysninger og muligheter for å starte eller utvikle karrieren
        din innen ulike fagområder.
      </p>

      <HomeClient applications={applications} />
    </div>
  );
}
