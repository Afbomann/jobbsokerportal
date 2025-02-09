"use client";

import { TServerActionResponse } from "@/libs/types";
import { applicationType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewApplicationClient(props: {
  newApplicationServer: (input: {
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
  }) => Promise<TServerActionResponse>;
}) {
  const router = useRouter();
  const [input, setInput] = useState<{
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
  }>({
    title: "",
    url: "",
    expires: new Date(),
    positions: 0,
    type: "Drift",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  async function newApplicationClient(e: FormEvent) {
    e.preventDefault();

    if (!input.title)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Tittel mangler." })
      );

    if (!input.url)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Link til søknad mangler." })
      );

    if (!input.expires)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Søknadsfrist mangler." })
      );

    if (!input.positions)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Stillinger mangler." })
      );

    if (!input.type)
      return setStatus((prev) => (prev = { ...prev, error: "Fag mangler." }));

    setStatus((prev) => (prev = { ...prev, loading: true, error: "" }));

    await props
      .newApplicationServer(input)
      .then((response) => {
        if (response.err) {
          setStatus(
            (prev) => (prev = { ...prev, loading: false, error: response.err! })
          );
        } else {
          setStatus((prev) => (prev = { ...prev, loading: false, error: "" }));
          router.push("/admin");
        }
      })
      .catch((err: string) =>
        setStatus((prev) => (prev = { ...prev, loading: false, error: err }))
      );
  }

  return (
    <form onSubmit={newApplicationClient} className="flex-col my-[3dvh]">
      <div className="flex gap-[20px] flex-wrap">
        <div className="flex flex-col gap-[3px] w-full">
          <label className="text-sm lg:text-base">Tittel</label>
          <input
            value={input.title}
            onChange={(e) =>
              setInput((prev) => (prev = { ...prev, title: e.target.value }))
            }
            type="text"
            className="text-sm lg:text-base rounded-md px-[8px] py-[4px] outline outline-1 outline-slate-300"
          />
        </div>
        <div className="flex flex-col gap-[3px] w-full">
          <label className="text-sm lg:text-base">Link til søknad</label>
          <input
            value={input.url}
            onChange={(e) =>
              setInput((prev) => (prev = { ...prev, url: e.target.value }))
            }
            type="text"
            className="text-sm lg:text-base rounded-md px-[8px] py-[4px] outline outline-1 outline-slate-300"
          />
        </div>
        <div className="flex flex-col gap-[3px]">
          <label className="text-sm lg:text-base">Søknadsfrist</label>
          <input
            value={input.expires.toISOString().split("T")[0]}
            onChange={(e) => {
              //@ts-nocheck
              setInput(
                (prev) =>
                  (prev = {
                    ...prev,
                    expires: new Date(e.target.value),
                  })
              );
              console.log(e.target.value);
            }}
            type="date"
            className="text-sm lg:text-base rounded-md px-[8px] py-[4px] outline outline-1 outline-slate-300 bg-white"
          />
        </div>
        <div className="flex flex-col gap-[3px]">
          <label className="text-sm lg:text-base">Stillinger</label>
          <input
            value={input.positions}
            onChange={(e) =>
              setInput(
                (prev) =>
                  (prev = { ...prev, positions: parseInt(e.target.value) })
              )
            }
            type="number"
            className="text-sm lg:text-base rounded-md px-[8px] py-[4px] outline outline-1 outline-slate-300"
          />
        </div>
        <div className="flex flex-col gap-[3px]">
          <label className="text-sm lg:text-base">Fag</label>
          <select
            value={input.type}
            onChange={(e) =>
              setInput(
                //@ts-expect-error funker fint
                (prev) => (prev = { ...prev, type: e.target.value })
              )
            }
            className="text-sm lg:text-base rounded-md px-[8px] py-[4px] outline outline-1 outline-slate-300 bg-white"
          >
            <option>Drift</option>
            <option>Utvikling</option>
          </select>
        </div>
      </div>
      {status.loading && (
        <p className="text-sm lg:text-base text-gray-600 mt-[10px]">
          Oppretter utlysning...
        </p>
      )}
      {status.error && (
        <p className="text-sm lg:text-base text-red-400 mt-[10px]">
          {status.error}
        </p>
      )}
      <input
        className={`bg-blue-200 py-[5px] px-[15px] text-sm lg:text-base cursor-pointer rounded-md ${
          !status.loading && !status.error ? "mt-[20px]" : "mt-[5px]"
        }`}
        type="submit"
        value="Opprett"
      />
    </form>
  );
}
