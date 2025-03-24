import { Metadata } from "next";
import Link from "next/link";
import AdminClient from "./adminClient";
import { getApplications } from "@/lib/functions";
import { logoutServer } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
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
        <form action={logoutServer}>
          <button className="text-sm lg:text-base bg-red-500 text-gray-50 px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors">
            Logg ut
          </button>
        </form>
      </div>

      <AdminClient applications={applications} />
    </div>
  );
}
