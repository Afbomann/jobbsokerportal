import { redirect } from "next/navigation";
import { authenticate } from "@/libs/authentication";
import { Metadata } from "next";
import NewApplicationClient from "./newApplicationClient";
import { TServerActionResponse } from "@/libs/types";
import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Jobbsøkeportal - Opprett ny stilling",
  description: "Jobbsøkeportal - Opprett ny stilling",
};

export default async function NewApplicationPage() {
  async function newApplicationServer(input: {
    title: string;
    url: string;
    expires: Date;
    positions: number;
  }): Promise<TServerActionResponse> {
    "use server";

    const authenticated = await authenticate();

    if (!authenticated) return { err: "Uautorisert." };

    if (!input) return { err: "Input mangler." };
    if (!input.title) return { err: "Tittel mangler." };
    if (!input.url) return { err: "Link til søknad mangler." };
    if (!input.expires) return { err: "Søknadsfrist mangler." };
    if (!input.positions && input.positions != 0)
      return { err: "Stillinger mangler." };
    console.log(input.expires);
    await prisma.application.create({
      data: {
        title: input.title,
        url: input.url,
        expires: input.expires,
        positions: input.positions,
      },
    });

    revalidatePath("/admin");
    return { suc: "Vellykket!" };
  }

  const authenticated = await authenticate();

  if (!authenticated) return redirect("/admin");

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-gray-300 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl">Opprett ny søknad</h2>
      <NewApplicationClient newApplicationServer={newApplicationServer} />
    </div>
  );
}
