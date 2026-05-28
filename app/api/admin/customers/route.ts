import { NextResponse } from "next/server";
import { readDB } from "@/lib/adminData";

export async function GET() {
  return NextResponse.json(await readDB("customers"));
}
