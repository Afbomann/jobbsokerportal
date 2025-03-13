import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Brukernavn", type: "text" },
        password: { label: "Passord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { username, password } = credentials as {
          username?: string;
          password?: string;
        };

        if (!username || !password) return null;

        if (
          username != process.env.ADMIN_USERNAME ||
          !(await bcrypt.compare(password, process.env.ADMIN_PASSWORD!))
        ) {
          return null;
        }

        return { id: "1", name: process.env.ADMIN_USERNAME };
      },
    }),
  ],
});
