import { applicationType } from "@prisma/client";

export type TServerActionResponse = { err?: string; suc?: string };
export type TApplicationFilter = {
  expires: "sort_expires_ascending" | "sort_expires_descending";
  type: "all" | applicationType;
};
