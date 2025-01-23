import { authenticate } from "@/libs/authentication";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import NotFound from "@/app/(components)/notFound";
import { prisma } from "@/libs/prisma";
import { Metadata } from "next";
import { ApplicationClient } from "./applicationClient";
import { TServerActionResponse } from "@/libs/types";
import { revalidatePath } from "next/cache";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const authenticated = await authenticate();

  if (!authenticated) return {};

  const params_ = await params;

  if (!isValidObjectId(params_.id))
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  const applicationFound = await prisma.application.findFirst({
    where: { id: params_.id },
  });

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
    },
    id: string
  ): Promise<TServerActionResponse> {
    "use server";

    const authenticated = await authenticate();

    if (!authenticated) return { err: "Uautorisert." };

    if (!input) return { err: "Input mangler." };
    if (!input.title) return { err: "Tittel mangler." };
    if (!input.url) return { err: "Link til søknad mangler." };
    if (!input.expires) return { err: "Søknadsfrist mangler." };
    if (!input.positions && input.positions != 0)
      return { err: "Stillinger mangler." };
    if (!id) return { err: "ID mangler." };

    const applicationFound = await prisma.application.findFirst({
      where: { id: id },
    });

    if (!applicationFound) return { err: `Søknad ikke funnet | ID: ${id}` };

    await prisma.application.update({
      where: { id: id },
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

  async function deleteApplicationServer(
    id: string
  ): Promise<TServerActionResponse> {
    "use server";

    const authenticated = await authenticate();

    if (!authenticated) return { err: "Uautorisert." };

    if (!id) return { err: "ID mangler." };

    const applicationFound = await prisma.application.findFirst({
      where: { id: id },
    });

    if (!applicationFound) return { err: `Søknad ikke funnet | ID: ${id}` };

    await prisma.application.delete({
      where: { id: id },
    });

    revalidatePath("/admin");
    return { suc: "Vellykket!" };
  }

  const authenticated = await authenticate();

  if (!authenticated) return redirect("/admin");

  const params_ = await params;

  if (!isValidObjectId(params_.id)) return <NotFound />;

  const applicationFound = await prisma.application.findFirst({
    where: { id: params_.id },
  });

  if (!applicationFound) return <NotFound />;

  return (
    <ApplicationClient
      application={{
        id: applicationFound.id,
        title: applicationFound.title,
        url: applicationFound.url,
        expires: applicationFound.expires,
        positions: applicationFound.positions,
      }}
      editApplicationServer={editApplicationServer}
      deleteApplicationServer={deleteApplicationServer}
    />
  );
}
