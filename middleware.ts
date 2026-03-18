import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/teacher")) {
    if (!isAuth || (token.role !== "ADMIN" && token.role !== "TEACHER")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/dashboard/:path*"],
};
