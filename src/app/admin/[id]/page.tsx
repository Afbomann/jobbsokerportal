import { isValidObjectId } from "mongoose";
import NotFound from "@/app/(components)/notFound";
import { Metadata } from "next";
import { ApplicationClient } from "./applicationClient";
import { getApplication } from "@/lib/functions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params_ = await params;

  if (!isValidObjectId(params_.id))
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  const applicationFound = await getApplication(params_.id);

  if (!applicationFound)
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  return {
    title: "Rediger | " + applicationFound.title,
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const params_ = await params;

  if (!isValidObjectId(params_.id)) return <NotFound />;

  const applicationFound = await getApplication(params_.id);

  if (!applicationFound) return <NotFound />;

  return <ApplicationClient application={applicationFound} />;
}
