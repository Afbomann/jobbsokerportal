import { applicationType } from "@prisma/client";

export type TServerActionResponse = { err?: string; suc?: string };

export type TApplicationFilter = {
  search: string;
  expires: "sort_expires_ascending" | "sort_expires_descending";
  type: "all" | applicationType;
};

export type TStatus = {
  loading: boolean;
  error: string;
};
