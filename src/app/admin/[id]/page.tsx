import { authenticate } from "@/libs/authentication";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import NotFound from "@/app/(components)/notFound";
import { prisma } from "@/libs/prisma";

export default async function ApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const authenticated = await authenticate();

  if (!authenticated) return redirect("/admin");

  const params_ = await params;

  if (!isValidObjectId(params_.id)) return <NotFound />;

  const applicationFound = await prisma.application.findFirst({
    where: { id: params_.id },
  });

  if (!applicationFound) return <NotFound />;

  //return client page
}
