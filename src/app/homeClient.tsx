"use client";

import { TApplicationFilter } from "@/libs/types";
import { applicationType } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeClient(props: {
  applications: {
    id: string;
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
  }[];
}) {
  const [applications, setApplications] = useState(props.applications);
  const [filter, setFilter] = useState<TApplicationFilter>({
    expires: "sort_expires_ascending",
    type: "all",
  });

  useEffect(() => {
    let filteredApplications = props.applications;

    if (filter.type != "all") {
      filteredApplications = filteredApplications.filter(
        (application) => application.type == filter.type
      );
    }

    filteredApplications.sort((a, b) => {
      if (filter.expires == "sort_expires_ascending") {
        return filter.type == "all"
          ? b.expires.getTime() - a.expires.getTime()
          : a.expires.getTime() - b.expires.getTime();
      } else {
        return filter.type == "all"
          ? a.expires.getTime() - b.expires.getTime()
          : b.expires.getTime() - a.expires.getTime();
      }
    });

    setApplications(() => filteredApplications);
  }, [filter]);

  const applicationsValid = applications.filter(
    (application) => application.expires.getTime() > new Date().getTime()
  );

  const applicationsExpired = applications.filter(
    (application) => application.expires.getTime() < new Date().getTime()
  );

  return (
    <>
      <div className="mt-[2dvh] flex flex-col gap-[15px]">
        <select
          className="px-[15px] py-[5px] outline-none rounded-sm shadow-sm text-sm lg:text-base"
          onChange={(e) =>
            //@ts-expect-error funker fint
            setFilter((prev) => (prev = { ...prev, expires: e.target.value }))
          }
          value={filter.expires}
        >
          <option value="sort_expires_ascending">Sorter frist stigende</option>
          <option value="sort_expires_descending">Sorter frist synkende</option>
        </select>
        <select
          className="px-[15px] py-[5px] outline-none rounded-sm shadow-sm text-sm lg:text-base"
          onChange={(e) =>
            //@ts-expect-error funker fint
            setFilter((prev) => (prev = { ...prev, type: e.target.value }))
          }
          value={filter.type}
        >
          <option value="all">Alle</option>
          <option>Drift</option>
          <option>Utvikling</option>
        </select>
      </div>

      <h4 className="text-lg lg:text-xl mt-[2dvh]">
        Utlysninger tilgjengelig ({applicationsValid.length})
      </h4>
      {applicationsValid.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen utlysninger tilgjengelig
        </h5>
      )}
      {applicationsValid.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applicationsValid.map((application) => (
            <div
              className="bg-white rounded-sm p-[13px] shadow-md flex flex-col gap-[3px]"
              key={application.id}
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
                Frist: {application.expires.toLocaleDateString("NO")} | Fag:{" "}
                {application.type} | Stillinger: {application.positions}
              </p>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-lg lg:text-xl mt-[5dvh]">
        Utlysninger utgått ({applicationsExpired.length})
      </h4>
      {applicationsExpired.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen utlysninger utgått
        </h5>
      )}
      {applicationsExpired.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applicationsExpired.map((application) => (
            <div
              className="bg-red-400 rounded-sm p-[13px] shadow-md flex flex-col gap-[3px]"
              key={application.id}
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
                Frist utgikk: {application.expires.toLocaleDateString("NO")} |
                Fag: {application.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
