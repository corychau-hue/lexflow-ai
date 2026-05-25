import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow auth API routes, static files, and the login page
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }
  // For all other routes, let the page handle auth check client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
