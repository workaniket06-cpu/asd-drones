import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";

interface OrderItem { productId: number; name: string; qty: number; price: number; }
interface Order {
  id: string; customer: string; email: string; phone: string;
  items: OrderItem[]; total: number; status: string;
  address: string; createdAt: string; updatedAt: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { customer, email, phone, address, items } = body;
  if (!customer || !email || !phone || !address || !Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const orders = await readDB<Order>("orders");

  const year = new Date().getFullYear();
  const yearOrders = orders.filter(o => o.id.startsWith(`ORD-${year}-`));
  const nextNum = yearOrders.length + 1;
  const orderId = `ORD-${year}-${String(nextNum).padStart(3, "0")}`;

  const total = items.reduce((sum: number, it: OrderItem) => sum + it.price * it.qty, 0);
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId, customer, email, phone, items, total,
    status: "pending", address, createdAt: now, updatedAt: now,
  };

  orders.push(newOrder);
  await writeDB("orders", orders);

  return NextResponse.json({ orderId }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(await readDB<Order>("orders"));
}
