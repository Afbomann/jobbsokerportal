"use client";

import { applicationType } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeClient(props: {
  applications: {
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
  }[];
}) {
  const [applications, setApplications] = useState(props.applications);
  const [filter, setFilter] = useState<{
    expires: "sort_expires_ascending" | "sort_expires_descending";
    type: "all" | applicationType;
  }>({
    expires: "sort_expires_ascending",
    type: "all",
  });

  const applicationsValid = applications.filter(
    (application) => application.expires.getTime() > new Date().getTime()
  );

  const applicationsExpired = applications.filter(
    (application) => application.expires.getTime() < new Date().getTime()
  );

  useEffect(() => {
    if (filter.expires == "sort_expires_ascending") {
      setApplications(
        (prev) =>
          (prev = prev.sort(
            (a, b) => b.expires.getTime() * 1000 - a.expires.getTime() * 1000
          ))
      );
    } else {
      setApplications(
        (prev) =>
          (prev = prev.sort(
            (a, b) => a.expires.getTime() * 1000 - b.expires.getTime() * 1000
          ))
      );
    }

    if (filter.type != "all") {
      setApplications(
        (prev) =>
          //@ts-expect-error funker fint
          (prev = prev.sort((application) => application.type == filter.type))
      );
    }
  }, [filter]);

  return (
    <>
      <div>
        <select
          className="px-[15px] py-[5px] outline-none rounded-sm shadow-sm"
          onChange={(e) =>
            //fiks denne og legg til type select
            setFilter((prev) => (prev = { ...prev, expires: e.target.value }))
          }
          value={filter.expires}
        >
          <option value="sort_expires_ascending">Sorter frist stigende</option>
          <option value="sort_expires_descending">Sorter frist synkende</option>
        </select>
      </div>
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
    </>
  );
}
