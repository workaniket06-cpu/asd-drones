import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";
import { onOrderCreated } from "@/lib/automation";
import { requireAdmin } from "@/lib/adminAuth";

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

  // Validate required fields
  if (!customer?.trim()) return NextResponse.json({ error: "Customer name required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  if (!phone?.trim()) return NextResponse.json({ error: "Phone required" }, { status: 400 });
  if (!address?.trim()) return NextResponse.json({ error: "Address required" }, { status: 400 });
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });

  // Validate items structure
  for (const item of items) {
    if (!item.productId || !item.name || !item.qty || item.qty < 1 || !item.price || item.price < 0)
      return NextResponse.json({ error: "Invalid item in order" }, { status: 400 });
  }

  const orders = await readDB<Order>("orders");
  const year = new Date().getFullYear();
  const yearOrders = orders.filter(o => o.id.startsWith(`ORD-${year}-`));
  const nextNum = yearOrders.length + 1;
  const orderId = `ORD-${year}-${String(nextNum).padStart(3, "0")}`;

  const total = items.reduce((sum: number, it: OrderItem) => sum + it.price * it.qty, 0);
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    customer: customer.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    items, total,
    status: "pending",
    address: address.trim(),
    createdAt: now, updatedAt: now,
  };

  orders.push(newOrder);
  await writeDB("orders", orders);

  // 🤖 Automation: deduct stock, update customer, send notifications
  onOrderCreated(newOrder).catch(console.error);

  return NextResponse.json({ orderId }, { status: 201 });
}

// GET orders — admin only
export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  return NextResponse.json(await readDB<Order>("orders"));
}
