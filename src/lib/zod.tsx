import { applicationType } from "@prisma/client";
import z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Skriv inn brukernavn." }),
  password: z.string().min(1, { message: "Skriv inn passord." }),
});

export const ApplicationSchema = z.object({
  title: z.string().min(1, { message: "Tittel mangler." }),
  url: z.string().min(1, { message: "Link til søknad mangler." }),
  expires: z.date({ message: "Søknadsfrist mangler." }),
  positions: z.number().min(1, { message: "Stillinger mangler." }),
  type: z.nativeEnum(applicationType, { message: "Fag mangler." }),
  archivedText: z.string(),
});
