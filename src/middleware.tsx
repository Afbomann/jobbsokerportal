import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (request) => {
  if (request.nextUrl.pathname.startsWith("/admin") && !request.auth) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin)
    );
  }

  if (request.nextUrl.pathname === "/auth/login" && request.auth) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
  }

  NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
