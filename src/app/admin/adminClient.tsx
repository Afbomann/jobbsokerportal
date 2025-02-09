"use client";

import { useState, useEffect } from "react";
import { TApplicationFilter } from "@/libs/types";
import { applicationType } from "@prisma/client";
import Link from "next/link";

export default function AdminClient(props: {
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
  }, [filter, props.applications]);

  return (
    <>
      <div className="mt-[2dvh] flex flex-col gap-[15px]">
        <select
          className="px-[15px] py-[6px] outline outline-1 outline-slate-300 rounded-md text-sm lg:text-base bg-white"
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
          className="px-[15px] py-[6px] outline outline-1 outline-slate-300 rounded-md text-sm lg:text-base bg-white"
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

      {applications.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applications.map((application) => (
            <div
              className="bg-white rounded-md outline outline-1 outline-slate-300 p-[13px] flex flex-col gap-[3px]"
              key={application.id}
            >
              <div className="flex gap-[10px] items-center">
                <p className="text-base lg:text-lg mr-auto">
                  <b>{application.title}</b>
                </p>
                <Link
                  className="bg-blue-200 px-[15px] py-[5px] rounded-md text-sm lg:text-base"
                  href={`/admin/${application.id}`}
                >
                  Rediger
                </Link>
              </div>
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
    </>
  );
}
