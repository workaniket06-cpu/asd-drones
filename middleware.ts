import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "asd_admin_session";
const SESSION_VALUE  = process.env.ADMIN_SESSION_SECRET || "asd_admin_secret_2026";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page — no auth needed
  if (pathname === "/admin/login") {
    // If already logged in, redirect to dashboard
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (token === SESSION_VALUE) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (token !== SESSION_VALUE) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
