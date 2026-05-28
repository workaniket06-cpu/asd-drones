import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB, writeDB, nextId } from "@/lib/adminData";

interface Customer {
  id: number; name: string; email: string; phone: string;
  city: string; state: string; orders: number; totalSpent: number;
  status: string; joinedAt: string; passwordHash: string;
}

export async function POST(req: NextRequest) {
  const { name, email, password, phone, city, state } = await req.json().catch(() => ({}));

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

  const customers = await readDB<Customer>("customers");

  if (customers.find((c) => c.email.toLowerCase() === email.toLowerCase()))
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);

  const newCustomer: Customer = {
    id: nextId(customers),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || "",
    city: city?.trim() || "",
    state: state?.trim() || "",
    orders: 0, totalSpent: 0, status: "active",
    joinedAt: new Date().toISOString(),
    passwordHash,
  };

  customers.push(newCustomer);
  await writeDB("customers", customers);

  const { passwordHash: _, ...safeCustomer } = newCustomer;
  const res = NextResponse.json({ message: "Account created successfully", customer: safeCustomer }, { status: 201 });
  res.cookies.set("asd_session", JSON.stringify({ id: safeCustomer.id, name: safeCustomer.name, email: safeCustomer.email }), {
    httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax",
  });
  return res;
}
