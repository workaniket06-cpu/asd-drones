import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("asd_admin_session")?.value;
  const expectedValue = process.env.ADMIN_SESSION_SECRET || "asd_admin_secret_2026";
  let dbStatus = "not tested";
  let productCount = 0;

  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();
    productCount = await db.collection("products").countDocuments();
    dbStatus = "connected";
  } catch (e) {
    dbStatus = `error: ${e}`;
  }

  return NextResponse.json({
    cookie_present: !!sessionCookie,
    cookie_matches: sessionCookie === expectedValue,
    db_status: dbStatus,
    product_count: productCount,
    env_mongodb: !!process.env.MONGODB_URI,
    env_admin_user: process.env.ADMIN_USERNAME || "not set",
  });
}
