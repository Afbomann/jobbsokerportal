import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-fit max-w-[85%] mx-auto mt-[15dvh] flex flex-col items-center gap-[1dvh] bg-white p-[25px] rounded-lg shadow-lg">
      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
        404 | Ikke funnet
      </h3>
      <p className="text-base lg:text-lg text-gray-600 mb-4">
        Siden du leter etter finnes ikke.
      </p>
      <Link
        className="text-base lg:text-lg bg-blue-500 text-white px-[20px] py-[10px] rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        href="/"
      >
        Tilbake til start
      </Link>
    </div>
  );
}
