import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminSession } from "@/lib/adminAuth";

// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }
  if (entry.count >= 5) return false; // max 5 attempts per 15 min
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  if (!checkRateLimit(ip))
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const { username, password } = await req.json().catch(() => ({}));
  if (!username || !password)
    return NextResponse.json({ error: "Username and password required." }, { status: 400 });

  if (!verifyAdminCredentials(username, password)) {
    // Constant-time delay to prevent timing attacks
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Clear rate limit on success
  attempts.delete(ip);

  const res = NextResponse.json({ message: "Admin login successful." });
  setAdminSession(res);
  return res;
}
