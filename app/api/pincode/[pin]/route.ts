import { NextResponse } from "next/server";
import { lookupPincode } from "@/lib/pincodes";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
  }

  const result = lookupPincode(pin);
  if (!result) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ found: true, city: result.city, state: result.state });
}
