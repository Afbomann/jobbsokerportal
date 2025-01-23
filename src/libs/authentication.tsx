import jsonwebtoken from "jsonwebtoken";
import { cookies } from "next/headers";

export async function authenticate(): Promise<boolean> {
  const cookies_ = await cookies();
  const cookie = cookies_.get("token");

  if (!cookie) return false;

  return await new Promise((resolve) => {
    jsonwebtoken.verify(cookie.value, process.env.ADMIN_JWT_SECRET!, (err) => {
      if (err) return resolve(false);

      return resolve(true);
    });

    resolve(false);
  });
}
