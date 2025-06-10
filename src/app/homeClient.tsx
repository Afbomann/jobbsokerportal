"use client";

import { TApplicationFilter } from "@/lib/types";
import { application, applicationType } from "@prisma/client";
import { useEffect, useState } from "react";
import ApplicationCard from "./(components)/ApplicationCard";
import { getStatus } from "@/utils";

export function HomeClient(props: { applications: application[] }) {
  const [applications, setApplications] = useState(props.applications);
  const [filter, setFilter] = useState<TApplicationFilter>({
    search: "",
    expires: "sort_expires_ascending",
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

  const applicationsValid = applications.filter(
    (application) =>
      getStatus(application.expires, new Date()) != "EXPIRED" &&
      application.archived == false
  );

  const applicationsExpired = applications.filter(
    (application) =>
      getStatus(application.expires, new Date()) == "EXPIRED" &&
      application.archived == false
  );

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-4">
        <input
          placeholder="Søk etter en utlysning..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, search: e.target.value }))
          }
          value={filter.search}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              expires: e.target.value as
                | "sort_expires_ascending"
                | "sort_expires_descending",
            }))
          }
          value={filter.expires}
        >
          <option value="sort_expires_ascending">Sorter frist stigende</option>
          <option value="sort_expires_descending">Sorter frist synkende</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base bg-white shadow-sm focus:outline-none"
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              type: e.target.value as applicationType | "all",
            }))
          }
          value={filter.type}
        >
          <option value="all">Alle</option>
          <option>Drift</option>
          <option>Utvikling</option>
        </select>
      </div>

      <h4 className="text-lg lg:text-xl mt-5 font-semibold text-gray-600">
        Utlysninger tilgjengelig ({applicationsValid.length})
      </h4>
      {applicationsValid.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen utlysninger tilgjengelig
        </h5>
      )}
      {applicationsValid.length > 0 && (
        <div className="mt-[2dvh] flex flex-wrap items-center gap-[2dvh]">
          {applicationsValid.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              mode="view"
            />
          ))}
        </div>
      )}

      <h4 className="text-lg lg:text-xl mt-8 font-semibold text-gray-600">
        Utlysninger utgått ({applicationsExpired.length})
      </h4>
      {applicationsExpired.length == 0 && (
        <h5 className="text-sm lg:text-base text-gray-600">
          Ingen utlysninger utgått
        </h5>
      )}
      {applicationsExpired.length > 0 && (
        <div className="mt-[2dvh] flex flex-wrap items-center gap-[2dvh]">
          {applicationsExpired.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              mode="view"
            />
          ))}
        </div>
      )}
    </>
  );
}
