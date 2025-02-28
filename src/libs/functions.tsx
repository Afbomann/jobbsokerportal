"server-only";

import { prisma } from "@/libs/prisma";
import type { application } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getApplications(): Promise<application[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("applications");

  const applications = await prisma.application.findMany({
    orderBy: { id: "desc" },
  });

  return applications;
}

export async function getApplication(id: string): Promise<application | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("application-" + id);

  const application = await prisma.application.findFirst({
    where: { id: id },
  });

  return application;
}
