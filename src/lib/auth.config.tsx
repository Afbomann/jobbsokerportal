import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const AuthConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Brukernavn", type: "text" },
        password: { label: "Passord", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (
          username !== process.env.ADMIN_USERNAME ||
          !(await bcrypt.compare(password, process.env.ADMIN_PASSWORD!))
        ) {
          return null;
        }

        return { id: "1", name: process.env.ADMIN_USERNAME };
      },
    }),
  ],
};

export default AuthConfig;
