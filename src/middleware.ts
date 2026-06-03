import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  // "/dashboard",
  // "/profile",
  "/settings",
  "/interview",
  // "/job-matches",
  "/mentors",
  // "/resume-builder",
  // "/resume-templates",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/profile/:path*",
    "/settings/:path*",
    "/interview/:path*",
    // "/job-matches/:path*",
    "/mentors/:path*",
    // "/resume-builder/:path*",
    // "/resume-templates/:path*",
  ],
};
