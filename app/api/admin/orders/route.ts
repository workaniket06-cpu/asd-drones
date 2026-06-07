import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

const VALID_STATUSES = ["pending","processing","shipped","delivered","cancelled"];

interface Order { id: string; customer: string; email: string; phone: string; items: { productId: number; name: string; qty: number; price: number }[]; total: number; status: string; address: string; createdAt: string; updatedAt: string; }

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  return NextResponse.json(await readDB<Order>("orders"));
}

export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id, status } = await req.json().catch(() => ({}));
  if (!id || !status)
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });

  // ── Validate status value ──
  if (!VALID_STATUSES.includes(status))
    return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });

  const orders = await readDB<Order>("orders");
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  orders[idx].status    = status;
  orders[idx].updatedAt = new Date().toISOString();
  await writeDB("orders", orders);
  return NextResponse.json(orders[idx]);
}
