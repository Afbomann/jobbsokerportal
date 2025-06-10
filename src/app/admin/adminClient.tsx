"use client";

import { useState, useEffect } from "react";
import { TApplicationFilter } from "@/lib/types";
import { application } from "@prisma/client";
import ApplicationCard from "../(components)/ApplicationCard";

export default function AdminClient(props: { applications: application[] }) {
  const [applications, setApplications] = useState(props.applications);
  const [filter, setFilter] = useState<TApplicationFilter>({
    search: "",
    expires: "sort_expires_descending",
    type: "all",
  });

  useEffect(() => {
    let filteredApplications = props.applications;

    filteredApplications = filteredApplications.filter((application) =>
      application.title.toLowerCase().match(filter.search.toLowerCase())
    );

    if (filter.type != "all") {
      filteredApplications = filteredApplications.filter(
        (application) => application.type == filter.type
      );
    }

    filteredApplications.sort((a, b) => {
      if (filter.expires == "sort_expires_ascending") {
        return a.expires.getTime() - b.expires.getTime();
      } else {
        return b.expires.getTime() - a.expires.getTime();
      }
    });

    setApplications(() => filteredApplications);
  }, [filter, props.applications]);

  const normalApplications = applications.filter(
    (application) => application.archived == false
  );

  const archivedApplications = applications.filter(
    (application) => application.archived == true
  );

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-4">
        <input
          placeholder="Søk etter en utlysning..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
          onChange={(e) =>
            setFilter((prev) => (prev = { ...prev, search: e.target.value }))
          }
          value={filter.search}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
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
          className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
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

      <h4 className="text-lg lg:text-xl mt-5 font-semibold text-gray-600">
        Utlysninger ({normalApplications.length})
      </h4>

      {normalApplications.length > 0 && (
        <div className="mt-[2dvh] flex flex-wrap items-center gap-[2dvh]">
          {normalApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              mode="edit"
            />
          ))}
        </div>
      )}

      <h4 className="text-lg lg:text-xl mt-8 font-semibold text-gray-600">
        Utlysninger arkivert ({archivedApplications.length})
      </h4>

      {archivedApplications.length > 0 && (
        <div className="mt-[2dvh] flex flex-wrap items-center gap-[2dvh]">
          {archivedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              mode="edit"
            />
          ))}
        </div>
      )}
    </>
  );
}
