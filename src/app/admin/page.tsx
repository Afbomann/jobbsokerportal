import { authenticate } from "@/libs/authentication";
import LoginClient from "./loginClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";
import { TServerActionResponse } from "@/libs/types";
import { prisma } from "@/libs/prisma";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const authenticated = await authenticate();

  if (!authenticated)
    return {
      title: "Jobbsøkerportal - Admin login",
      description: "Jobbsøkerportal - Admin login",
    };

  return {
    title: "Jobbsøkerportal - Admin",
    description: "Jobbsøkerportal - Admin",
  };
}

export default async function AdminPage() {
  async function loginServer(input: {
    username: string;
    password: string;
  }): Promise<TServerActionResponse> {
    "use server";

    const authenticated = await authenticate();

    if (authenticated) return { err: "Du er allerede logget inn." };
    if (!input) return { err: "Input mangler." };
    if (!input.username) return { err: "Skriv inn brukernavn." };
    if (!input.password) return { err: "Skriv inn passord." };

    if (
      input.username != process.env.ADMIN_USERNAME ||
      input.password != process.env.ADMIN_PASSWORD
    )
      return { err: "Feil brukernavn eller passord." };

    const cookies_ = await cookies();
    const token = jsonwebtoken.sign(
      { data: true },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: "1h" }
    );
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    cookies_.set("token", token, {
      expires: expires,
      httpOnly: true,
      secure: true,
    });

    return { suc: "Vellykket!" };
  }

  const authenticated = await authenticate();

  if (!authenticated) return <LoginClient loginServer={loginServer} />;

  const applications = await prisma.application.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-gray-300 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl">Admin</h2>

      <div className="mt-[2dvh] flex gap-[15px]">
        <Link
          className="text-sm lg:text-base bg-blue-200 px-[15px] py-[5px] rounded-sm shadow-sm"
          href={"/admin/new-application"}
        >
          Opprett ny søknad
        </Link>
        <form
          action={async () => {
            "use server";

            const cookies_ = await cookies();
            cookies_.delete("token");
          }}
        >
          <button className="text-sm lg:text-base bg-red-400 px-[15px] py-[5px] rounded-sm shadow-sm">
            Logg-ut
          </button>
        </form>
      </div>

      {applications.length > 0 && (
        <div className="mt-[2dvh] flex flex-col gap-[2dvh]">
          {applications.map((application) => (
            <div
              className="bg-white rounded-sm p-[13px] shadow-md flex flex-col gap-[3px]"
              key={application.id}
            >
              <div className="flex gap-[10px] items-center">
                <p className="text-base lg:text-lg mr-auto">
                  <b>{application.title}</b>
                </p>
                <Link
                  className="bg-blue-200 px-[15px] py-[5px] rounded-sm shadow-sm text-sm lg:text-base"
                  href={`/admin/${application.id}`}
                >
                  Rediger
                </Link>
              </div>
              <Link
                target="_blank"
                className="underline text-blue-400 text-sm lg:text-base w-fit"
                href={application.url}
              >
                Link til søknad
              </Link>
              <p className="text-sm lg:text-base">
                Frist: {application.expires.toLocaleDateString("NO")} |
                Stillinger: {application.positions}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
