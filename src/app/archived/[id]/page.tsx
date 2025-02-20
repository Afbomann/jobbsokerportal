import { isValidObjectId } from "mongoose";
import NotFound from "../../(components)/notFound";
import { prisma } from "@/libs/prisma";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params_ = await params;

  if (!isValidObjectId(params_.id))
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  const applicationFound = await prisma.application.findFirst({
    where: { id: params_.id },
  });

  if (!applicationFound)
    return { title: "404 | Ikke funnet", description: "404 | Ikke funnet" };

  return {
    title: `${applicationFound.title} - Jobbsøkerportal`,
    description: `${applicationFound.title} - Jobbsøkerportal`,
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const params_ = await params;

  if (!isValidObjectId(params_.id)) return <NotFound />;

  const applicationFound = await prisma.application.findFirst({
    where: { id: params_.id },
  });

  if (!applicationFound) return <NotFound />;

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-600">
        {applicationFound.title} | Arkivert søknad | Sist oppdatert{" "}
        {applicationFound.updatedAt.toLocaleDateString("no")}
      </h2>

      {!applicationFound.archivedText && (
        <p className="text-sm lg:text-base mt-[2dvh] text-gray-600 leading-relaxed">
          Denne utlysningen har ingen arkivert søknad lagret.
        </p>
      )}

      {applicationFound.archivedText && (
        <ReactMarkdown
          className="flex flex-col gap-3 mt-[2dvh] text-gray-600 leading-relaxed flex-1 text-sm lg:text-base"
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-xl lg:text-2xl font-semibold" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-lg lg:text-xl font-semibold" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="p-[20px] flex flex-col gap-2" {...props} />
            ),
            li: ({ ...props }) => <li className="list-disc" {...props} />,
          }}
        >
          {applicationFound.archivedText}
        </ReactMarkdown>
      )}
    </div>
  );
}
