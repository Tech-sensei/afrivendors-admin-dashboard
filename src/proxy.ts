import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/vendors",
  "/customers",
  "/bookings",
  "/custom-requests",
  "/rfs",
  "/categories",
  "/services",
  "/payments",
  "/payouts",
  "/disputes",
  "/reviews",
  "/analytics",
  "/notifications",
  "/admin-accounts",
  "/settings",
  "/profile",
  "/preferences",
  "/system-logs",
];

const authRoutes = ["/sign-in"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtected && !hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vendors/:path*",
    "/customers/:path*",
    "/bookings/:path*",
    "/custom-requests/:path*",
    "/rfs/:path*",
    "/categories/:path*",
    "/services",
    "/payments/:path*",
    "/payouts/:path*",
    "/disputes/:path*",
    "/reviews/:path*",
    "/analytics/:path*",
    "/notifications/:path*",
    "/admin-accounts/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/preferences/:path*",
    "/system-logs/:path*",
    "/sign-in",
  ],
};
