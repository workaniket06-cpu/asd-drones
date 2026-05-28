import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";

interface Order { id: string; customer: string; email: string; phone: string; items: { productId: number; name: string; qty: number; price: number }[]; total: number; status: string; address: string; createdAt: string; updatedAt: string; }

export async function GET() {
  return NextResponse.json(await readDB<Order>("orders"));
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const orders = await readDB<Order>("orders");
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  await writeDB("orders", orders);
  return NextResponse.json(orders[idx]);
}
