"use server";

import { applicationType } from "@prisma/client";
import { auth, signIn, signOut } from "./auth";
import { TServerActionResponse } from "./types";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import { getApplication } from "./functions";

export async function loginServer(input: {
  username: string;
  password: string;
}): Promise<TServerActionResponse> {
  const session = await auth();

  if (session) return { err: "Du er allerede logget inn." };
  if (!input) return { err: "Input mangler." };

  try {
    await signIn("credentials", {
      redirect: false,
      username: input.username,
      password: input.password,
    });
  } catch {
    return { err: "Feil brukernavn eller passord." };
  }

  return { suc: "Vellykket!" };
}

export async function logoutServer() {
  await signOut({ redirect: true, redirectTo: "/auth/login" });
}

export async function newApplicationServer(input: {
  title: string;
  url: string;
  expires: Date;
  positions: number;
  type: applicationType;
  archivedText: string | null;
}): Promise<TServerActionResponse> {
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

export async function editApplicationServer(
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

export async function deleteApplicationServer(
  id: string
): Promise<TServerActionResponse> {
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
