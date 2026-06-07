import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USER     = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS     = process.env.ADMIN_PASSWORD || "asd@drones2026";
const SESSION_COOKIE = "asd_admin_session";
const SESSION_VALUE  = process.env.ADMIN_SESSION_SECRET || "asd_admin_secret_2026";

/** Verify admin session — use in every /api/admin/* route */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token !== SESSION_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // authorized — proceed
}

/** Called by /api/auth/admin-login */
export function verifyAdminCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

/** Set admin session cookie */
export function setAdminSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/** Clear admin session cookie */
export function clearAdminSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  });
}

/** Server-side: check if admin is logged in (for page components) */
export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}
