import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-fit max-w-[85%] mx-auto mt-[15dvh] flex flex-col items-center gap-[1dvh] bg-slate-100 p-[25px] rounded-sm shadow-sm bg-opacity-50">
      <h3 className="text-lg lg:text-xl">404 | Ikke funnet</h3>
      <Link
        className="text-base lg:text-lg bg-blue-200 px-[15px] py-[5px] rounded-sm shadow-sm"
        href="/"
      >
        Tilbake til start
      </Link>
    </div>
  );
}
