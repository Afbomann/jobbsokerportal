import { getStatus } from "@/utils";
import { application } from "@prisma/client";

export default function ApplicationCard(props: {
  application: application;
  mode: "view" | "edit";
}) {
  const expiresDate = new Date(props.application.expires);
  const status = getStatus(expiresDate, new Date());

  return (
    <div className="w-[400px] lg:w-[300px] max-w-[100%] rounded-md overflow-hidden shadow-lg p-4 bg-white text-black border border-gray-300">
      <div className="font-bold text-base lg:text-lg mb-2">
        {props.application.title}
      </div>
      <p className="text-sm lg:text-base mb-2 text-gray-700">
        <strong>Fag:</strong> {props.application.type}
      </p>
      <p className="text-sm lg:text-base mb-2 text-gray-700">
        <strong>Stillinger:</strong> {props.application.positions}
      </p>
      <p className="text-sm lg:text-base mb-2 text-gray-700">
        <strong>{status === "VALID" ? "Frist" : "Utgikk"}:</strong>{" "}
        {expiresDate.toLocaleDateString("no")}
      </p>
      {status === "EXPIRED" && (
        <p className="text-sm lg:text-base mb-2 text-red-500">
          Søknadsfristen har utgått!
        </p>
      )}
      {status === "EXPIRES TODAY" && (
        <p className="text-sm lg:text-base mb-2 text-orange-500">
          Søknadsfristen utgår i dag!
        </p>
      )}
      <a
        href={
          props.mode == "view"
            ? props.application.url
            : `/admin/${props.application.id}`
        }
        className="text-blue-500 hover:text-blue-700 text-xs lg:text-sm"
        target={props.mode == "view" ? "_blank" : ""}
        rel="noopener noreferrer"
      >
        {props.mode == "view" ? "Se søknad" : "Rediger"}
      </a>
    </div>
  );
}
