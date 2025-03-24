"use server";

import { auth, signIn, signOut } from "./auth";
import { TServerActionResponse } from "./types";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import { getApplication } from "./functions";
import { z } from "zod";
import { ApplicationSchema, LoginSchema } from "./zod";

export async function loginServer(
  input: z.infer<typeof LoginSchema>
): Promise<TServerActionResponse> {
  const session = await auth();

  if (session) return { err: "Du er allerede logget inn." };

  const parsed = LoginSchema.safeParse(input);

  if (!parsed.success) return { err: parsed.error.errors[0].message };

  try {
    await signIn("credentials", {
      redirect: false,
      username: parsed.data.username,
      password: parsed.data.password,
    });
  } catch {
    return { err: "Feil brukernavn eller passord." };
  }

  return { suc: "Vellykket!" };
}

export async function logoutServer() {
  await signOut({ redirect: true, redirectTo: "/auth/login" });
}

export async function newApplicationServer(
  input: z.infer<typeof ApplicationSchema>
): Promise<TServerActionResponse> {
  const session = await auth();

  if (!session) return { err: "Uautorisert." };

  const parsed = ApplicationSchema.safeParse(input);

  if (!parsed.success) return { err: parsed.error.errors[0].message };

  const applicationCreated = await prisma.application.create({
    data: {
      ...parsed.data,
    },
  });

  revalidateTag("applications");
  revalidateTag("application-" + applicationCreated.id);

  return { suc: "Vellykket!" };
}

export async function editApplicationServer(
  input: z.infer<typeof ApplicationSchema>,
  id: string
): Promise<TServerActionResponse> {
  const session = await auth();

  if (!session) return { err: "Uautorisert." };

  const parsed = ApplicationSchema.safeParse(input);

  if (!parsed.success) return { err: parsed.error.errors[0].message };

  if (!id) return { err: "ID mangler." };

  const applicationFound = await getApplication(id);

  if (!applicationFound) return { err: `Søknad ikke funnet | ID: ${id}` };

  await prisma.application.update({
    where: { id: id },
    data: {
      ...parsed.data,
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
