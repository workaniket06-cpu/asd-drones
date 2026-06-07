import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/adminAuth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out." });
  clearAdminSession(res);
  return res;
}
