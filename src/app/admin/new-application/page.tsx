import { redirect } from "next/navigation";
import { Metadata } from "next";
import NewApplicationClient from "./newApplicationClient";
import { TServerActionResponse } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { applicationType } from "@prisma/client";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Jobbsøkerportal - Opprett ny stilling",
  description: "Jobbsøkerportal - Opprett ny stilling",
};

export default async function NewApplicationPage() {
  async function newApplicationServer(input: {
    title: string;
    url: string;
    expires: Date;
    positions: number;
    type: applicationType;
    archivedText: string | null;
  }): Promise<TServerActionResponse> {
    "use server";

    const session = await auth();

    if (!session) return { err: "Uautorisert." };

    if (!input) return { err: "Input mangler." };
    if (!input.title) return { err: "Tittel mangler." };
    if (!input.url) return { err: "Link til søknad mangler." };
    if (!input.expires) return { err: "Søknadsfrist mangler." };
    if (!input.positions && input.positions != 0)
      return { err: "Stillinger mangler." };
    if (!input.type) return { err: "Fag mangler." };

    const applicationCreated = await prisma.application.create({
      data: {
        title: input.title,
        url: input.url,
        expires: input.expires,
        positions: input.positions,
        type: input.type,
        archivedText: input.archivedText,
      },
    });

    revalidateTag("applications");
    revalidateTag("application-" + applicationCreated.id);
    return { suc: "Vellykket!" };
  }

  const session = await auth();

  if (!session) return redirect("/admin");

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-600">
        Opprett ny utlysning
      </h2>
      <NewApplicationClient newApplicationServer={newApplicationServer} />
    </div>
  );
}
