import { NextResponse } from "next/server";
import { readDB } from "@/lib/adminData";

interface Report {
  id: string; date: string; type: "daily" | "weekly";
  totalOrders: number; totalRevenue: number; newCustomers: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  createdAt: string;
}

export async function GET() {
  const reports = await readDB<Report>("reports");
  return NextResponse.json(reports);
}
