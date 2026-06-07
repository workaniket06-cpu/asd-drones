import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB } from "@/lib/adminData";

interface Customer {
  id: number; name: string; email: string; phone: string;
  city: string; state: string; orders: number; totalSpent: number;
  status: string; joinedAt: string; passwordHash: string;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

  const customers = await readDB<Customer>("customers");
  const customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

  if (!customer || !customer.passwordHash)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const session = { id: customer.id, name: customer.name, email: customer.email };
  const res = NextResponse.json({ message: "Login successful", customer: session });
  res.cookies.set("asd_session", JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
