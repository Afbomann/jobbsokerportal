import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import NotFound from "@/app/(components)/notFound";
import { prisma } from "@/libs/prisma";
import { Metadata } from "next";
import { ApplicationClient } from "./applicationClient";
import { TServerActionResponse } from "@/libs/types";
import { revalidateTag } from "next/cache";
import { applicationType } from "@prisma/client";
import { auth } from "@/auth";
import { getApplication } from "@/libs/functions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const session = await auth();

  if (!session) return {};

  const params_ = await params;

  if (!isValidObjectId(params_.id))
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  const applicationFound = await getApplication(params_.id);

  if (!applicationFound)
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  return {
    title: `Jobbsøkerportal - ${applicationFound.title}`,
    description: `Jobbsøkerportal - ${applicationFound.title}`,
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  async function editApplicationServer(
    input: {
      title: string;
      url: string;
      expires: Date;
      positions: number;
      type: applicationType;
      archivedText: string | null;
    },
    id: string
  ): Promise<TServerActionResponse> {
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
    if (!id) return { err: "ID mangler." };

    const applicationFound = await getApplication(id);

    if (!applicationFound) return { err: `Søknad ikke funnet | ID: ${id}` };

    await prisma.application.update({
      where: { id: id },
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
    revalidateTag("application-" + id);
    return { suc: "Vellykket!" };
  }

  async function deleteApplicationServer(
    id: string
  ): Promise<TServerActionResponse> {
    "use server";

    const session = await auth();

    if (!session) return { err: "Uautorisert." };

    if (!id) return { err: "ID mangler." };

    const applicationFound = await getApplication(id);

    if (!applicationFound) return { err: `Søknad ikke funnet | ID: ${id}` };

    await prisma.application.delete({
      where: { id: id },
    });

    revalidateTag("applications");
    revalidateTag("application-" + id);
    return { suc: "Vellykket!" };
  }

  const session = await auth();

  if (!session) return redirect("/admin");

  const params_ = await params;

  if (!isValidObjectId(params_.id)) return <NotFound />;

  const applicationFound = await getApplication(params_.id);

  if (!applicationFound) return <NotFound />;

  return (
    <ApplicationClient
      application={applicationFound}
      editApplicationServer={editApplicationServer}
      deleteApplicationServer={deleteApplicationServer}
    />
  );
}
