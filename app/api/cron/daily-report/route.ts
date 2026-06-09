import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/automation";

// Called daily at 11:59 PM by Vercel Cron (configured in vercel.json)
// Also callable manually: GET /api/cron/daily-report?secret=asd_cron_2026
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const validSecret = process.env.CRON_SECRET || "asd_cron_2026";
  if (secret !== validSecret && process.env.NODE_ENV === "production")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = (req.nextUrl.searchParams.get("type") as "daily" | "weekly") || "daily";
  const report = await generateReport(type);
  return NextResponse.json({ message: "Report generated", report });
}
