import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth-edge";
import type { AppUserRole } from "@/lib/auth";

const ADMIN_ROLES: AppUserRole[] = ["admin", "manager"];

export default auth((req) => {
  const { nextUrl } = req;
  const userRole = req.auth?.user?.role as AppUserRole | undefined;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!ADMIN_ROLES.includes(userRole ?? "customer")) {
      const signInUrl = new URL("/api/auth/signin", nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
