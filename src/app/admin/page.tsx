import { auth, signIn, signOut } from "@/auth";
import LoginClient from "./loginClient";
import { Metadata } from "next";
import { TServerActionResponse } from "@/libs/types";
import Link from "next/link";
import AdminClient from "./adminClient";
import { getApplications } from "@/libs/functions";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  if (!session)
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

  const session = await auth();

  if (!session) return <LoginClient loginServer={loginServer} />;

  const applications = await getApplications();

  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-600">
        Admin Dashboard
      </h2>

      <div className="mt-4 flex gap-4">
        <Link
          className="text-sm lg:text-base bg-blue-500 text-gray-50 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
          href={"/admin/new-application"}
        >
          Opprett ny utlysning
        </Link>
        <form
          action={async () => {
            "use server";

            await signOut();
          }}
        >
          <button className="text-sm lg:text-base bg-red-500 text-gray-50 px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors">
            Logg ut
          </button>
        </form>
      </div>

      <AdminClient applications={applications} />
    </div>
  );
}
