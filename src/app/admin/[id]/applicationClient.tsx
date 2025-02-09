"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TServerActionResponse } from "@/libs/types";
import { applicationType } from "@prisma/client";

export function ApplicationClient(props: {
  application: {
    id: string;
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
  };
  editApplicationServer: (
    input: {
      title: string;
      url: string;
      expires: Date;
      positions: number;
      type: applicationType;
    },
    id: string
  ) => Promise<TServerActionResponse>;
  deleteApplicationServer: (id: string) => Promise<TServerActionResponse>;
}) {
  const [input, setInput] = useState({
    title: props.application.title,
    url: props.application.url,
    expires: props.application.expires,
    positions: props.application.positions,
    type: props.application.type,
  });
  const router = useRouter();
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  async function editApplicationClient(e: FormEvent) {
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
      .editApplicationServer(input, props.application.id)
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

  async function deleteApplicationClient(e: FormEvent) {
    e.preventDefault();

    setStatus((prev) => (prev = { ...prev, loading: true, error: "" }));

    await props
      .deleteApplicationServer(props.application.id)
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
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-slate-400 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl">
        Rediger | {props.application.title}
      </h2>
      <div className="flex-col my-[3dvh]">
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
            Laster...
          </p>
        )}
        {status.error && (
          <p className="text-sm lg:text-base text-red-400 mt-[10px]">
            {status.error}
          </p>
        )}
        <div
          className={`flex gap-[15px] ${
            !status.loading && !status.error ? "mt-[20px]" : "mt-[5px]"
          }`}
        >
          <button
            className="bg-blue-200 py-[5px] px-[15px] text-sm lg:text-base cursor-pointer rounded-md"
            onClick={editApplicationClient}
          >
            Lagre
          </button>
          <button
            className="bg-red-400 py-[5px] px-[15px] text-sm lg:text-base cursor-pointer rounded-md"
            onClick={deleteApplicationClient}
          >
            Slett
          </button>
        </div>
      </div>
    </div>
  );
}
