"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TServerActionResponse } from "@/libs/types";
import { application, applicationType } from "@prisma/client";
import MarkdownDisplay from "@/app/(components)/MarkdownDisplay";

export function ApplicationClient(props: {
  application: application;
  editApplicationServer: (
    input: {
      title: string;
      url: string;
      expires: Date;
      positions: number;
      type: applicationType;
      archivedText: string | null;
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
    archivedText: props.application.archivedText,
  });
  const router = useRouter();
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [showMarkdownDisplay, setShowMarkdownDisplay] = useState(false);

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
    <>
      <MarkdownDisplay
        text={input.archivedText ?? ""}
        show={showMarkdownDisplay}
        function={() => setShowMarkdownDisplay(() => false)}
      />

      <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-</form>400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-600">
          Rediger | {props.application.title}
        </h2>
        <div className="flex flex-col gap-6 mt-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm lg:text-base font-medium">Tittel</label>
              <input
                value={input.title}
                onChange={(e) =>
                  setInput(
                    (prev) => (prev = { ...prev, title: e.target.value })
                  )
                }
                type="text"
                className="text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm lg:text-base font-medium">
                Link til søknad
              </label>
              <input
                value={input.url}
                onChange={(e) =>
                  setInput((prev) => (prev = { ...prev, url: e.target.value }))
                }
                type="text"
                className="text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm lg:text-base font-medium">
                Søknadsfrist
              </label>
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
                }}
                type="date"
                className="text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm lg:text-base font-medium">
                Stillinger
              </label>
              <input
                value={input.positions}
                onChange={(e) =>
                  setInput(
                    (prev) =>
                      (prev = { ...prev, positions: parseInt(e.target.value) })
                  )
                }
                type="number"
                className="text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm lg:text-base font-medium">Fag</label>
              <select
                value={input.type}
                onChange={(e) =>
                  setInput(
                    //@ts-expect-error funker fint
                    (prev) => (prev = { ...prev, type: e.target.value })
                  )
                }
                className="text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option>Drift</option>
                <option>Utvikling</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <label className="text-sm lg:text-base font-medium">
                  Arkivert søknad (valgfri)
                </label>
                <button
                  type="button"
                  className="text-sm lg:text-base bg-blue-500 text-gray-50 py-1 px-3 cursor-pointer rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => setShowMarkdownDisplay(() => true)}
                >
                  Se markdown
                </button>
              </div>
              <textarea
                defaultValue={input.archivedText ?? ""}
                onChange={(e) =>
                  setInput(
                    (prev) => (prev = { ...prev, archivedText: e.target.value })
                  )
                }
                className="h-[20dvh] text-sm lg:text-base rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {status.loading && (
            <p className="text-sm lg:text-base text-gray-600 mt-4">Laster...</p>
          )}
          {status.error && (
            <p className="text-sm lg:text-base text-red-400 mt-4">
              {status.error}
            </p>
          )}
          <div
            className={`flex gap-4 ${
              !status.loading && !status.error ? "mt-6" : "mt-4"
            }`}
          >
            <button
              className="bg-blue-500 text-gray-50 py-2 px-4 text-sm lg:text-base cursor-pointer rounded-md hover:bg-blue-600 transition-colors"
              onClick={editApplicationClient}
            >
              Lagre
            </button>
            <button
              className="bg-red-400 text-gray-50 py-2 px-4 text-sm lg:text-base cursor-pointer rounded-md hover:bg-red-500 transition-colors"
              onClick={deleteApplicationClient}
            >
              Slett
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
