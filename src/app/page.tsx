import Link from "next/link";
import Image from "next/image";

type TApplication = {
  title: string;
  url: string;
  expires: Date;
};

type TApplications = TApplication[];

const applications: TApplications = [
  {
    title: "Lærling IT-utvikler - Trondheim",
    url: "https://960040.webcruiter.no/main/recruit/public/4908325779?&language=nb&use_position_site_header=0&culture_id=NB-NO&url_org=960040",
    expires: new Date("2025-02-09"),
  },
  {
    title: "Lærling IT-drift - Trondheim",
    url: "https://960040.webcruiter.no/main/recruit/public/4909620759?&language=nb&use_position_site_header=0&culture_id=NB-NO&url_org=960040",
    expires: new Date("2025-02-09"),
  },
  {
    title: "Lærling i IT-driftsfaget",
    url: "https://960040.webcruiter.no/main/recruit/public/4908436450?&language=nb&use_position_site_header=0&culture_id=NB-NO&url_org=960040",
    expires: new Date("2025-02-02"),
  },
  {
    title: "Lærling IT-drift - Steinkjer",
    url: "https://960040.webcruiter.no/main/recruit/public/4909613819?&language=nb&use_position_site_header=0&culture_id=NB-NO&url_org=960040",
    expires: new Date("2025-02-09"),
  },
  {
    title: "Elkjøp - Utvikler",
    url: "elkop.no",
    expires: new Date("2025-1-16"),
  }
];

export default function Home() {
  const applicationsValid = applications.filter(
    (application) => application.expires.getTime() > new Date().getTime()
  );

  const applicationsExpired = applications.filter(
    (application) => application.expires.getTime() < new Date().getTime()
  );

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-gray-300 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <div className="flex gap-[20px]">
        <h2 className="text-2xl lg:text-3xl mr-auto">Jobbsøkeportal</h2>
        <Image
          className="w-[120px] h-[40px] lg:w-[150px] lg:h-[50px]"
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
        />
      </div>

      <p className="text-sm lg:text-base mt-[2dvh]">
        Dette er en portal som er utviklet for å gi deg oversikt over
        tilgjengelige stillinger. Her kan du enkelt finne oppdaterte
        stillingsutlysninger og muligheter for å starte eller utvikle karrieren
        din innen ulike fagområder.
      </p>

      <h4 className="text-lg lg:text-xl mt-[5dvh]">Stillinger tilgjengelig ({applicationsValid.length})</h4>
      {applicationsValid.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen stillinger tilgjengelig
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
                Frist: {application.expires.toLocaleDateString("NO")}
              </p>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-lg lg:text-xl mt-[5dvh]">Stillinger utgått ({applicationsExpired.length})</h4>
      {applicationsExpired.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen stillinger utgått
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
