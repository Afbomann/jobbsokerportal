import NextAuth from "next-auth";
import AuthConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({ ...AuthConfig });
