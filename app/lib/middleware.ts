import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("sb-access-token");

const protectedRoutes = ["/Exchanges", "/Profile", "/admin"];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/SignUp", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Exchanges/:path*", "/Profile/:path*", "/admin/:path*"],
};