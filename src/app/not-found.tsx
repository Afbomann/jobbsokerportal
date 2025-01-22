import { Metadata } from "next";
import NotFound from "./(components)/notFound";

export const metadata: Metadata = {
  title: "404 | Ikke funnet",
  description: "404 | Ikke funnet",
};

export default function NotFoundPage() {
  return <NotFound />;
}
