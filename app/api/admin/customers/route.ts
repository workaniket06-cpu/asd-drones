import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const customers = await readDB<Record<string, unknown>>("customers");
  // Strip password hashes before sending
  const safe = customers.map(({ passwordHash: _, ...c }) => c);
  return NextResponse.json(safe);
}
