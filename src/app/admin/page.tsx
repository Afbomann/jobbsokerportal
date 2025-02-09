import { authenticate } from "@/libs/authentication";
import LoginClient from "./loginClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";
import { TServerActionResponse } from "@/libs/types";
import { prisma } from "@/libs/prisma";
import Link from "next/link";
import AdminClient from "./adminClient";

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
    select: {
      id: true,
      title: true,
      url: true,
      expires: true,
      positions: true,
      type: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto outline-slate-400 outline outline-1 p-[20px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl">Admin</h2>

      <div className="mt-[2dvh] flex gap-[15px]">
        <Link
          className="text-sm lg:text-base bg-blue-200 px-[15px] py-[5px] rounded-md"
          href={"/admin/new-application"}
        >
          Opprett ny utlysning
        </Link>
        <form
          action={async () => {
            "use server";

            const cookies_ = await cookies();
            cookies_.delete("token");
          }}
        >
          <button className="text-sm lg:text-base bg-red-400 px-[15px] py-[5px] rounded-md">
            Logg-ut
          </button>
        </form>
      </div>

      <AdminClient applications={applications} />
    </div>
  );
}
