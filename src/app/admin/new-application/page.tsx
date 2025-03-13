import { Metadata } from "next";
import NewApplicationClient from "./newApplicationClient";

export const metadata: Metadata = {
  title: "Opprett ny stilling",
};

export default async function NewApplicationPage() {
  return (
    <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-600">
        Opprett ny utlysning
      </h2>
      <NewApplicationClient />
    </div>
  );
}
