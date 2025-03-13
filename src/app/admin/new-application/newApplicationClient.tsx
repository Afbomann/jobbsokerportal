"use client";

import MarkdownDisplay from "@/app/(components)/MarkdownDisplay";
import { newApplicationServer } from "@/lib/actions";
import { ApplicationSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

export default function NewApplicationClient() {
  const router = useRouter();
  const [input, setInput] = useState<z.infer<typeof ApplicationSchema>>({
    title: "",
    url: "",
    expires: new Date(),
    positions: 0,
    type: "Drift",
    archivedText: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [showMarkdownDisplay, setShowMarkdownDisplay] = useState(false);

  async function newApplicationClient(e: FormEvent) {
    e.preventDefault();

    const parsed = ApplicationSchema.safeParse(input);

    if (!parsed.success) {
      return setStatus(
        (prev) => (prev = { ...prev, error: parsed.error.errors[0].message })
      );
    }

    setStatus((prev) => (prev = { ...prev, loading: true, error: "" }));

    await newApplicationServer(parsed.data)
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

      <form
        onSubmit={newApplicationClient}
        className="flex flex-col gap-6 mt-7"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm lg:text-base font-medium">Tittel</label>
            <input
              value={input.title}
              onChange={(e) =>
                setInput((prev) => (prev = { ...prev, title: e.target.value }))
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
          <p className="text-sm lg:text-base text-gray-600 mt-4">
            Oppretter utlysning...
          </p>
        )}
        {status.error && (
          <p className="text-sm lg:text-base text-red-400 mt-4">
            {status.error}
          </p>
        )}
        <input
          className={`bg-blue-500 text-gray-50 py-2 px-4 text-sm lg:text-base cursor-pointer rounded-md hover:bg-blue-600 transition-colors ${
            !status.loading && !status.error ? "mt-6" : "mt-4"
          }`}
          type="submit"
          value="Opprett"
        />
      </form>
    </>
  );
}
