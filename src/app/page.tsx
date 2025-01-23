import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/libs/prisma";

export default async function HomePage() {
  const applications = await prisma.application.findMany({
    orderBy: { id: "desc" },
  });

  const applicationsValid = applications.filter(
    (application) => application.expires.getTime() > new Date().getTime()
  );

  const applicationsExpired = applications.filter(
    (application) => application.expires.getTime() < new Date().getTime()
  );

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

      <h4 className="text-lg lg:text-xl mt-[5dvh]">
        Søknader tilgjengelig ({applicationsValid.length})
      </h4>
      {applicationsValid.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen søknader tilgjengelig
        </h5>
      )}
      {applicationsValid.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applicationsValid.map((application, applicationIndex) => (
            <div
              className="bg-white rounded-sm p-[13px] shadow-md flex flex-col gap-[3px]"
              key={applicationIndex}
            >
              <p className="text-base lg:text-lg">
                <b>{application.title}</b>
              </p>
              <Link
                target="_blank"
                className="underline text-blue-400 text-sm lg:text-base w-fit"
                href={application.url}
              >
                Link til søknad
              </Link>
              <p className="text-sm lg:text-base">
                Frist: {application.expires.toLocaleDateString("NO")} |
                Stillinger: {application.positions}
              </p>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-lg lg:text-xl mt-[5dvh]">
        Søknader utgått ({applicationsExpired.length})
      </h4>
      {applicationsExpired.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen søknader utgått
        </h5>
      )}
      {applicationsExpired.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applicationsExpired.map((application, applicationIndex) => (
            <div
              className="bg-red-400 rounded-sm p-[13px] shadow-md flex flex-col gap-[3px]"
              key={applicationIndex}
            >
              <p className="text-base lg:text-lg">
                <b>{application.title}</b>
              </p>
              <Link
                target="_blank"
                className="underline text-sm lg:text-base w-fit"
                href={application.url}
              >
                Link til søknad
              </Link>
              <p className="text-sm lg:text-base">
                Frist utgikk: {application.expires.toLocaleDateString("NO")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
